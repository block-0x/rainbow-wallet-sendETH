import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import { SendETH } from '../components/SendETH';

const Home: NextPage = () => {
  const [accountReady, setAccountReady] = React.useState(false);
  const { data: account } = useAccount();

  React.useEffect(() => {
    setAccountReady(Boolean(account));
  }, [account]);

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

      {accountReady && <SendETH />}
    </div>
  );
};

export default Home;
