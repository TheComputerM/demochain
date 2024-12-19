import { A, type RouteSectionProps } from "@solidjs/router";
import { clientOnly } from "node_modules/@solidjs/start/dist";
import { For } from "solid-js";
import { Portal } from "solid-js/web";
import { css } from "styled-system/css";
import { Container, Flex, Stack } from "styled-system/jsx";
import ThemeSwitcher from "~/components/theme-switcher";
import { IconButton } from "~/components/ui/icon-button";
import { Tooltip } from "~/components/ui/tooltip";
import TablerChartDots3Filled from "~icons/tabler/chart-dots-3-filled";
import TablerLogout from "~icons/tabler/logout";
import TablerPick from "~icons/tabler/pick";
import TablerTerminal2 from "~icons/tabler/terminal-2";
import TablerTopologyFull from "~icons/tabler/topology-full";
import TablerWallet from "~icons/tabler/wallet";
import "~/lib/utils/register-encoder";

const RoomProvider = clientOnly(() =>
	import("~/lib/room-context").then((m) => ({ default: m.RoomProvider })),
);
const BlockchainProvider = clientOnly(() =>
	import("~/lib/blockchain-context").then((m) => ({
		default: m.BlockchainProvider,
	})),
);

export default function AppLayout(props: RouteSectionProps) {
	const routes = [
		{ icon: TablerWallet, id: "wallet", label: "Wallet" },
		{ icon: TablerTopologyFull, id: "network", label: "Network" },
		{ icon: TablerChartDots3Filled, id: "blockchain", label: "Blockchain" },
		{ icon: TablerPick, id: "mempool", label: "Mempool" },
		{ icon: TablerTerminal2, id: "console", label: "Console" },
	];
	return (
		<Flex>
			<aside
				class={css({
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					position: "sticky",
					top: 0,
					height: "100svh",
					backgroundColor: "bg.default",
					paddingBlock: 1,
					paddingInline: 1,
					borderColor: "border.subtle",
					borderRight: "1px solid",
				})}
			>
				<Stack gap="2">
					<For each={routes}>
						{(route) => (
							<Tooltip.Root
								openDelay={100}
								positioning={{ placement: "right" }}
							>
								<Tooltip.Trigger
									asChild={(forwardProps) => (
										<IconButton
											{...forwardProps()}
											variant={
												props.location.pathname.includes(route.id)
													? "subtle"
													: "ghost"
											}
											asChild={(forwardProps) => (
												<A {...forwardProps()} href={`/${route.id}`}>
													<route.icon />
												</A>
											)}
										/>
									)}
								/>
								<Portal>
									<Tooltip.Positioner>
										<Tooltip.Content>{route.label}</Tooltip.Content>
									</Tooltip.Positioner>
								</Portal>
							</Tooltip.Root>
						)}
					</For>
				</Stack>
				<Stack gap="1">
					<ThemeSwitcher />
					<IconButton
						asChild={(forwardProps) => (
							<A {...forwardProps()} href="/">
								<TablerLogout />
							</A>
						)}
					/>
				</Stack>
			</aside>
			<Container mt="3" width="full">
				<RoomProvider>
					<BlockchainProvider>{props.children}</BlockchainProvider>
				</RoomProvider>
			</Container>
		</Flex>
	);
}
