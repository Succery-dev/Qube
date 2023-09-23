import Head from "next/head";

// Custom Component Imports
import { Navbar } from "../components";

// Firebase Imports
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../utils/firebase";
import { signInWithCustomToken } from "firebase/auth";

// Wagmi Imports
import { useAccount } from "wagmi";
import { signMessage } from "@wagmi/core";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login with wallet on connect
  const loginWithWallet = async (address: `0x${string}`) => {
    try {
      const getMessageHash = httpsCallable(functions, "getMessageHash");
      const messageHashCall = await getMessageHash({
        userWalletAddress: address,
      });
      const messageHash = messageHashCall.data as string;
      const signature = await signMessage({ message: messageHash });
      const verifyWalletAddress = httpsCallable(
        functions,
        "verifyWalletAddress"
      );
      const verifyWalletAddressCall = await verifyWalletAddress({
        messageHash,
        signature,
        userWalletAddress: address,
      });
      const customAuthToken = verifyWalletAddressCall.data as string;
      const signedInUser = await signInWithCustomToken(auth, customAuthToken);
    } catch (error) {}
  };
  useAccount({
    async onConnect({ address, isReconnected }) {
      if (isReconnected) {
        return;
      }

      if (address && !auth.currentUser) {
        await loginWithWallet(address);
      }
    },
    async onDisconnect() {
      await auth.signOut();
    },
  });
  return (
    <div>
      <Head>
        <title>Qube</title>
        <meta
          name="description"
          content="Empowering relation between Freelancers and Organizations"
        />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      {children}
    </div>
  );
}
