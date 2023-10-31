
# Bitfinity Evm-client

## Introduction
This plugin demonstrates the process of bridging tokens between an ICRC chain and an EVM chain. The bridge allows tokens to be transferred between these two blockchain environments. The provided test files utilize the Chain class to perform various actions related to token bridging.

## Installation

### Using NPM

```bash
npm install @infinityswapofficial/evm-client
```

### Using Yarn

```bash
yarn add @infinityswapofficial/evm-client
```

## Usage

```js
    import { Chain } from "@infinityswapofficial/evm-client";
    const bridge = new Chain({
        minterCanister,
        Ic,
        signer,
        provider,
        rpcUrl, // eg https://testnet.bitfinity.network 
        icHost, // Your icHost url
    });
```

Find test files at `src/tests`

### Add Operation Points

```js
    const operationReceipt = await bridge.add_operation_points();
```


### Get Bitfinity Bridge Contract Address
Call the `get_bft_bridge_contract` on the `Chain` class to get bft bridge contract address

```js
    const bftBridgeContractAddress = await bridge.get_bft_bridge_contract();


```

### Deploy a BFT Wrapped Token
In other to bridge, you must have a wrapped version of your token on bft. If the wrapped token already exists, the function will return the wrapped token and not create another. The function takes `3` parameters. The first being the `name` of the token, the second the `symbol` of the token and the last is the token in `Id256`. Example below.

```js
    import { Chain } from "@infinityswapofficial/evm-client";
    const ercToken = await bridge.deploy_bft_wrapped_token(
        "Token",
        "TKN",
        tokenInId256,
      );


```

### Get Id256 of Token
For `ICRC` Token

example
```js
import {Id256Factory} from "@infinityswapofficial/evm-client";
tokenInId256 = Id256Factory.fromPrincipal(Principal_of_token)
```

For `EVM` Token

example
```js
import {Id256Factory} from "@infinityswapofficial/evm-client";
const chain_id = 355113
tokenInId256 = Id256Factory.fromAddress(new AddressWithChainID(erc20TokenAddress, chain_id))
```

### Burning icrc Tokens
Burns a specified amount of ICRC tokens to initiate the creation of an ERC20 mint order. Operation_id is a unique number to add to your burn. This can be used to retrieve a burn or initialize one in case something goes wrong. You can generate one using `bridge.generateOperationId()` or use your own format. 

```js
const operation_id = bridge.generateOperationId();
const signedMintOrder = await bridge.burn_icrc2_tokens(TOKEN_PRINCIPAL,amount, operation_id);
```

### Mint ERC20 Token
Mints ERC20 tokens on the EVM chain using a previously generated mint order.

```js
const signedMintOrder = await bridge.mintOrder(signedMintOrder);
```

### Get all cached Transations
Retrieves cached transactions, including mint transactions.

```js
const cachedMintTx = await bridge.getCacheTx(); // get burnt transaction hash
const cachedMintTx = await bridge.getCacheTx("evm_client_mint"); // get mint results
const cachedMintTx = await bridge.getCacheTx("evm_client_mint_order"); // get mint order

```

### Burn ERC20 Token
Burn erc20 tokens

```js
const burnTxHash = await bridge.burn_erc_20_tokens(ercToken, 1000000, 0);

```

### Get Operation id from burnt transaction hash
Burn erc20 tokens

```js
const operation_id = await bridge.get_operation_id(Principal.fromText(canisterIds.evm.local),burnTxHash!);

```

### Minting ICRC Tokens after burning erc20 tokens

```js
const mintResult = await bridge.mint_icrc_tokens(operation_id,Principal.fromText(canisterIds.token.local));

```

### Get base token principal from wrapped erc20 token address

```js
const baseTokenPrincipal = await bridge.get_base_token(ercToken.getAddress());

```