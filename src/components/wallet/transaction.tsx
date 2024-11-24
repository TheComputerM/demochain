import { HStack } from "styled-system/jsx";
import { selfId } from "trystero";
import { Transaction } from "~/lib/blockchain/transaction";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const TransactionForm = () => {
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		const formdata = new FormData(e.target as HTMLFormElement);
		const wallet = formdata.get("wallet") as string;
		const amount = Number.parseInt(formdata.get("amount") as string);
		const transaction = new Transaction(selfId, wallet, amount);
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
