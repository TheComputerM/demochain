import {
	type SubmitHandler,
	createForm,
	minRange,
	required,
} from "@modular-forms/solid";
import { hexToUint8Array } from "uint8array-extras";
import { useBlockchain } from "~/lib/blockchain-context";
import { Transaction } from "~/lib/blockchain/transaction";
import { useWallet } from "~/lib/wallet-context";
import TablerTransfer from "~icons/tabler/transfer";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Field } from "../ui/field";

export const CreateTransaction = () => {
	const wallet = useWallet();
	const blockchain = useBlockchain();

	type TransactionForm = {
		wallet: string;
		amount: number;
	};
	const [form, { Form, Field: FormField }] = createForm<TransactionForm>({
		initialValues: {
			amount: 0,
		},
	});

	const handleSubmit: SubmitHandler<TransactionForm> = (values, event) => {
		const reciever = hexToUint8Array(values.wallet);
		const transaction = new Transaction(
			wallet.raw.public,
			reciever,
			values.amount,
			Date.now(),
		);
		blockchain.addTransaction(transaction);
	};

	return (
		<Card.Root height="min-content">
			<Card.Header>
				<Card.Title>Create Transaction</Card.Title>
				<Card.Description>
					This does not broadcast the transaction to the network, it just adds
					it to your mempool.
				</Card.Description>
			</Card.Header>
			<Form style={{ display: "contents" }} onSubmit={handleSubmit}>
				<Card.Body gap="3">
					<FormField
						name="wallet"
						validate={required("Wallet Public Key is required")}
					>
						{(field, props) => (
							<Field.Root invalid={field.error.length > 0}>
								<Field.Label>Wallet Public Key</Field.Label>
								<Field.Input {...props} value={field.value} />
								<Field.HelperText>
									Public key of the wallet you want to send crypto to.
								</Field.HelperText>
								<Field.ErrorText>{field.error}</Field.ErrorText>
							</Field.Root>
						)}
					</FormField>
					<FormField
						name="amount"
						type="number"
						validate={[minRange(1, "Amount should be greater than 0")]}
					>
						{(field, props) => (
							<Field.Root invalid={field.error.length > 0}>
								<Field.Label>Amount</Field.Label>
								<Field.Input {...props} type="number" value={field.value} />
								<Field.ErrorText>{field.error}</Field.ErrorText>
							</Field.Root>
						)}
					</FormField>
				</Card.Body>
				<Card.Footer>
					<Button>
						Create
						<TablerTransfer />
					</Button>
				</Card.Footer>
			</Form>
		</Card.Root>
	);
};
