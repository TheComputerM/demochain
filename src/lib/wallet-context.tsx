import * as ed from "@noble/ed25519";
import { Title } from "@solidjs/meta";
import {
	type ParentComponent,
	Show,
	createContext,
	createResource,
	useContext,
} from "solid-js";
import { hexToUint8Array, uint8ArrayToHex } from "uint8array-extras";

const WalletContext = createContext<{
	private: Uint8Array;
	public: Uint8Array;
}>();

export const WalletProvider: ParentComponent = (props) => {
	const [wallet] = createResource(async () => {
		const stored = sessionStorage.getItem("wallet");
		const privateKey = stored
			? hexToUint8Array(stored)
			: ed.utils.randomPrivateKey();
		sessionStorage.setItem("wallet", uint8ArrayToHex(privateKey));
		const publicKey = await ed.getPublicKeyAsync(privateKey);

		return { private: privateKey, public: publicKey };
	});

	return (
		<Show when={wallet()}>
			<WalletContext.Provider value={wallet()}>
				<Title>Demochain | {uint8ArrayToHex(wallet()!.public)}</Title>
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
