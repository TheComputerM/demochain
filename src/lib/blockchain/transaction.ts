export class Transaction {
	sender: Uint8Array;
	recipient: Uint8Array;
	amount: number;
	timestamp: number;

	constructor(
		sender: Uint8Array,
		recipient: Uint8Array,
		amount: number,
		timestamp: number,
	) {
		this.sender = sender;
		this.recipient = recipient;
		this.amount = amount;
		this.timestamp = timestamp;
	}
}
