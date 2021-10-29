"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnexConvertor = void 0;
const stringcase_1 = require("stringcase");
class KnexConvertor {
    constructor(dump = false) {
        this.DUMP = false;
        this.logger = console;
        this.DUMP = dump;
    }
    snakeWrapper(value, origImpl, queryContext) {
        if (this.DUMP)
            this.logger.log("snake wrapper:", value, origImpl, queryContext);
        return origImpl(stringcase_1.snakecase(value));
    }
    isRaw(value, queryContext, path) {
        if (typeof value !== "object" || value === null)
            return true;
        if (value instanceof Date)
            return true;
        return false;
        //if (path === "root") return false;
        //if (typeof recursive !== "function") return true;
        //return !recursive(value, path, queryContext);
    }
    postConverter(value, queryContext, path) {
        if (this.isRaw(value, queryContext, path))
            return value;
        if (this.DUMP)
            this.logger.log("Query POST Converter:", value);
        if (Array.isArray(value)) {
            return value.map((item) => this.postConverter(item, queryContext));
        }
        if (value._parsers && value._types) {
            const output = {};
            Object.assign(output, value);
            output.rows = this.postConverter(value.rows, queryContext);
            return output;
        }
        const output = {};
        path || (path = "");
        for (const key of Object.keys(value)) {
            const newKey = stringcase_1.camelcase(key);
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
exports.KnexConvertor = KnexConvertor;
exports.default = KnexConvertor;
//# sourceMappingURL=knexConvertors.js.map