import type { Component } from "solid-js";
import { css } from "styled-system/css";
import { HStack } from "styled-system/jsx";
import TablerStarFilled from "~icons/tabler/star-filled";
import { Link } from "./ui/link";
import { Text } from "./ui/text";

export const Footer: Component = () => {
	return (
		<footer class={css({ mt: 6 })}>
			<HStack
				textStyle="sm"
				color="fg.muted"
				borderTopWidth="thin"
				py="2"
				justify="space-between"
			>
				<Text>
					Made By{" "}
					<Link target="_blank" href="https://github.com/TheComputerM">
						TheComputerM
					</Link>
				</Text>
				<a
					href="https://github.com/TheComputerM/mystic-ui/stargazers"
					class={css({ _hover: { color: "yellow.300" } })}
				>
					<TablerStarFilled />
				</a>
			</HStack>
		</footer>
	);
};
