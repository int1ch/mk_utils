export declare class KnexConvertor {
    protected DUMP: boolean;
    protected logger: Console;
    constructor(dump?: boolean);
    snakeWrapper(value: string, origImpl: (value: string) => string, queryContext: any): string;
    protected isRaw(value: any, queryContext: any, path?: string): boolean;
    postConverter(value: any, queryContext: any, path?: string): any;
}
export default KnexConvertor;
