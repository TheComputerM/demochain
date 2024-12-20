import { subtle } from "uncrypto";

const algorithm = {
	name: "ECDSA",
	namedCurve: "P-256",
	hash: "SHA-256",
};

type KeyPair<T> = {
	public: T;
	private?: T;
};

export class Wallet {
	keys: KeyPair<CryptoKey>;
	raw: KeyPair<Uint8Array>;

	constructor(keys: KeyPair<CryptoKey>, raw: KeyPair<Uint8Array>) {
		this.keys = keys;
		this.raw = raw;
	}

	/**
	 * Generates a wallet with random keys
	 */
	static async generate() {
		const keys = await subtle.generateKey(algorithm, true, ["sign", "verify"]);
		const raw = (
			await Promise.all(
				[keys.publicKey, keys.privateKey].map(Wallet.exportBuffer),
			)
		).map((buffer) => new Uint8Array(buffer));

		return new Wallet(
			{
				public: keys.publicKey,
				private: keys.privateKey,
			},
			{
				public: raw[0],
				private: raw[1],
			},
		);
	}

	static async fromPublickey(raw: Uint8Array) {
		const key = await subtle.importKey("raw", raw, algorithm, true, ["verify"]);

		return new Wallet({ public: key }, { public: raw });
	}

	static async exportBuffer(key: CryptoKey) {
		return subtle.exportKey(key.type === "public" ? "raw" : "pkcs8", key);
	}

	async sign(data: Uint8Array) {
		if (!this.keys.private) {
			throw new Error("Cannot sign without a private key");
		}

		return new Uint8Array(
			await subtle.sign(algorithm, this.keys.private, data),
		);
	}

	async verify(data: Uint8Array, signature: Uint8Array) {
		return subtle.verify(algorithm, this.keys.public, signature, data);
	}
}
