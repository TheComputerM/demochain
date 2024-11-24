import { logger } from "../logger";
import type { Transaction } from "./transaction";

export class Block {
	index: number;
	timestamp: number;
	hash: string;
	previousHash: string;
	nonce: number;
	transactions: Transaction[];

	constructor(
		index: number,
		timestamp: number,
		hash: string,
		previousHash: string,
		nonce: number,
		transactions: Transaction[],
	) {
		this.index = index;
		this.timestamp = timestamp;
		this.hash = hash;
		this.previousHash = previousHash;
		this.nonce = nonce;
		this.transactions = transactions;
	}

	async calculateHash() {
		const data = `${this.index}${this.timestamp}${this.previousHash}${this.nonce}${this.transactions}`;
		const buffer = new TextEncoder().encode(data);
		const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hash = hashArray
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");
		return hash;
	}

	async mine(difficulty: number) {
		const startTime = new Date().getTime();
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
		) {
			this.nonce++;
			this.hash = await this.calculateHash();
		}
		const endTime = new Date().getTime();
		logger.info(`Mined block ${this.hash} in ${endTime - startTime}ms`);
	}
}
