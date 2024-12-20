import {
	type ParentComponent,
	Show,
	createContext,
	createResource,
	useContext,
} from "solid-js";
import { Wallet } from "./blockchain/wallet";

const WalletContext = createContext<Wallet>();

export const WalletProvider: ParentComponent = (props) => {
	const [wallet] = createResource(() => Wallet.generate());
	return (
		<Show when={wallet()} fallback="Loading wallet">
			<WalletContext.Provider value={wallet()}>
				{props.children}
			</WalletContext.Provider>
		</Show>
	);
};

export function useWallet() {
	const wallet = useContext(WalletContext);
	if (!wallet) {
		throw new Error("WalletContext not found");
	}
	return wallet;
}
