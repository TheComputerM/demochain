import {
	type ParentComponent,
	createContext,
	onCleanup,
	onMount,
	useContext,
} from "solid-js";
import type { Room } from "trystero";
import { joinRoom, selfId } from "trystero/mqtt";
import { logger } from "./logger";

const RoomContext = createContext<Room>();

export enum NetworkEvent {
	STATE = "net_state",
	TRANSACTION = "sngl_tsx",
	BLOCK = "sngl_blk",
}

export const RoomProvider: ParentComponent = (props) => {
	const room = joinRoom(
		{
			appId: "demochain_rulezz",
			relayUrls: [
				"wss://broker.emqx.io:8084/mqtt",
				"wss://broker.hivemq.com:8884/mqtt",
				"wss://test.mosquitto.org:8081/mqtt",
			],
			rtcConfig: {
				iceServers: [
					{
						urls: [
							"stun.l.google.com:19302",
							"stun1.l.google.com:19302",
							"stun2.l.google.com:19302",
							"stun3.l.google.com:19302",
							"stun4.l.google.com:19302",
							"stun.ekiga.net",
						],
					},
					{
						urls: "turn:numb.viagenie.ca",
						credential: "muazkh",
						username: "webrtc@live.com",
					},
					{
						urls: "turn:192.158.29.39:3478?transport=udp",
						credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
						username: "28224511:1379330808",
					},
					{
						urls: "turn:192.158.29.39:3478?transport=tcp",
						credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
						username: "28224511:1379330808",
					},
					{
						urls: "turn:turn.bistri.com:80",
						credential: "homeo",
						username: "homeo",
					},
					{
						urls: "turn:turn.anyfirewall.com:443?transport=tcp",
						credential: "webrtc",
						username: "webrtc",
					},
				],
			},
		},
		"main",
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
