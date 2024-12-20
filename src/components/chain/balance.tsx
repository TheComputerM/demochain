import type { ParentComponent } from "solid-js";
import { HStack } from "styled-system/jsx";
import TablerCoins from "~icons/tabler/coins";
import { Text } from "../ui/text";

export const Balance: ParentComponent = (props) => {
	return (
		<HStack>
			<Text fontWeight="bold">{props.children}</Text>
			<TablerCoins />
		</HStack>
	);
};
