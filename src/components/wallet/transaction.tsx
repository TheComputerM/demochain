import { encode } from "cbor2";
import { HStack } from "styled-system/jsx";
import { selfId } from "trystero";
import { useBlockchain } from "~/lib/blockchain-context";
import { Transaction } from "~/lib/blockchain/transaction";
import { useRoom } from "~/lib/room";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const TransactionForm = () => {
	const room = useRoom();
	const sendTransaction = room.makeAction("sngl_tsx")[0];
	const blockchain = useBlockchain();

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		const formdata = new FormData(e.target as HTMLFormElement);
		const wallet = formdata.get("wallet") as string;
		const amount = Number.parseInt(formdata.get("amount") as string);
		const transaction = new Transaction(selfId, wallet, amount, Date.now());
		blockchain.addTransaction(transaction);
		sendTransaction(encode(transaction));
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
