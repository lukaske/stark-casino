import { useStarknetCall } from '@starknet-react/core'
import type { NextPage } from 'next'
import { useMemo, useEffect, useState } from 'react'
import { toBN } from 'starknet/dist/utils/number'
import { ConnectWallet } from '~/components/ConnectWallet'
import { IncrementCounter } from '~/components/IncrementCounter'
import { TransactionList } from '~/components/TransactionList'
import { useCounterContract } from '~/hooks/counter'

import { Text } from '@geist-ui/react'
import {Timer} from '~/components/Timer'
import { Game } from '~/components/Game'
import { Interface } from '~/components/Interface'
import { setServers } from 'dns'

const Home: NextPage = () => {
  const { contract: counter } = useCounterContract()

  const { data: counterResult } = useStarknetCall({
    contract: counter,
    method: 'counter',
    args: [],
  })

  const [gameTrigger, setGameTrigger] = useState<number>(0)

  const counterValue = useMemo(() => {
    if (counterResult && counterResult.length > 0) {
      const value = toBN(counterResult[0])
      return value.toString(10)
    }
  }, [counterResult])

  const trigger = () => {
    setGameTrigger(gameTrigger + 1)
  }

  return (
    <div>
      <h1>Stark casino</h1>
      
      <ConnectWallet />
      <Interface />
      <button onClick={trigger}>Trigger game</button>
      <Game speeds={[
    [0.002, 0.003, 0.002, 0.004, 0.005],
    [0.001, 0.006, 0.005, 0.004, 0.003],
    [0.002, 0.006, 0.001, 0.002, 0.002],
    [0.003, 0.003, 0.002, 0.003, 0.005],
    [0.0005, 0.004, 0.002, 0.006, 0.001],
      ]}
      trigger={gameTrigger}
      />
      <Timer></Timer>
      <h2>Wallet</h2>

      <h2>Counter Contract</h2>
      <p>Address: {counter?.address}</p>
      <p>Value: {counterValue}</p>
      
      <IncrementCounter />
      <h2>Recent Transactions</h2>
      <TransactionList />
    </div>
  )
}

export default Home
