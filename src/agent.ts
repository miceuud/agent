import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

//  The events can be replaced
export const ERC20_TRANSFER_EVENT =
  "event Transfer(address indexed from, address indexed to, uint256 value)";
export const ERC_SWAP_EVENT =
  "event Swap( address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)";
export const ERC_APPROVAL_EVENT =
  "event Approval(address indexed _owner, address indexed _spender, uint256 _value)";
export const TETHER_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const DAI_ERC = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const WETH_ERC = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

let findingsCount = 0;

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  if (findingsCount >= 5) return findings;

  // filter the transaction
  const ercTransferEvents = txEvent.filterLog(ERC20_TRANSFER_EVENT, WETH_ERC);

  ercTransferEvents.forEach((transferEvent) => {
    // extract transfer event arguments

    //log event name
    console.log(transferEvent.eventFragment.name);

    const { to, from } = transferEvent.args;
    findings.push(
      Finding.fromObject({
        name: "Transfer Event",
        description: `Transfer event was emitted`,
        alertId: "FORTA-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          to,
          from,
        },
      })
    );
    //   findingsCount++;
  });

  return findings;
};

export default {
  handleTransaction,
};
