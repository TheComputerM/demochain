import { Store } from "@tanstack/solid-store";
import { Block } from "./block";
import { deserialize, serialize } from "./serializer";

export const blockchain = new Store<Block[]>([]);
export const chainSettings = new Store<{
	difficulty: number;
}>({
	difficulty: 1,
});

export async function addBlock(block: Block) {
	const previousBlock = blockchain.state.at(-1)!;
	if ((await previousBlock.calculateHash()) !== block.previousHash) {
		throw new Error("Invalid previousHash");
	}
	if ((await block.calculateHash()) !== block.hash) {
		throw new Error("Invalid block hash");
	}

	blockchain.setState((prev) => [...prev, block]);
}

export async function createGenesisBlock() {
	if (blockchain.state.length !== 0) {
		throw new Error("Genesis block already exists");
	}

	const block = new Block(0, Date.now(), "", "", 0);
	console.log(serialize(block));
	await block.mine(chainSettings.state.difficulty);
	console.log(deserialize(serialize(block)));
	blockchain.setState(() => [block]);
}
