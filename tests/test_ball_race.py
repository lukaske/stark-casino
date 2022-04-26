"""contract.cairo test file."""
from copyreg import constructor
import os
import pytest
import time
import asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.cairo.common.hash_state import pedersen_hash

from utils import Signer

CONTRACT_FILE = os.path.join("contracts", "ball_race.cairo")

acc_path = "contracts/Accounts/Account.cairo"


acc = Signer(111111111111111111111)
acc2 = Signer(222222222222222222222)
acc3 = Signer(333333333333333333333)
acc4 = Signer(444444444444444444444)
acc5 = Signer(555555555555555555555)


@pytest.fixture(scope='module')
def event_loop():
    return asyncio.new_event_loop()


@pytest.fixture(scope='module')
async def contract_factory():
    starknet = await Starknet.empty()

    account = await starknet.deploy(
        acc_path,
        constructor_calldata=[acc.public_key]
    )

    contract = await starknet.deploy(
        CONTRACT_FILE,
        constructor_calldata=[account.contract_address]
    )

    # await acc1.send_transaction(
    #     account=account1,
    #     to=rand_contract.contract_address,
    #     selector_name='commit_to_secret',
    #     calldata=[hash_commitment])

    return starknet, contract, account


@ pytest.mark.asyncio
async def test_main_logic(contract_factory):

    starknet, contract, account = contract_factory

    res = await contract.create_race(100000000).call()

    print(res.result)


@ pytest.mark.asyncio
async def test_place_bet(contract_factory):
    starknet, contract, account = contract_factory

    res = await contract.create_race(100000000).call()

    res = await contract.place_bet(0, 3, 123456789).call()

    print(res.result)


@ pytest.mark.asyncio
async def test_evaluate_race(contract_factory):
    starknet, contract, account = contract_factory

    s = 12345
    comm = pedersen_hash(s, 0)

    await contract.create_race(100000000).invoke()

    await acc.send_transaction(
        account=account,
        to=contract.contract_address,
        selector_name='place_bet',
        calldata=[0, 3, comm])

    res = await contract.eveluate_race(0, [s], [account.contract_address]).invoke()

    print(res.result)
