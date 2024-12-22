import { Tag } from "cbor2";
import { registerEncoder } from "cbor2/encoder";
import { Block } from "../blockchain/block";
import { Transaction } from "../blockchain/transaction";

// Serialization for Transaction class
registerEncoder(Transaction, (b, _writer, _options) => [64000, b.toJSON()]);
Tag.registerDecoder(
	64000,
	({ contents }) =>
		new Transaction(contents as ConstructorParameters<typeof Transaction>[0]),
);

// Serialization for Block class
registerEncoder(Block, (b, _writer, _options) => [64001, b.toJSON()]);
Tag.registerDecoder(
	64001,
	({ contents }) =>
		new Block(contents as ConstructorParameters<typeof Block>[0]),
);
