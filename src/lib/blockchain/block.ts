import { signAsync, verifyAsync } from "@noble/ed25519";
import { encode } from "cbor2";
import { uint8ArrayToHex } from "uint8array-extras";
import { logger } from "../logger";
import type { Transaction } from "./transaction";

type BlockData = {
	index: number;
	timestamp: number;
	hash: Uint8Array;
	previousHash: Uint8Array;
	nonce: number;
	minedBy: Uint8Array;
	transactions: Transaction[];
	signature: Uint8Array;
};

export class Block {
	constructor(private readonly _internal: BlockData) {}

	get index() {
		return this._internal.index;
	}
	get timestamp() {
		return this._internal.timestamp;
	}
	get hash() {
		return this._internal.hash;
	}
	get previousHash() {
		return this._internal.previousHash;
	}
	get nonce() {
		return this._internal.nonce;
	}
	get minedBy() {
		return this._internal.minedBy;
	}
	get transactions() {
		return this._internal.transactions;
	}
	get signature() {
		return this._internal.signature;
	}

	toJSON() {
		return this._internal;
	}

	static async create(input: {
		index: number;
		previousHash: Uint8Array;
		minedBy: Uint8Array;
		transactions: Transaction[];
	}) {
		const block = new Block({
			timestamp: Date.now(),
			hash: new Uint8Array(),
			nonce: 0,
			signature: new Uint8Array(),
			...input,
		});

		block._internal.hash = await block.calculateHash();
		return block;
	}

	get data() {
		const { signature: _, ...data } = this.toJSON();
		return data;
	}

	async calculateHash() {
		// calculate hash using every property except the signature
		// and the hash itself
		const { hash: _, ...data } = this.data;

		const buffer = encode(data);
		const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
		const hash = new Uint8Array(hashBuffer);
		return hash;
	}

	/**
	 * ensures that the block hash starts with [difficulty] number of 0s
	 */
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
			this._internal.nonce++;
			this._internal.hash = await this.calculateHash();
		}
		logger.success(`mined block:${uint8ArrayToHex(this.hash.slice(0, 6))}...`);
	}

	/**
	 * returns the total amount of gas fees of the transactions in the block
	 */
	getGasFees() {
		return this.transactions.reduce((total, transaction) => {
			return total + transaction.gasFees;
		}, 0);
	}

	/**
	 * signs the block with the provided private key
	 */
	async sign(privateKey: Uint8Array) {
		const buffer = encode(this.data);
		this._internal.signature = await signAsync(buffer, privateKey);
	}

	/**
	 * verifies the block signature
	 */
	async verify() {
		return await verifyAsync(this.signature, encode(this.data), this.minedBy);
	}
}
