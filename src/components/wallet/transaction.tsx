import { encode } from "cbor2";
import { createStore } from "solid-js/store";
import { Stack } from "styled-system/jsx";
import { selfId } from "trystero/firebase";
import { useBlockchain } from "~/lib/blockchain-context";
import { Transaction } from "~/lib/blockchain/transaction";
import { NetworkEvent, useRoom } from "~/lib/room";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Field } from "../ui/field";

export const TransactionForm = () => {
	const room = useRoom();
	const blockchain = useBlockchain();

	const defaultFormdata = {
		wallet: "",
		amount: 0,
	};

	const [formdata, setFormdata] = createStore(defaultFormdata);

	const broadcastTransaction = room.makeAction(NetworkEvent.TRANSACTION)[0];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const transaction = new Transaction(
			selfId,
			formdata.wallet,
			formdata.amount,
			Date.now(),
		);
		blockchain.addTransaction(transaction);
		await broadcastTransaction(encode(transaction));
	}
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>Create transaction</Card.Title>
				<Card.Description>
					Send some about of $ to another wallet
				</Card.Description>
			</Card.Header>
			<form onSubmit={handleSubmit} style={{ display: "contents" }}>
				<Card.Body>
					<Stack>
						<Field.Root>
							<Field.Label>Wallet ID</Field.Label>
							<Field.Input
								value={formdata.wallet}
								required
								onInput={(e) => setFormdata("wallet", e.currentTarget.value)}
							/>
						</Field.Root>
						<Field.Root>
							<Field.Label>Amount</Field.Label>
							<Field.Input
								type="number"
								value={formdata.amount}
								required
								onInput={(e) =>
									setFormdata("amount", e.currentTarget.valueAsNumber)
								}
							/>
						</Field.Root>
					</Stack>
				</Card.Body>
				<Card.Footer>
					<Button type="submit">Send</Button>
				</Card.Footer>
			</form>
		</Card.Root>
	);
};
