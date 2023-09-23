import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

// Wagmi Imports
import {
  Config,
  configureChains,
  Connector,
  createConfig,
  PublicClient,
  WagmiConfig,
  WebSocketPublicClient,
} from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// Lodash Imports
import merge from "lodash.merge";

// Custom Component Imports
import MainLayout from "../layout/mainLayout";

// Rainbowkit Imports
import "@rainbow-me/rainbowkit/styles.css";
import {
  Chain,
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  Wallet,
  getWalletConnectConnector,
  Theme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  enkryptWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WalletConnectConnectorOptions } from "@rainbow-me/rainbowkit/dist/wallets/getWalletConnectConnector";

// Context Imports
import { NotificationProvider, ProjectProvider } from "../context";

interface MewWalletOptions {
  projectId: string;
  chains: Chain[];
  walletConnectVersion?: "2";
  walletConnectOptions?: WalletConnectConnectorOptions;
}

async function getWalletConnectUri(
  connector: Connector,
  version: "2"
): Promise<string> {
  const provider = await connector.getProvider();
  return new Promise<string>((resolve) =>
    provider.once("display_uri", resolve)
  );
}

const mewWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
}: MewWalletOptions): Wallet => ({
  id: "MEW Wallet",
  name: "MEW Wallet",
  iconUrl: "https://www.myetherwallet.com/img/icon-mew-wallet.f29574d3.png",
  iconBackground: "#fff",
  downloadUrls: {
    android:
      "https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet",
    ios: "https://apps.apple.com/app/id1464614025",
    mobile: "https://www.mewwallet.com/",
    qrCode: "https://www.mewwallet.com/",
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({
      projectId,
      chains,
      version: walletConnectVersion,
      options: walletConnectOptions,
    });

    return {
      connector,
      mobile: {
        getUri: async () => {
          const uri = await getWalletConnectUri(
            connector,
            walletConnectVersion
          );
          return uri;
        },
      },
      qrCode: {
        getUri: async () =>
          getWalletConnectUri(connector, walletConnectVersion),
        instructions: {
          learnMoreUrl: "https://argent.xyz/learn/what-is-a-crypto-wallet/",
          steps: [
            {
              description:
                "Put Argent on your home screen for faster access to your wallet.",
              step: "install",
              title: "Open the Argent app",
            },
            {
              description:
                "Create a wallet and username, or import an existing wallet.",
              step: "create",
              title: "Create or Import a Wallet",
            },
            {
              description:
                "After you scan, a connection prompt will appear for you to connect your wallet.",
              step: "scan",
              title: "Tap the Scan QR button",
            },
          ],
        },
      },
    };
  },
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()]
);

const projectId = "2e7d6d78e8e8761ea678f4276a0a6cd7";

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId,
  chains,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [wagmiConfig, setWagmiConfig] = useState<
    Config<PublicClient, WebSocketPublicClient> | undefined | undefined
  >(undefined);
  useEffect(() => {
    // const mewWalletModified: Wallet = mewWallet({chains})
    // mewWalletModified.installed = true;
    const connectors = connectorsForWallets([
      ...wallets,
      {
        groupName: "Other",
        wallets: [
          argentWallet({ projectId, chains }),
          trustWallet({ projectId, chains }),
          ledgerWallet({ projectId, chains }),
          // mewWalletModified,
          enkryptWallet({ chains }),
          mewWallet({ projectId, chains }),
          // safeWallet({chains})
        ],
      },
    ]);
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
      webSocketPublicClient,
    });

    // @ts-ignore
    setWagmiConfig(wagmiConfig);
  }, []);

  const customWalletTheme: Theme = merge(darkTheme(), {
    colors: {
      accentColor: "#3E8EEC",
      connectButtonBackground: "black",
      connectButtonBackgroundError: "black",
      connectButtonInnerBackground: "black",
      modalBackground: "black",
    },
  } as Theme);

  return (
    wagmiConfig && (
      <WagmiConfig config={wagmiConfig}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            /**
             * @TODO change it to initialChain={polygon} for production
             */
            initialChain={polygonMumbai}
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
        </SessionProvider>
      </WagmiConfig>
    )
  );
}

export default MyApp;
