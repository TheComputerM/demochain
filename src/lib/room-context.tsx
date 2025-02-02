import {
	type ParentComponent,
	createContext,
	onCleanup,
	onMount,
	useContext,
} from "solid-js";
import type { Room } from "trystero";
import { joinRoom, selfId } from "trystero/firebase";
import { registerRoomEvents } from "./events";
import { logger } from "./logger";

const RoomContext = createContext<Room>();

export const TrysteroConfig = {
	appId:
		"https://relay-9e877-default-rtdb.asia-southeast1.firebasedatabase.app",
	rootPath: "__demochain__",
};

export const RoomProvider: ParentComponent = (props) => {
	const networkId = sessionStorage.getItem("network");
	if (!networkId) {
		throw new Error("Network ID is not present in sesssion storage");
	}

	const room = joinRoom(TrysteroConfig, networkId);
	registerRoomEvents(room);

	logger.debug(`joined network '${networkId}' as peer:${selfId}`);

	onMount(() => {
		room.onPeerJoin((peer) => {
			logger.trace(`peer:${peer} joined the network`);
			window.dispatchEvent(new CustomEvent("peer-join", { detail: peer }));
		});

		room.onPeerLeave((peer) => {
			logger.trace(`peer:${peer} is offline`);
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
