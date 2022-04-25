import { useStarknet, InjectedConnector } from '@starknet-react/core'
import { Button } from '@geist-ui/react'


export function ConnectWallet() {
  const { account, connect } = useStarknet()


  if (account) {
    return <p style={{ textAlign: "center" }}><b>Wallet connected:</b> {account}</p>
  }

  return <Button style={{marginTop: "30px", marginLeft: "50%", transform: "translateX(-50%)"}} auto type={"primary"} scale={1} onClick={() => console.log("click")}>Connect wallet!</Button>
}
