import { Store } from "@tanstack/solid-store";
import { selfId } from "trystero";
import { Block } from "./block";
import { Transaction } from "./transaction";

export const blockchainStore = new Store<Block[]>([]);
export const chainSettingsStore = new Store<{
	difficulty: number;
}>({
	difficulty: 1,
});

/**
 * Adds a block to the blockchain after verifying it is correct.
 */
export async function addBlock(block: Block) {
	const previousBlock = blockchainStore.state.at(-1)!;
	if ((await previousBlock.calculateHash()) !== block.previousHash) {
		throw new Error("Invalid previousHash");
	}
	if ((await block.calculateHash()) !== block.hash) {
		throw new Error("Invalid block hash");
	}

	blockchainStore.setState((prev) => [...prev, block]);
}

/**
 * Creates the genesis block when there are no other nodes in the network.
 */
export async function createGenesisBlock() {
	if (blockchainStore.state.length !== 0) {
		throw new Error("Genesis block already exists");
	}

	const block = new Block(0, Date.now(), "", "", 0, [
		new Transaction("Creator", selfId, 1000),
	]);

	await block.mine(chainSettingsStore.state.difficulty);
	blockchainStore.setState(() => [block]);
}
