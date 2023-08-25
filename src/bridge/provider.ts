import { Provider } from "ethers";
import { REPLICATED_QUERY_LENGTH } from "../constants";
import { QueryFunction } from "./Interfaces";

class WrappedProvider {
  public provider: Provider;
  constructor(provider: Provider) {
    this.provider = new Proxy<Provider>(provider, this.createHandler());
  }

  private createHandler() {
    return {
      get: (target: Provider, prop: string, receiver: unknown) => {
        const value = Reflect.get(target, prop, receiver);
        if (
          typeof value == "function" &&
          this.isQueryMethod(prop) &&
          prop !== "getBlockNumber"
        ) {
          return async (...args: unknown[]): Promise<unknown> => {
            let funcArgs: unknown[] = args;
            if (!args.length) {
              // get latest block number and add to arguments
              const latestBlockNumber: number = await target.getBlockNumber();
              funcArgs = [latestBlockNumber];
            }
            // call query 4times
            const replicatedQueries = Array.from(
              { length: REPLICATED_QUERY_LENGTH },
              async () =>
                (value as QueryFunction<unknown[], unknown>).apply(
                  target,
                  funcArgs,
                ) as Promise<unknown>,
            );
            const promises = await Promise.all(replicatedQueries);

            // check if all the results of the queries are the same
            const areAllEqual: boolean = promises.every(
              (val, _, arr) =>
                this.stringifyData(val) === this.stringifyData(arr[0]),
            );
            if (areAllEqual) return promises[0];
            // throw error if the queries are not the same
            throw new Error("query nodes do not match");
          };
        }
        return typeof value == "function" ? value.bind(target) : value;
      },
    };
  }
  isQueryMethod(methodName: string): boolean {
    return methodName.includes("get");
  }

  stringifyData<T>(data: T): string {
    return JSON.stringify(data, (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value as unknown;
    });
  }
}

export { WrappedProvider };
