import { signAsync, verifyAsync } from "@noble/ed25519";
import { encode } from "cbor2";

type TransactionData = {
	nonce: number;
	sender: Uint8Array;
	recipient: Uint8Array;
	amount: number;
	gasFees: number;
	timestamp: number;
	signature: Uint8Array;
};

export class Transaction {
	constructor(private readonly _internal: TransactionData) {}

	get nonce() {
		return this._internal.nonce;
	}
	get sender() {
		return this._internal.sender;
	}
	get recipient() {
		return this._internal.recipient;
	}
	get amount() {
		return this._internal.amount;
	}
	get gasFees() {
		return this._internal.gasFees;
	}
	get timestamp() {
		return this._internal.timestamp;
	}
	get signature() {
		return this._internal.signature;
	}

	toJSON() {
		return this._internal;
	}

	/**
	 * creates a new transaction with sensible defaults
	 */
	static create(input: {
		nonce: number;
		sender: Uint8Array;
		recipient: Uint8Array;
		amount: number;
		gasFees: number;
	}) {
		const transaction = new Transaction({
			timestamp: Date.now(),
			signature: new Uint8Array(0),
			...input,
		});

		return transaction;
	}

	/**
	 * returns transaction data without the signature
	 */
	get data() {
		const { signature: _, ...data } = this._internal;
		return data;
	}

	/**
	 * signs the transaction with the provided private key
	 */
	async sign(privateKey: Uint8Array) {
		const buffer = encode(this.data);
		this._internal.signature = await signAsync(buffer, privateKey);
	}

	/**
	 * verifies the transaction signature
	 */
	async verify() {
		return await verifyAsync(this.signature, encode(this.data), this.sender);
	}
}
