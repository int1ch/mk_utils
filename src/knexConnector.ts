import { knex, Knex } from "knex";
import KnexConvertor from "./knexConvertors";

interface KnexConnectorOptions {
  debug: boolean;
  dump: boolean;
}

export class KnexConnector {
  protected config: Knex.Config;
  protected DEBUG = false;
  protected _connection: Knex | undefined;
  protected convertor: KnexConvertor;

  constructor(config: Knex.Config, options?: KnexConnectorOptions) {
    this.config = config;
    if (options) {
      this.injectOptions(options);
    }
    const dump = options?.dump || false;
    this.convertor = new KnexConvertor(dump);
    this.setDefault();
  }
  protected injectOptions(options: KnexConnectorOptions) {
    if (options.debug) {
      this.DEBUG = true;
      this.config.debug = true;
    }
  }
  protected setDefault() {
    if (!this.config.pool) {
      this.config.pool = {
        min: 2,
        max: 2,
      };
    }
    if (this.config.client === "pg") {
      this.config.wrapIdentifier = this.convertor.snakeWrapper;
      this.config.postProcessResponse = this.convertor.postConverter; //FIXME
    }
  }

  public connection(): Knex {
    if (!this._connection) {
      this._connection = this.openConnection();
    }
    return this._connection;
  }
  public openConnection(): Knex {
    const connection = knex(this.config);
    return connection;
  }
}

export default KnexConnector;
