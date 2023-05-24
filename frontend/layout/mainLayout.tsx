import { Navbar } from "../components";

export default function MainLayout({ children }) {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
}
