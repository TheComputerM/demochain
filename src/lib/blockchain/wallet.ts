import { subtle } from "uncrypto";

const algorithm = {
	name: "ECDSA",
	namedCurve: "P-256",
};

export class Wallet {
	public: CryptoKey;
	private: CryptoKey;
	constructor(publicKey: CryptoKey, privateKey: CryptoKey) {
		this.public = publicKey;
		this.private = privateKey;
	}

	/**
	 * Generates a wallet with random keys
	 */
	static async generate() {
		const keys = await subtle.generateKey(algorithm, true, ["sign", "verify"]);
		return new Wallet(keys.publicKey, keys.privateKey);
	}

	static async exportBuffer(key: CryptoKey) {
		return subtle.exportKey(key.type === "public" ? "raw" : "pkcs8", key);
	}
	
	static async exportHex(key: CryptoKey) {
		const buffer = await Wallet.exportBuffer(key);
		return [...new Uint8Array(buffer)]
			.map((x) => x.toString(16).padStart(2, "0"))
			.join("");
	}
}
