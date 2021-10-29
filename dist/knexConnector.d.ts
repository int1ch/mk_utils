import { Knex } from "knex";
import KnexConvertor from "./knexConvertors";
interface KnexConnectorOptions {
    debug: boolean;
    dump: boolean;
}
export declare class KnexConnector {
    protected config: Knex.Config;
    protected DEBUG: boolean;
    protected _connection: Knex | undefined;
    protected convertor: KnexConvertor;
    constructor(config: Knex.Config, options?: KnexConnectorOptions);
    protected injectOptions(options: KnexConnectorOptions): void;
    protected setDefault(): void;
    connection(): Knex;
    openConnection(): Knex;
}
export default KnexConnector;
