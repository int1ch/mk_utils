import { snakecase, camelcase } from "stringcase";

export class KnexConvertor {
  protected DUMP = false;
  protected logger = console;
  constructor(dump = false){
    this.DUMP = dump;

  }
  public snakeWrapper(
    value: string,
    origImpl: (value: string) => string,
    queryContext: any
  ): string {
    if (this.DUMP) this.logger.log("snake wrapper:", value, origImpl, queryContext);
  
    return origImpl(snakecase(value));
  }
  protected isRaw(value: any, queryContext: any, path?: string) {
    if (typeof value !== "object" || value === null) return true;
    if (value instanceof Date) return true;
    return false;
  
    //if (path === "root") return false;
    //if (typeof recursive !== "function") return true;
    //return !recursive(value, path, queryContext);
  }
  public postConverter(value: any, queryContext: any, path?: string): any {
    if (this.isRaw(value, queryContext, path)) return value;
    if (this.DUMP) this.logger.log("Query POST Converter:", value);
    if (Array.isArray(value)) {
      return value.map((item) => this.postConverter(item, queryContext));
    }
    if (value._parsers && value._types) {
      const output: any = {};
      Object.assign(output, value);
      output.rows = this.postConverter(value.rows, queryContext);
      return output;
    }
  
    const output: any = {};
    path ||= "";
    for (const key of Object.keys(value)) {
      const newKey = camelcase(key);
      output[newKey] = value[key];
      /*postConverter(
        value[key],
        queryContext,
        (path += "." + key)
      );*/
    }
  
    return output;
  }
}

export default KnexConvertor;






