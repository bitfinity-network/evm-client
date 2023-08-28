import {
  Actor,
  ActorSubclass,
  Identity,
  ActorMethod,
  HttpAgent,
} from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";

import {
  idlFactory as MinterIDL,
  _SERVICE as MinterService,
} from "./idl/minter/minter.did";

import {
  idlFactory as IcrcIDL,
  _SERVICE as IcrcService,
} from "./idl/icrc/icrc.did";

import {
  idlFactory as SpenderIDL,
  _SERVICE as SpenderService,
} from "./idl/spender/spender.did";

const IC_HOST = "http://127.0.0.1:4943/";
const IC_ENVIRON = "local";

export const icNetwork = {
  icHost: IC_HOST,
  icEnviron: IC_ENVIRON,
};

interface IcConnectorOptions {
  host?: string;
  identity?: Identity | undefined;
  environ?: string;
}

interface CreateActor {
  host?: string;
  canisterId: string;
  interfaceFactory: IDL.InterfaceFactory;
}
export class IcConnector {
  private host: string;
  private identity?: Identity | undefined;
  private agent: HttpAgent;
  private environ: string;

  constructor(options: IcConnectorOptions | undefined = {}) {
    this.host = options.host || icNetwork.icHost;
    this.identity = options.identity ?? undefined;
    this.agent = this.initAgent();
    this.environ = options.environ || icNetwork?.icEnviron;
  }

  initAgent() {
    const agent = new HttpAgent({
      host: this.host,
      identity: this.identity,
    });

    if (icNetwork.icEnviron === "local") {
      agent.fetchRootKey();
    }
    return agent;
  }

  getAgent(): HttpAgent {
    return this.agent;
  }

  getPrincipal(): Principal | undefined {
    return this.identity?.getPrincipal();
  }

  actor<T = Record<string, ActorMethod>>(
    cid: string | Principal,
    idl: IDL.InterfaceFactory,
  ): ActorSubclass<T> {
    return Actor.createActor(idl, {
      agent: this.agent,
      canisterId: cid,
    });
  }
  createActor?: <T = Record<string, ActorMethod>>(
    args: CreateActor,
  ) => ActorSubclass<T>;
}

export { MinterIDL, IcrcIDL, SpenderIDL };
export type { MinterService, IcrcService, SpenderService };
