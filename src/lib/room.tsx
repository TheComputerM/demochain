import { type ParentComponent, createContext, onCleanup } from "solid-js";
import type { Room } from "trystero";
import { joinRoom, selfId } from "trystero/mqtt";
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

	room.onPeerJoin((peer) => {
		logger.info(`Peer ${peer} joined the network`);
	});

	room.onPeerLeave((peer) => {
		logger.info(`Peer ${peer} is offline`);
	});

	onCleanup(room.leave);

	return (
		<RoomContext.Provider value={room}>{props.children}</RoomContext.Provider>
	);
};
