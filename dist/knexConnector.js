"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnexConnector = void 0;
const knex_1 = require("knex");
const knexConvertors_1 = __importDefault(require("./knexConvertors"));
class KnexConnector {
    constructor(config, options) {
        this.DEBUG = false;
        this.config = config;
        if (options) {
            this.injectOptions(options);
        }
        const dump = (options === null || options === void 0 ? void 0 : options.dump) || false;
        this.convertor = new knexConvertors_1.default(dump);
        this.setDefault();
    }
    injectOptions(options) {
        if (options.debug) {
            this.DEBUG = true;
            this.config.debug = true;
        }
    }
    setDefault() {
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
    connection() {
        if (!this._connection) {
            this._connection = this.openConnection();
        }
        return this._connection;
    }
    openConnection() {
        const connection = knex_1.knex(this.config);
        return connection;
    }
}
exports.KnexConnector = KnexConnector;
exports.default = KnexConnector;
//# sourceMappingURL=knexConnector.js.map