import {
	type ParentComponent,
	createContext,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";
import { Show } from "solid-js";
import type { Room } from "trystero";
import { joinRoom } from "trystero/mqtt";

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

	onCleanup(room.leave);

	return (
		<RoomContext.Provider value={room}>{props.children}</RoomContext.Provider>
	);
};
