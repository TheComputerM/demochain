import { subtle } from "uncrypto";

const algorithm = {
	name: "ECDSA",
	namedCurve: "P-256",
};

export class Wallet {
	public: CryptoKey;
	private: CryptoKey;

	raw: {
		public: Uint8Array;
		private: Uint8Array;
	};

	constructor(
		publicKey: CryptoKey,
		privateKey: CryptoKey,
		rawPublic: Uint8Array,
		rawPrivate: Uint8Array,
	) {
		this.public = publicKey;
		this.private = privateKey;
		this.raw = {
			public: rawPublic,
			private: rawPrivate,
		};
	}

	/**
	 * Generates a wallet with random keys
	 */
	static async generate() {
		const keys = await subtle.generateKey(algorithm, true, ["sign", "verify"]);
		return new Wallet(
			keys.publicKey,
			keys.privateKey,
			new Uint8Array(await Wallet.exportBuffer(keys.publicKey)),
			new Uint8Array(await Wallet.exportBuffer(keys.privateKey)),
		);
	}

	static async exportBuffer(key: CryptoKey) {
		return subtle.exportKey(key.type === "public" ? "raw" : "pkcs8", key);
	}

	static Uint8ArrayToHex(array: Uint8Array) {
		return [...array].map((x) => x.toString(16).padStart(2, "0")).join("");
	}

	static compareKeys(a: Uint8Array, b: Uint8Array) {
		if (a.length !== b.length) {
			return false;
		}

		return a.every((value, index) => value === b[index]);
	}
}
