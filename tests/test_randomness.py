"""contract.cairo test file."""
import os
import pytest
import time
import asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.cairo.common.hash_state import pedersen_hash

from utils import Signer

CONTRACT_FILE = os.path.join("contracts", "randomness.cairo")

acc_path = "contracts/Accounts/Account.cairo"


acc1 = Signer(111111111111111111111)
acc2 = Signer(222222222222222222222)
acc3 = Signer(333333333333333333333)
acc4 = Signer(444444444444444444444)
acc5 = Signer(555555555555555555555)
acc6 = Signer(666666666666666666666)
acc7 = Signer(777777777777777777777)
acc8 = Signer(888888888888888888888)
acc9 = Signer(999999999999999999999)
acc10 = Signer(1010101010101010101010)


accs = [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9, acc10]

s1 = 111111111
s2 = 222222222
s3 = 333333333
s4 = 444444444
s5 = 555555555
s6 = 666666666
s7 = 777777777
s8 = 888888888
s9 = 999999999
s10 = 101010101

secrets = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10]


accounts = []


@pytest.fixture(scope='module')
def event_loop():
    return asyncio.new_event_loop()


@pytest.fixture(scope='module')
async def contract_factory():
    starknet = await Starknet.empty()

    rand_contract = await starknet.deploy(
        CONTRACT_FILE,
    )

    for i in range(len(accs)):
        account = await starknet.deploy(
            acc_path,
            constructor_calldata=[accs[i].public_key]
        )
        accounts.append(account)

    # account1 = await starknet.deploy(
    #     acc_path,
    #     constructor_calldata=[acc1.public_key]
    # )

    # hash_commitment = pedersen_hash(secret, 0)

    # await acc1.send_transaction(
    #     account=account1,
    #     to=rand_contract.contract_address,
    #     selector_name='commit_to_secret',
    #     calldata=[hash_commitment])

    return starknet, rand_contract


@pytest.mark.asyncio
async def test_main_logic(contract_factory):

    starknet, rand_contract = contract_factory

    res = await rand_contract.test_num_comm().call()
    res2 = await rand_contract.test_commiters(0).call()
    print(res.result)
    print(res2.result)


@pytest.mark.asyncio
async def test_commit_reveal(contract_factory):
    t1 = time.time()
    _, rand_contract = contract_factory

    for i in range(len(accs)):
        sec = secrets[i]
        acc = accs[i]
        account = accounts[i]

        hash_commitment = pedersen_hash(sec, 0)
        await acc.send_transaction(
            account=account,
            to=rand_contract.contract_address,
            selector_name='commit_to_secret',
            calldata=[hash_commitment])
        print("commitment: ", i, "  ",  hash_commitment)

    res = await rand_contract.test_num_comm().call()
    print(res.result)
    print("==============================================")
    for i in range(10):

        res2 = await rand_contract.test_commiters(i).call()
        stored_commit = await rand_contract.test_commitments(res2.result.res).call()

        print(stored_commit.result.res)

    print("==============================================")

    await verify_commits(secrets, rand_contract)

    t2 = time.time()
    print("time diff: ", t2 - t1)


async def verify_commits(secrets, rand_contract):

    addresses = [ac.contract_address for ac in accounts]
    secrets[5] = secrets[5] + 1

    res = await rand_contract.verify_commitments(secrets, addresses).call()

    print("Commits verified successfuly: ", res.result)


# define a random shuffle function based on seed
def shuffle(seed, arr):
    # shuffle the array
    for i in range(len(arr)):
        j = i + seed % (len(arr) - i)
        arr[i], arr[j] = arr[j], arr[i]
