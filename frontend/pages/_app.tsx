import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider, Theme, darkTheme } from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
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

const { chains, provider } = configureChains(
	[
		mainnet,
		goerli,
		polygon,
		polygonMumbai,
		optimism,
		optimismGoerli,
		arbitrum,
    arbitrumGoerli,
    polygonZkEvm,
    polygonZkEvmTestnet
	],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: "My Alchemy DApp",
	// projectId: process.env.WALLETCONNECT_PROJECT_ID,
	projectId: undefined,
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
    accentColor: "#3E8EEC",
    connectButtonBackground: "black",
    connectButtonBackgroundError: "black",
    connectButtonInnerBackground: "black",
    modalBackground: "black",
  },
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
			if (!isReconnected) router.reload();
		},
	});
	return (
		<WagmiConfig client={wagmiClient}>
			<SessionProvider session={pageProps.session} refetchInterval={0}>
				<RainbowKitSiweNextAuthProvider>
					<RainbowKitProvider
						modalSize="compact"
						initialChain={process.env.NEXT_PUBLIC_DEFAULT_CHAIN as unknown as RainbowKitChain}
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
				</RainbowKitSiweNextAuthProvider>
			</SessionProvider>
		</WagmiConfig>
	);
}

export default MyApp;
