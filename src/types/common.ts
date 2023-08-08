import { isAddress, isNullish } from "web3-validator";
import { Principal } from "@dfinity/principal";
import {Buffer} from "buffer";

export type Id256 = Buffer


export class Id256Factory {

  static fromPrincipal(principal: Principal): Id256 {
    const buf = Buffer.alloc(32);
    buf[0] = 0;

    const principalData = principal.toUint8Array();
    buf[1] = principalData.length;
    const prinBuffer = Buffer.from(principalData);
    buf.set(prinBuffer, 2);
    return buf;
  }
  
  static fromAddress(input: AddressWithChainID): Id256 {
    const buf = Buffer.alloc(32); // Create a buffer with 32 bytes
    // Set the first byte to EVM_ADDRESS_MARK (0x01 in this example)
    buf[0] = 0x01;

    // Convert the chainId to big-endian and add it to the buffer
    const chainIdBuf = Buffer.alloc(4);
    chainIdBuf.writeUInt32BE(Number(input.getChainID()));
    chainIdBuf.copy(buf, 1, 0, 4);

    // Convert the address to bytes and add it to the buffer
    const addressBuf = input.addressAsBuffer();
    addressBuf.copy(buf, 5);
    return buf;
  }

  static from(input: AddressWithChainID | Principal): Id256 {
    if (typeof input == typeof AddressWithChainID) {
      return this.fromAddress(input as AddressWithChainID);
    } else {
      return this.fromPrincipal(input as Principal);
    }
  }
}

export class Address {
  private address: string;
  
  public getAddress(): string {
    return this.address;
  }

  public addressAsBuffer(): Id256 {
    return Buffer.from(this.address.replace("0x", ""), "hex");
  }

  public isZero(): boolean {
    return /^0x0+$/.test(this.address);
  }

  constructor(address: string) {
    this.address = address;

    if (isAddress(this.addressAsBuffer())) {
    } else {
      throw Error("Not a valid Address");
    }
  }
}



export class AddressWithChainID  extends Address{
  private chainID: Number;
  
  public getChainID(): Number {
    return this.chainID;
  }

  constructor(address: string, chainID: Number) {
    super(address);
    this.chainID = chainID;

  }
}
