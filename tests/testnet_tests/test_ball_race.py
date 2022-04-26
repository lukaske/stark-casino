import ast
import os
import time

import pytest
import asyncio
from pathlib import Path
import json

from dataclasses import dataclass
from decouple import config
from Transmitter import Transmitter

from starkware.crypto.signature.signature import private_to_stark_key, get_random_private_key
from starkware.starknet.public.abi import get_selector_from_name, get_storage_var_address


from starknet_py.net.client import Client
from starknet_py.net.account.account_client import AccountClient, KeyPair
from starknet_py.contract import Contract


abis_path = os.path.join(
    os.path.normpath(os.getcwd() + os.sep + os.pardir + os.sep + os.pardir),
    "artifacts/abis/")

OWNER_PRIV_KEY = int(config('OWNER_PRIV_KEY'))
TRANSMITTER_PRIV_KEY = int(config('TRANSMITTER_PRIV_KEY'))


account_abi = Path(os.path.join(abis_path, "Account.json")).read_text()
account_abi = ast.literal_eval(account_abi)

ball_race_abi = Path(os.path.join(
    abis_path, "ball_race.json")).read_text()
ball_race_abi = ast.literal_eval(ball_race_abi)

ball_race_address = "0x06da2ddb9ae628cd405c5050466ae70abb36a1071fdc00987c9b19a19bc471de"


@dataclass
class KeyPair:
    private_key: int
    public_key: int

    @staticmethod
    def from_private_key(key: int) -> "KeyPair":
        return KeyPair(private_key=key, public_key=private_to_stark_key(key))
# ...............................................................................


@pytest.fixture(scope='module')
def event_loop():
    return asyncio.new_event_loop()


@pytest.fixture(scope='module')
async def contract_factory():

    owner_key_pair = KeyPair.from_private_key(OWNER_PRIV_KEY)

    local_network_client = Client("testnet")

    ball_race_contract = Contract(address=ball_race_address, abi=ball_race_abi,
                                  client=local_network_client)

    return ball_race_contract


@pytest.mark.asyncio
async def test_main_logic(contract_factory):
    ball_race_contract = contract_factory


@pytest.mark.asyncio
async def test_set_config(contract_factory):
    owner_client, main_oracle, transmitter_acc, ofc_aggregator = contract_factory

    encoded_config = 1234567898765

    invocation = await ofc_aggregator.functions["create_race"].invoke(
        100000000)

    res = await invocation.wait_for_acceptance()

    # print([int(transmitter_addr, 16)] + transmitter_pub_keys[1:])

    print(res)


@pytest.mark.asyncio
async def test_transmit(contract_factory):
    owner_client, main_oracle, transmitter_acc, ofc_aggregator = contract_factory

    # calldata = [int(rawReportContext, 16),
    #             int(rawObservers[:60], 16),
    #             observations1,
    #             r_sigs1,
    #             s_sigs1,
    #             "0x" + "00" * 32]

    # invocation = await transmitter.send_transaction(
    #     account=transmitter_acc,
    #     to=ofc_aggregator.address,
    #     selector_name='transmit',
    #     calldata=calldata)

    # res2 = await invocation.wait_for_acceptance()

    # print(res2)
