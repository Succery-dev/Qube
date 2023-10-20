import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  polygonMumbai,
  optimismGoerli,
  arbitrumGoerli,
  polygonZkEvm,
  polygonZkEvmTestnet,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import MainLayout from "../layout/mainLayout";
import { useRouter } from "next/router";
import { RainbowKitChain } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext";
import { ProjectProvider, NotificationProvider } from "../context";
import merge from "lodash.merge";
import { useEffect } from "react";
import { initializeWeb3Provider } from "../utils/ethers";

// Custom chain for hardhat network on local env with "chainId: 31337"
const localhost8545 = {
  id: 31337,
  name: "Localhost8545",
  network: "localhost8545",
  nativeCurrency: {
    decimals: 18,
    name: "Hardhat Eth",
    symbol: "HARDHATETH",
  },
  rpcUrls: {
    public: { http: ["http://127.0.0.1:8545"] },
    default: { http: ["http://127.0.0.1:8545"] },
  },
}

const { chains, provider } = configureChains(
  [
    // mainnet,
    // goerli,
    polygon,
    // polygonMumbai,
    // optimism,
    // optimismGoerli,
    // arbitrum,
    // arbitrumGoerli,
    // polygonZkEvm,
    // polygonZkEvmTestnet,
    // localhost8545,
  ],

  // TODO: remove the below comment for production => use Alchemy Provider for production for enhanced performance
  /**
   * @dev providing alchemyProvider for development can cause various hinderances like unexpected errors due to limited FREE API calls and separate APIs for each network. Public providers connects to freely available public Ethereum nodes without any API keys.
   */
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    // publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
	appName: "My Alchemy DApp",
	projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
	chains: chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { WagmiConfig, RainbowKitProvider };

// Ref: https://www.rainbowkit.com/docs/custom-theme#extending-a-built-in-theme
const customWalletTheme: Theme = merge(darkTheme(), {
  colors: {
    accentColor: "linear-gradient(to right, #E220CF, #FFFFFF)",
    accentColorForeground: "black",
    connectButtonBackground: "black",
    connectButtonBackgroundError: "black",
    connectButtonInnerBackground: "black",
    modalBackground: "black",
  },
  radii: {
    connectButton: "20px",
  }
} as Theme);

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const router = useRouter();
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      /**
       * @dev check if this line is required. When wallet is connected, it cause the site to reload
       */
      // if (!isReconnected) router.reload();
    },
  });

  useEffect(() => {
    // Initialize Web3Provider on application load
    initializeWeb3Provider();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        {/* <RainbowKitSiweNextAuthProvider> */}
        <RainbowKitProvider
          modalSize="compact"
          initialChain={
            process.env.NEXT_PUBLIC_DEFAULT_CHAIN as unknown as RainbowKitChain
          }
          chains={chains}
          coolMode
          theme={customWalletTheme}
        >
          <ProjectProvider>
            <NotificationProvider>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </NotificationProvider>
          </ProjectProvider>
        </RainbowKitProvider>
        {/* </RainbowKitSiweNextAuthProvider> */}
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
