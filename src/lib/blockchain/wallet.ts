import { subtle } from "uncrypto";

const algorithm = {
	name: "ECDSA",
	namedCurve: "P-256",
};

export class Wallet {
	keys: {
		public: CryptoKey;
		private: CryptoKey;
	};

	raw: {
		public: Uint8Array;
		private: Uint8Array;
	};

	constructor(keys: [CryptoKey, CryptoKey], raw: [Uint8Array, Uint8Array]) {
		this.keys = {
			public: keys[0],
			private: keys[1],
		};

		this.raw = {
			public: raw[0],
			private: raw[1],
		};
	}

	/**
	 * Generates a wallet with random keys
	 */
	static async generate() {
		const keys = await subtle.generateKey(algorithm, true, ["sign", "verify"]);
		return new Wallet(
			[keys.publicKey, keys.privateKey],
			[
				new Uint8Array(await Wallet.exportBuffer(keys.publicKey)),
				new Uint8Array(await Wallet.exportBuffer(keys.privateKey)),
			],
		);
	}

	static async exportBuffer(key: CryptoKey) {
		return subtle.exportKey(key.type === "public" ? "raw" : "pkcs8", key);
	}
}
