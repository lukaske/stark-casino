%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.math_cmp import is_not_zero, is_le
from starkware.cairo.common.math import (
    assert_not_zero, assert_le, assert_lt, unsigned_div_rem, signed_div_rem, split_felt)
from starkware.starknet.common.syscalls import get_block_number, get_block_timestamp
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.alloc import alloc

from openzeppelin.token.erc20.library import (
    ERC20_name, ERC20_symbol, ERC20_totalSupply, ERC20_decimals, ERC20_balanceOf, ERC20_allowance,
    ERC20_initializer, ERC20_approve, ERC20_increaseAllowance, ERC20_decreaseAllowance,
    ERC20_transfer, ERC20_transferFrom, ERC20_mint)

from contracts.randomness import generate_randomness, commit_to_secret

# STRUCTS ===================================================

struct Race:
    member paid_out : felt
    member winner : felt
end

struct Bet:
    member bettor : felt
    member amount : felt
    member choice : felt
    member time : felt
end

# @event
# func speeds_event(
#         s1_len : felt, s1 : felt*, s2_len : felt, s2 : felt*, s3_len : felt, s3 : felt*,
#         s4_len : felt, s4 : felt*, s5_len : felt, s5 : felt*):
# end

# STORAGE VARS ==================================================

const taker_fee = 1000
const num_balls = 5
const bet_price = 1000000

@storage_var
func s_owner() -> (res : felt):
end

@storage_var
func s_roundId() -> (res : felt):
end

@storage_var
func s_locked(idx : felt) -> (res : felt):
end

# @storage_var
# func s_placed_bets(rid : felt, address : felt) -> (res : Bet):
# end

@storage_var
func s_num_bets(idx : felt) -> (res : felt):
end

@storage_var
func s_bets(race_idx : felt, idx : felt) -> (res : Bet):
end

@storage_var
func s_num_races() -> (res : felt):
end

@storage_var
func s_races(idx : felt) -> (res : Race):
end

# ================================================================

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(owner : felt):
    assert_not_zero(owner)
    s_owner.write(owner)
    return ()
end

@external
func create_race{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        race_time : felt):
    only_owner()
    let (timestamp : felt) = get_block_timestamp()
    assert_lt(timestamp, race_time)

    let new_race = Race(0, 500)

    let (n_races : felt) = s_num_races.read()
    s_races.write(idx=n_races, value=new_race)
    s_num_races.write(n_races + 1)

    return ()
end

@external
func place_bet{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        race_idx : felt, ball_index : felt, commitment : felt):
    alloc_locals

    let (locked) = s_locked.read(idx=race_idx)
    assert locked = 0

    let (local msg_sender) = get_caller_address()

    let (num_races) = s_num_races.read()
    # assert_lt(race_idx, num_races)

    assert_not_zero(commitment)

    let (timestamp : felt) = get_block_timestamp()
    let (n_races : felt) = s_num_races.read()

    assert_le(0, ball_index)
    assert_le(ball_index, 4)

    commit_to_secret(commitment, msg_sender)

    # TODO: ERC20_transferFrom(msg_sender)

    let new_bet = Bet(msg_sender, bet_price, ball_index, timestamp)

    let (n_bets) = s_num_bets.read(idx=race_idx)
    s_bets.write(race_idx=race_idx, idx=n_bets + 1, value=new_bet)

    s_num_bets.write(idx=race_idx, value=n_bets + 1)

    return ()
end

# Used to prevent more observations
@external
func lock_betting{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        race_idx : felt):
    only_owner()
    s_locked.write(idx=race_idx, value=1)

    return ()
end

@external
func eveluate_race{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        race_idx : felt, secrets_len : felt, secrets : felt*, addresses_len : felt,
        addresses : felt*) -> (winner):
    alloc_locals
    only_owner()

    let (race : Race) = s_races.read(race_idx)
    let (n_races) = s_num_races.read()

    assert race.paid_out = 0
    assert_lt(race_idx, n_races)

    let (random_seed) = generate_randomness(secrets_len, secrets, addresses_len, addresses)
    let (randomness1) = hash2{hash_ptr=pedersen_ptr}(random_seed, 0)

    let (h, low) = split_felt(randomness1)

    let (div, rem) = unsigned_div_rem(low, 10)

    let (winner, _) = unsigned_div_rem(rem, 2)

    reward_winners(winner, race_idx, race)

    return (winner)
end

func reward_winners{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        winning_bet : felt, race_idx : felt, race : Race):
    let (n_bets) = s_num_bets.read(race_idx)
    assert_not_zero(n_bets)

    reward_winners_internal(winning_bet, race_idx, race, n_bets)

    return ()
end

func reward_winners_internal{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        winning_bet : felt, race_idx : felt, race : Race, n_bets : felt):
    if n_bets == 0:
        return ()
    end

    let (temp_bet : Bet) = s_bets.read(race_idx, n_bets - 1)

    if temp_bet.choice == winning_bet:
        tempvar win_amount = temp_bet.amount * num_balls - taker_fee

        # TODO: ERC20_transferFrom(address(this))

        race.paid_out = 1
        race.winner = winning_bet

        s_races.write(idx=race_idx, value=race)
        return reward_winners_internal(winning_bet, race_idx, race, n_bets - 1)
    end

    return reward_winners_internal(winning_bet, race_idx, race, n_bets - 1)
end

func only_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}():
    let (owner) = s_owner.read()
    let (msg_sender) = get_caller_address()

    # TODO assert msg_sender = owner

    return ()
end

#
#
#

#

#

# let (randomness2) = hash2{hash_ptr=pedersen_ptr}(randomness1, randomness1)
# let (randomness3) = hash2{hash_ptr=pedersen_ptr}(randomness2, randomness2)
# let (randomness4) = hash2{hash_ptr=pedersen_ptr}(randomness3, randomness3)
# let (randomness5) = hash2{hash_ptr=pedersen_ptr}(randomness4, randomness4)

# let (empty_arr : felt*) = alloc()

# let (arr1_len : felt, arr1 : felt*, sum1 : felt) = construct_speeds_array(
#     randomness1, 0, empty_arr, 0)
# let (arr2_len : felt, arr2 : felt*, sum2) = construct_speeds_array(randomness2, 0, empty_arr, 0)
# let (arr3_len : felt, arr3 : felt*, sum3) = construct_speeds_array(randomness3, 0, empty_arr, 0)
# let (arr4_len : felt, arr4 : felt*, sum4) = construct_speeds_array(randomness4, 0, empty_arr, 0)
# let (arr5_len : felt, arr5 : felt*, sum5) = construct_speeds_array(randomness5, 0, empty_arr, 0)

# speeds_event.emit(
#     arr1_len, arr1, arr2_len, arr2, arr3_len, arr3, arr4_len, arr4, arr5_len, arr5)

# let (sums_arr : felt*) = alloc()
# assert sums_arr[0] = sum1
# assert sums_arr[1] = sum2
# assert sums_arr[2] = sum3
# assert sums_arr[3] = sum4
# assert sums_arr[4] = sum5

# let (winner, sum) = find_max(5, sums_arr, 0, 0)

# func construct_speeds_array{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
#         randomness : felt, arr_len : felt, arr : felt*, sum : felt) -> (
#         x_len : felt, x : felt*, sum : felt):
#     if arr_len == 15:
#         return (arr_len, arr, sum)
#     end

# let (div, rem) = unsigned_div_rem(randomness, 100)
#     assert arr[0] = rem

# let new_sum = sum + rem

# return construct_speeds_array(div, arr_len + 1, arr, new_sum)
# end

# func find_max{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
#         x_len : felt, x : felt*, i : felt, max : felt) -> (i : felt, v : felt):
#     if x_len == 0:
#         return (i, max)
#     end

# let (cond) = is_le(max, x[5 - x_len])
#     if cond == 1:
#         let new_max = x[5 - x_len]
#         return find_max(x_len - 1, &x[1], 5 - x_len, new_max)
#     end

# return find_max(x_len - 1, &x[1], i, max)
# end
