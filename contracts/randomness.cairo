# Declare this file as a StarkNet contract and set the required
# builtins.
%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.math_cmp import is_not_zero
from starkware.cairo.common.hash import hash2

# -----------------------------------------------------------------
# Number of commitments received
@storage_var
func s_total_commitments() -> (res : felt):
end

# Mapping from indexes to addresses who commited
@storage_var
func s_commiters(id : felt) -> (res : felt):
end

# Mapping from commiter address to their commitment
@storage_var
func s_commitments(address : felt) -> (res : felt):
end
# -----------------------------------------------------------------

# Store the commitment to the value that will be stored for randomness
@external
func commit_to_secret{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        commitment_hash : felt):
    let (msg_sender) = get_caller_address()

    let (curr_commit) = s_commitments.read(msg_sender)
    let (cond : felt) = is_not_zero(curr_commit)
    if cond == 1:
        return ()
    end

    let (n_commiters) = s_total_commitments.read()
    s_commiters.write(id=n_commiters, value=msg_sender)
    s_commitments.write(address=msg_sender, value=commitment_hash)

    s_total_commitments.write(n_commiters + 1)

    return ()
end

@view
func verify_commitments{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        secrets_len : felt, secrets : felt*, addresses_len : felt, addresses : felt*):
    with_attr error_message(
            "==================== ERROR: Number of signers doesen't match the number of observations =============="):
        assert secrets_len = addresses_len
    end

    if secrets_len == 0:
        return ()
    end

    let addr = addresses[0]

    let (commitment : felt) = s_commitments.read(address=addr)

    let _secret = secrets[0]
    let (hashed_secret : felt) = hash2{hash_ptr=pedersen_ptr}(_secret, 0)

    with_attr error_message(
            "==================== ERROR: The revealed value is not the one commited to ======================"):
        assert hashed_secret = commitment
    end

    return verify_commitments(secrets_len - 1, &secrets[1], addresses_len - 1, &addresses[1])
end

@external
func generate_randomness{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        secrets_len : felt, secrets : felt*, addresses_len : felt, addresses : felt*) -> (x : felt):
    verify_commitments(secrets_len, secrets, addresses_len, addresses)
end

# ##  ===============================================================================================
# ## TESTING

# Returns the current balance.
@view
func test_num_comm{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (res):
    let (res) = s_total_commitments.read()
    return (res)
end

@view
func test_commiters{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        idx : felt) -> (res):
    let (res) = s_commiters.read(id=idx)
    return (res)
end

@view
func test_commitments{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        addr : felt) -> (res):
    let (res) = s_commitments.read(address=addr)
    return (res)
end
