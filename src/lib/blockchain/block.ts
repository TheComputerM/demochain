import { encode } from "cbor2";
import { uint8ArrayToHex } from "uint8array-extras";
import { logger } from "../logger";
import type { PrivateKey } from "./keys";
import type { Transaction } from "./transaction";

export class Block {
	index: number;
	timestamp: number;
	hash: Uint8Array;
	previousHash: Uint8Array;
	nonce: number;
	minedBy: Uint8Array;
	transactions: Transaction[];

	signature?: Uint8Array;

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

	static async create(input: {
		index: number;
		previousHash: Uint8Array;
		minedBy: Uint8Array;
		transactions: Transaction[];
	}) {
		const block = new Block(
			input.index,
			Date.now(),
			new Uint8Array([]),
			input.previousHash,
			0,
			input.minedBy,
			input.transactions,
		);

		block.hash = await block.calculateHash();
		return block;
	}

	async calculateHash() {
		// calculate hash using every property except the hash itself
		const buffer = encode([
			this.index,
			this.timestamp,
			this.previousHash,
			this.nonce,
			this.minedBy,
			this.transactions,
		]);
		const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
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

	async sign(wallet: PrivateKey) {
		const buffer = encode(this);
		this.signature = await wallet.sign(buffer);
	}
}
