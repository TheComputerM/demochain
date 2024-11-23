import {
	type ParentComponent,
	createContext,
	onCleanup,
	onMount,
	useContext,
} from "solid-js";
import type { Room } from "trystero";
import { joinRoom, selfId } from "trystero/mqtt";
import { createGenesisBlock } from "./blockchain/chain";
import { logger } from "./logger";

export const RoomContext = createContext<Room>();

export const RoomProvider: ParentComponent = (props) => {
	const room = joinRoom(
		{
			appId: "demochain_project",
			relayUrls: [
				"wss://broker.emqx.io:8084/mqtt",
				"wss://mqtt.eclipseprojects.io:433/mqtt",
				"wss://broker.hivemq.com:8884/mqtt",
				"wss://test.mosquitto.org:8081/mqtt",
			],
		},
		"main",
	);

	logger.info(`Joined network as ${selfId}`);

	// creates genesis block if it is the first node
	onMount(() => {
		setTimeout(async () => {
			if (Object.keys(room.getPeers()).length === 0) {
				logger.info("Creating genesis block");
				await createGenesisBlock();
			}
		}, 2000);
	});

	room.onPeerJoin((peer) => {
		logger.info(`Peer ${peer} joined the network`);
	});

	room.onPeerLeave((peer) => {
		logger.info(`Peer ${peer} is offline`);
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
