import type { Component } from "solid-js";
import { Badge } from "../ui/badge";

import TablerExternalLink from "~icons/tabler/external-link";

export const InspectCBOR: Component<{ data: string }> = (props) => {
	return (
		<Badge
			variant="solid"
			asChild={(forwardProps) => (
				<a
					{...forwardProps()}
					href={`https://cbor.me/?bytes=${props.data}`}
					target="_blank"
					rel="noreferrer"
				>
					Inspect CBOR <TablerExternalLink />
				</a>
			)}
		/>
	);
};
