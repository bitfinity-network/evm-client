
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
    const bridge = new Chain(MINTER_CANISTER, Ic, signer, provider);
```

Find test files at `src/tests`

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