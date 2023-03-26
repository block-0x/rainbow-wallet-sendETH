import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { SendETH } from '../components/SendETH';
import { SendUSDT } from '../components/SendUSDT';
import {
  VStack,
  Heading
} from '@chakra-ui/react'

const Home: NextPage = () => {
  const [accountReady, setAccountReady] = React.useState(false);
  const { isConnected } = useAccount()

  React.useEffect(() => {
    console.log(isConnected)
    if (isConnected) {
      setAccountReady(true)
    } else {
      setAccountReady(false)
    }
  }, [isConnected]);

  const onError = (error: any) => {
    console.error(error?.data?.message)
  }
  const { switchNetwork } = useSwitchNetwork({
    onError() {
    }
  })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>

      <VStack justifyContent="center" alignItems="center" h="60vh">
      <Heading>{"Token Sale"}</Heading>
      <br></br>
      <br></br>

      {accountReady &&
      <><SendETH /><br></br><br></br><SendUSDT /></>}

      </VStack>
    </div>
  )
};

export default Home;
