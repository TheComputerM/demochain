import * as ed from "@noble/ed25519";

export class PublicKey {
	key: Uint8Array;

	constructor(key: Uint8Array) {
		this.key = key;
	}

	async verify(data: Uint8Array, signature: Uint8Array) {
		return ed.verifyAsync(signature, data, this.key);
	}

	static async fromPrivateKey(privateKey: Uint8Array) {
		return new PublicKey(await ed.getPublicKeyAsync(privateKey));
	}
}

export class PrivateKey {
	key: Uint8Array;

	constructor(key: Uint8Array) {
		this.key = key;
	}

	async sign(data: Uint8Array) {
		return ed.signAsync(data, this.key);
	}

	static generate() {
		return new PrivateKey(ed.utils.randomPrivateKey());
	}
}
