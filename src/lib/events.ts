import { encode } from "cbor2";
import type { ActionReceiver, ActionSender, Room } from "trystero";
import type { Block } from "./blockchain/block";
import type { Transaction } from "./blockchain/transaction";
import { logger } from "./logger";

export enum RoomEvent {
	/**
	 * Send/recieve request to sync network state
	 */
	REQUEST_STATE = "req_state",

	/**
	 * Send/recieve network state
	 */
	SYNC_STATE = "syn_state",

	/**
	 * Send/recieve transactions to add to the mempool
	 */
	TRANSACTION = "sngl_tsx",

	/**
	 * Send/recieve mined blocks
	 */
	BLOCK = "sngl_blk",

	/**
	 * Send/recieve wallets when joining/leaving the network
	 */
	WALLET = "sngl_wlt",
}

const eventsCache = new Map<
	RoomEvent,
	[ActionSender<Uint8Array>, ActionReceiver<Uint8Array>]
>();

export function registerRoomEvents(room: Room) {
	for (const event of Object.values(RoomEvent)) {
		const [send, recieve] = room.makeAction<Uint8Array>(event);
		eventsCache.set(event, [send, recieve]);
	}
}

export function sendRoomEvent(type: RoomEvent) {
	const event = eventsCache.get(type);
	if (!event) {
		throw new Error(`Event ${type} is not registered`);
	}
	return event[0];
}

export function recieveRoomEvent(type: RoomEvent) {
	const event = eventsCache.get(type);
	if (!event) {
		throw new Error(`Event ${type} is not registered`);
	}
	return event[1];
}

export const actions = {
	/**
	 * Broadcast a block to the entire network
	 */
	broadcastBlock: async (block: Block) => {
		const sendBlock = sendRoomEvent(RoomEvent.BLOCK);
		await sendBlock(encode(block));
		logger.info(
			`broadcasted block:${block.hash.slice(0, 6)}... to the network`,
		);
	},

	/**
	 * Broadcast a transaction to the entire network
	 */
	broadcastTransaction: async (transaction: Transaction) => {
		const sendTransaction = sendRoomEvent(RoomEvent.TRANSACTION);
		await sendTransaction(encode(transaction));
		logger.info(`broadcasted transaction:${transaction.nonce} to the network`);
	},
};
