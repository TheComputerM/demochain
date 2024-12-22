import type { Component } from "solid-js";
import TablerRosetteDiscountCheckFilled from "~icons/tabler/rosette-discount-check-filled";
import { Badge } from "../ui/badge";

export const VerifySignature: Component<{
	key: string;
	signature: string;
	message: string;
}> = (props) => {
	const url = `https://cyphr.me/ed25519_tool/ed.html#?alg_type=Msg&msg_enc=Hex&msg=${props.message}&key_enc=Hex&key=${props.key}&sig=${props.signature}&verify`;
	return (
		<Badge
			variant="outline"
			borderRadius="sm"
			asChild={(forwardProps) => (
				<a
					{...forwardProps()}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
				>
					Verify Signature <TablerRosetteDiscountCheckFilled />
				</a>
			)}
		/>
	);
};
