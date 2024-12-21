import { encode } from "cbor2";
import { subtle } from "uncrypto";

export class Transaction {
	hash: Uint8Array;
	sender: Uint8Array;
	recipient: Uint8Array;
	amount: number;
	timestamp: number;

	constructor(
		hash: Uint8Array,
		sender: Uint8Array,
		recipient: Uint8Array,
		amount: number,
		timestamp: number,
	) {
		this.hash = hash;
		this.sender = sender;
		this.recipient = recipient;
		this.amount = amount;
		this.timestamp = timestamp;
	}

	static async create(input: {
		sender: Uint8Array;
		recipient: Uint8Array;
		amount: number;
	}) {
		const transaction = new Transaction(
			new Uint8Array(),
			input.sender,
			input.recipient,
			input.amount,
			Date.now(),
		);
		transaction.hash = await transaction.calculateHash();
		return transaction;
	}

	async calculateHash() {
		const buffer = encode([
			this.sender,
			this.recipient,
			this.amount,
			this.timestamp,
		]);
		const hashBuffer = await subtle.digest("SHA-256", buffer);
		const hash = new Uint8Array(hashBuffer);
		return hash;
	}
}
