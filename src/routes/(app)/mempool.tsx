import type { Component } from "solid-js";
import { Stack } from "styled-system/jsx";
import { Heading } from "~/components/ui/heading";

const MempoolDisplay: Component = () => {
	return <Stack>TODO</Stack>;
};

export default function MempoolPage() {
	return (
		<Stack gap="6">
			<Heading as="h1" textStyle="4xl">
				Mempool
			</Heading>
			<MempoolDisplay />
		</Stack>
	);
}
