import {
	type ParentComponent,
	createContext,
	onCleanup,
	onMount,
	useContext,
} from "solid-js";
import type { Room } from "trystero";
import { joinRoom, selfId } from "trystero/mqtt";
import {
	blockchainStore,
	chainSettingsStore,
	createGenesisBlock,
} from "./blockchain/chain";
import { logger } from "./logger";
import { deserialize, serialize } from "./blockchain/serializer";
import { mempoolStore } from "./blockchain/mempool";

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

	// creates genesis block if it is the first node after 4s
	onMount(() => {
		setTimeout(async () => {
			if (Object.keys(room.getPeers()).length === 0) {
				logger.info("Creating genesis block");
				await createGenesisBlock();
			}
		}, 4000);
	});

	const [sendInitialization, getInitialization] =
		room.makeAction("init_sync");

	room.onPeerJoin((peer) => {
		logger.info(`Peer ${peer} joined the network`);
		if (blockchainStore.state.length > 0) {
			sendInitialization(
				serialize({
					blockchain: blockchainStore.state,
					settings: chainSettingsStore.state,
					mempool: mempoolStore.state,
				}),
			);
		}
	});

	getInitialization((data) => {
		if (blockchainStore.state.length === 0) {
			logger.info("synced data with network");
			// @ts-ignore
			const { blockchain, settings, mempool } = deserialize(data as Uint8Array);
			blockchainStore.setState(() => blockchain);
			chainSettingsStore.setState(() => settings);
			mempoolStore.setState(() => mempool);
		}
	})

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
