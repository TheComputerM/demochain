import { encode } from "cbor2";
import { subtle } from "uncrypto";
import { logger } from "../logger";
import type { Transaction } from "./transaction";
import { uint8ArrayToHex } from "uint8array-extras";

export class Block {
	index: number;
	timestamp: number;
	hash: Uint8Array;
	previousHash: Uint8Array;
	nonce: number;
	minedBy: Uint8Array;
	transactions: Transaction[];

	constructor(
		index: number,
		timestamp: number,
		hash: Uint8Array,
		previousHash: Uint8Array,
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
		const hash = new Uint8Array(hashBuffer);
		return hash;
	}

	satisfiesDifficulty(difficulty: number) {
		if (
			!this.hash
				.slice(0, Math.floor(difficulty / 2))
				.every((byte) => byte === 0)
		) {
			return false;
		}

		return this.hash[Math.floor(difficulty / 2)] < 10;
	}

	async mine(difficulty: number) {
		while (!this.satisfiesDifficulty(difficulty)) {
			this.nonce++;
			this.hash = await this.calculateHash();
		}
		logger.success(`mined block:${uint8ArrayToHex(this.hash.slice(0, 6))}...`);
	}
}
