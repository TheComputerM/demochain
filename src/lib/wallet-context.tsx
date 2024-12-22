import {
	type ParentComponent,
	Show,
	createContext,
	createResource,
	useContext,
} from "solid-js";
import { PrivateKey, PublicKey } from "./blockchain/keys";

const WalletContext = createContext<{
	private: PrivateKey;
	public: PublicKey;
}>();

export const WalletProvider: ParentComponent = (props) => {
	const [wallet] = createResource(async () => {
		const privateKey = PrivateKey.generate();
		const publicKey = await PublicKey.fromPrivateKey(privateKey.key);
		return { private: privateKey, public: publicKey };
	});

	return (
		<Show when={wallet()}>
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
