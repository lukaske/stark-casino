# Declare this file as a StarkNet contract and set the required
# builtins.
%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import (
    assert_le, assert_lt, sqrt, sign, abs_value, signed_div_rem, unsigned_div_rem, assert_not_zero,
    split_felt)
from starkware.cairo.common.hash import hash2

# Define a storage variable.
@storage_var
func balance() -> (res : felt):
end

# Increases the balance by the given amount.
@external
func increase_balance{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        amount : felt):
    let (res) = balance.read()
    balance.write(res + amount)
    return ()
end

@view
func read_balance{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
        res : felt):
    let (res) = balance.read()
    return (res)
end
#

#

@view
func test_hash{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (res : felt):
    let (h) = hash2{hash_ptr=pedersen_ptr}(100, 0)
    return (h)
end

#

#

#

# ====================================================================================================0
# Returns a shuffled array
# @view
# func shuffle_array{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
#         a_len : felt, a : felt*) -> (a_len : felt, a : felt*):
#     let (a_len, a : felt*) = internal_shuffle(a_len, a, 0, 123456789)
#     return (a_len, a)
# end

# func internal_shuffle{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
#         a_len : felt, a : felt*, i : felt, seed : felt) -> (a_len : felt, a : felt*):
#     if a_len == i:
#         return (a_len, a)
#     end

# tempvar devisor = a_len - i
#     let (_, shift : felt) = unsigned_div_rem(seed, devisor)
#     tempvar j = i + shift

# tempvar prev_ai = a[i]
#     tempvar prev_aj = a[j]

# a[j] = prev_ai
#     a[i] = prev_aj

# return internal_shuffle(a_len, a, i + 1, seed)
# end

# def shuffle(seed, arr):
#     # shuffle the array
#     for i in range(len(arr)):
#         j = i + seed % (len(arr) - i)
#         arr[i], arr[j] = arr[j], arr[i]
