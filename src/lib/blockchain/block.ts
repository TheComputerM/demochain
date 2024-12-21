import { encode } from "cbor2";
import { subtle } from "uncrypto";
import { logger } from "../logger";
import type { Transaction } from "./transaction";
import { uint8ArrayToHex } from "uint8array-extras";

export class Block {
	index: number;
	timestamp: number;
	hash: string;
	previousHash: string;
	nonce: number;
	minedBy: Uint8Array;
	transactions: Transaction[];

	constructor(
		index: number,
		timestamp: number,
		hash: string,
		previousHash: string,
		nonce: number,
		minedBy: Uint8Array,
		transactions: Transaction[],
	) {
		this.index = index;
		this.timestamp = timestamp;
		this.hash = hash;
		this.previousHash = previousHash;
		this.nonce = nonce;
		this.minedBy = minedBy;
		this.transactions = transactions;
	}

	async calculateHash() {
		const buffer = encode(this);
		const hashBuffer = await subtle.digest("SHA-256", buffer);
		const hash = uint8ArrayToHex(new Uint8Array(hashBuffer));
		return hash;
	}

	async mine(difficulty: number) {
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
		) {
			this.nonce++;
			this.hash = await this.calculateHash();
		}
		logger.success(`mined block:${this.hash}`);
	}
}
