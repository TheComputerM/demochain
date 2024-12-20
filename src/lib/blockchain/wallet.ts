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

	/**
	 * Converts an array buffer into a hex string
	 */
	static arrayBufferToHex(buffer: ArrayBuffer) {
		return [...new Uint8Array(buffer)]
			.map((x) => x.toString(16).padStart(2, "0"))
			.join("");
	}

	async exportHex(which: "public" | "private" = "public") {
		if (which === "public") return subtle.exportKey("raw", this.public);
		return subtle.exportKey("pkcs8", this.private);
	}
}
