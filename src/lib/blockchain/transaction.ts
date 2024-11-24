export class Transaction {
	sender: string;
	recipient: string;
	amount: number;
	timestamp: number;

	constructor(
		sender: string,
		recipient: string,
		amount: number,
		timestamp: number,
	) {
		this.sender = sender;
		this.recipient = recipient;
		this.amount = amount;
		this.timestamp = timestamp;
	}
}
