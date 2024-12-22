import { createSignal } from "solid-js";
import { For, Portal } from "solid-js/web";
import { Box, Stack, Wrap } from "styled-system/jsx";
import { useBlockchain } from "~/lib/blockchain-context";
import TablerPackageImport from "~icons/tabler/package-import";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { RadioGroup } from "../ui/radio-group";
import { PeerDisplay } from "./peer-display";

export const SyncDialog = () => {
	const blockchain = useBlockchain();
	const peers = blockchain.peers;

	const [selectedPeer, setSelectedPeer] = createSignal<string | null>(null);

	function startSync() {
		console.log("TODO");
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger
				asChild={(triggerProps) => (
					<Button {...triggerProps()}>
						Sync with Network <TablerPackageImport />
					</Button>
				)}
			/>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Stack gap="8" p="6">
							<Stack gap="1">
								<Dialog.Title>Sync with peer</Dialog.Title>
								<Dialog.Description>
									Choose a peer to sync network data with.
								</Dialog.Description>
							</Stack>
							<RadioGroup.Root
								value={selectedPeer()}
								onValueChange={(e) => setSelectedPeer(e.value)}
							>
								<Wrap
									maxWidth="4xl"
									maxHeight="sm"
									overflowY="auto"
									justify="center"
								>
									<For each={Array.from(peers.entries())}>
										{([peerId, data]) => (
											<Box
												borderWidth="1px"
												paddingRight="2"
												borderColor={
													selectedPeer() === peerId
														? "colorPalette.default"
														: "border.default"
												}
											>
												<RadioGroup.Item value={peerId}>
													<PeerDisplay
														peerId={peerId}
														publicKey={data.publicKey}
													/>
													<RadioGroup.ItemControl />
													<RadioGroup.ItemHiddenInput />
												</RadioGroup.Item>
											</Box>
										)}
									</For>
								</Wrap>
							</RadioGroup.Root>
							<Stack gap="3" direction="row" width="full">
								<Button
									width="full"
									onClick={startSync}
									disabled={!selectedPeer()}
								>
									Sync
								</Button>
							</Stack>
						</Stack>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
