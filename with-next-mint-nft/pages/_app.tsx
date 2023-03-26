import './global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,

  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createClient, WagmiConfig, goerli } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider, useTheme } from 'next-themes'
import { ReactNode, useState } from 'react'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'

const node = process.env.NEXT_PUBLIC_RPC_URL ? process.env.NEXT_PUBLIC_RPC_URL : "";

const { chains, provider, webSocketProvider } = configureChains(
  [
    goerli,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [goerli]
      : []),
  ],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: node
      })
    }),
    publicProvider()
  ],
  { targetQuorum: 1 }
);

const connectors = connectorsForWallets([
  {
      groupName: 'Recommended',
      wallets: [
          injectedWallet({ chains, shimDisconnect: true }),
          metaMaskWallet({ chains, shimDisconnect: true }),
          coinbaseWallet({ appName: "Deposit app", chains }),
          walletConnectWallet({ chains })
      ]
  }
])

const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  const themeOptions: ThemeOptions = {
      fontStack: 'system',
      overlayBlur: 'small',
      accentColor: '#6e52ff'
  }

  return (
      <RainbowKitProvider
          modalSize="compact"
          chains={chains}
          theme={
              theme === 'dark' ? darkTheme(themeOptions) : lightTheme(themeOptions)
          }
      >
          {children}
      </RainbowKitProvider>
  )
}

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ThemeProvider defaultTheme="dark" attribute="class">
          <RainbowKitProviderWrapper>
            <Component {...pageProps} />
          </RainbowKitProviderWrapper>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default MyApp;
