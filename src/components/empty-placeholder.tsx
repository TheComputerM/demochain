import { type Component, mergeProps } from "solid-js";
import { Center } from "styled-system/jsx";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

export const EmptyPlaceholder: Component<
	Partial<{ title: string; description: string }>
> = (_props) => {
	const props = mergeProps(
		{
			title: "No items",
			description: "There are no items to show",
		},
		_props,
	);
	return (
		<Center
			height="48"
			flexDirection="column"
			borderWidth="2"
			borderColor="border.muted"
			borderStyle="dashed"
			borderRadius="l1"
			color="fg.muted"
		>
			<Heading as="h4" textStyle="lg">
				{props.title}
			</Heading>
			<Text>{props.description}</Text>
		</Center>
	);
};
