import { HStack } from "styled-system/jsx";
import { selfId } from "trystero";
import { addTransaction } from "~/lib/blockchain/mempool";
import { serialize } from "~/lib/blockchain/serializer";
import { Transaction } from "~/lib/blockchain/transaction";
import { useRoom } from "~/lib/room";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const TransactionForm = () => {
	const room = useRoom();
	const [sendTransaction] = room.makeAction("send_tsx");

	const handleSubmit = (e: SubmitEvent) => {
		const formdata = new FormData(e.target as HTMLFormElement);
		const wallet = formdata.get("wallet") as string;
		const amount = Number.parseInt(formdata.get("amount") as string);
		const transaction = new Transaction(selfId, wallet, amount);
		sendTransaction(serialize(transaction));
		addTransaction(transaction);

		e.preventDefault();
	};
	return (
		<form onSubmit={handleSubmit}>
			<HStack>
				<Input name="wallet" placeholder="Wallet ID" />
				<Input name="amount" type="number" placeholder="Amount" />
				<Button type="submit">Send</Button>
			</HStack>
		</form>
	);
};
