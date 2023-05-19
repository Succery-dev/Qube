import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";

import { useSession } from "next-auth/react"
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Navbar() {
	const { data: session } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (session) {
			router.push(`/dashboard/${session.user.name}`)
		} else {
			router.push('/')
		}
	}, [session])

	return (
		<nav className={styles.navbar}>
			<a href="https://alchemy.com/?a=create-web3-dapp" target={"_blank"}>
				<img className={styles.alchemy_logo} src="/cw3d-logo.png"></img>
			</a>
			<ConnectButton></ConnectButton>
		</nav>
	);
}
