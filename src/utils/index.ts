import { Principal } from "@dfinity/principal";


export const convertAddressToId256 = (
    address: string | undefined,
    chainId?: number | string
  ) => {
    if (address) {
      const buf = Buffer.alloc(32); // Create a buffer with 32 bytes
  
      // Set the first byte to EVM_ADDRESS_MARK (0x01 in this example)
      buf[0] = 0x01;
  
      // Convert the chainId to big-endian and add it to the buffer
      const chainIdBuf = Buffer.alloc(4);
      chainIdBuf.writeUInt32BE(Number(chainId) || 0);
      chainIdBuf.copy(buf, 1, 0, 4);
  
      // Convert the address to bytes and add it to the buffer
      const addressBuf = Buffer.from(address.replace("0x", ""), "hex");
      addressBuf.copy(buf, 5);
  
      return buf;
    }
};

export const convertPrincipalToId256 = (principal: Principal) => {
    const buf = Buffer.alloc(32);
    buf[0] = 0;
  
    const principalData = principal.toUint8Array();
    buf[1] = principalData.length;
    const prinBuffer = Buffer.from(principalData);
    buf.set(prinBuffer, 2);
    return buf;
};

export const isZeroAddress = (addressToCheck: "0x${string}") => {
    const zeroAddress = "0x" + "0".repeat(40);
    return addressToCheck.toLowerCase() === zeroAddress;
};