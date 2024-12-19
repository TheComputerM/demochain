import {
	type ParentComponent,
	createContext,
	onCleanup,
	onMount,
	useContext,
} from "solid-js";
import type { Room } from "trystero";
import { joinRoom, selfId } from "trystero/firebase";
import { logger } from "./logger";

const RoomContext = createContext<Room>();

export enum NetworkEvent {
	STATE = "net_state",
	TRANSACTION = "sngl_tsx",
	BLOCK = "sngl_blk",
}

export const RoomProvider: ParentComponent = (props) => {
	const networkId = sessionStorage.getItem("network");
	if (!networkId) {
		throw new Error("Network ID is not present in sesssion storage");
	}

	const room = joinRoom(
		{
			appId:
				"https://relay-9e877-default-rtdb.asia-southeast1.firebasedatabase.app",
			rootPath: "__demochain__",
		},
		networkId,
	);

	logger.info(`Joined network as ${selfId}`);

	onMount(() => {
		room.onPeerJoin((peer) => {
			logger.info(`Peer ${peer} joined the network`);
			window.dispatchEvent(new CustomEvent("peer-join", { detail: peer }));
		});

		room.onPeerLeave((peer) => {
			logger.info(`Peer ${peer} is offline`);
			window.dispatchEvent(new CustomEvent("peer-leave", { detail: peer }));
		});
	});

	onCleanup(async () => await room.leave());

	return (
		<RoomContext.Provider value={room}>{props.children}</RoomContext.Provider>
	);
};

export const useRoom = () => {
	const room = useContext(RoomContext);
	if (!room) {
		throw new Error("Node isn't connected to any network");
	}

	return room;
};
