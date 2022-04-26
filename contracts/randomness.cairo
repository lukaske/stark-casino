%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.math import assert_not_zero, assert_le, assert_lt
from starkware.cairo.common.math_cmp import is_not_zero
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.hash_state import (
    hash_init, hash_finalize, hash_update, hash_update_single)

# -----------------------------------------------------------------
# STORAGE VARS

const randomness_treshold = 0  # 3

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

@storage_var
func s_prev_randomness(address : felt) -> (res : felt):
end
# -----------------------------------------------------------------

# Store the commitment to the value that will be stored for randomness
func commit_to_secret{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        commitment_hash : felt, bettor : felt):
    let (curr_commit) = s_commitments.read(bettor)
    let (cond : felt) = is_not_zero(curr_commit)
    if cond == 1:
        return ()
    end

    let (n_commiters) = s_total_commitments.read()
    s_commiters.write(id=n_commiters, value=bettor)
    s_commitments.write(address=bettor, value=commitment_hash)

    s_total_commitments.write(n_commiters + 1)

    return ()
end

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
        secrets_len : felt, secrets : felt*, addresses_len : felt, addresses : felt*) -> (
        randomness : felt):
    assert_le(randomness_treshold, secrets_len)

    verify_commitments(secrets_len, secrets, addresses_len, addresses)

    let (randomness : felt) = hash_secrets(secrets_len, secrets, addresses_len, addresses)

    return (randomness)
end

# ##  ===============================================================================================
# ## HELPERS

func hash_secrets{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        secrets_len : felt, secrets : felt*, addresses_len : felt, addresses : felt*) -> (
        res : felt):
    alloc_locals

    let hash_ptr = pedersen_ptr
    with hash_ptr:
        let (hash_state_ptr) = hash_init()

        let (hash_state_ptr) = hash_update(hash_state_ptr, secrets, secrets_len)
        let (hash_state_ptr) = hash_update(hash_state_ptr, addresses, addresses_len)

        let (res) = hash_finalize(hash_state_ptr)
        let pedersen_ptr = hash_ptr
        return (res=res)
    end
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
