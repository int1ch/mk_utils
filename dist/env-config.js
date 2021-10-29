"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPath = exports.EnvironmentType = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("yaml"));
const env_var_1 = require("env-var");
const dotenv = __importStar(require("dotenv"));
//import logger from "./logger";
const logger = console;
const DEBUG = false;
var EnvironmentType;
(function (EnvironmentType) {
    EnvironmentType["Production"] = "production";
    EnvironmentType["Testing"] = "testing";
    EnvironmentType["Development"] = "development";
})(EnvironmentType = exports.EnvironmentType || (exports.EnvironmentType = {}));
function parseEnvName(value) {
    if (value) {
        const lcv = value.toLowerCase();
        if (lcv === "production" || lcv === "prod") {
            return EnvironmentType.Production;
        }
        if (lcv === "testing" || lcv === "test") {
            return EnvironmentType.Testing;
        }
        if (lcv === "development" || lcv === "dev") {
            return EnvironmentType.Development;
        }
    }
    return undefined;
}
class ConfigParseError extends Error {
    constructor() {
        super(...arguments);
        this.code = "PARSEF";
    }
}
function dotenvDataParser(data) {
    return dotenv.parse(data);
}
function yamlDataParser(data) {
    const parsed = yaml.parse(data);
    const fileContainer = {};
    let keyCount = 0;
    try {
        for (const key in parsed) {
            const value = String(parsed[key]);
            fileContainer[key] = value;
            keyCount++;
        }
    }
    catch (e) {
        logger.error("Error validatind data", e);
    }
    if (!keyCount) {
        //FIXME
        throw new ConfigParseError("YAML failed to parse");
    }
    return fileContainer;
}
function readAndParse(filePath, fileName, parser, extension, options) {
    const encoding = "utf8";
    const debug = (options ? options.debug : undefined) || DEBUG; //WTF1
    const configFile = fileName + (extension ? "." + extension : "");
    const configPath = path.resolve(filePath, configFile);
    try {
        const data = fs.readFileSync(configPath, { encoding });
        return parser(data);
    }
    catch (e) {
        if (e.code === "ENOENT") {
            if (debug) {
                logger.log(e.message);
            }
        }
        else if (e.code === "PARSEF") {
            logger.error("Parse Erorr", e, "File:", configPath);
        }
        else {
            logger.error(e);
        }
    }
    return null;
}
function readDotEnvFile(filePath, fileName, options) {
    return readAndParse(filePath, fileName, dotenvDataParser, "env", options);
}
function readYamlFile(filePath, fileName, options) {
    return readAndParse(filePath, fileName, yamlDataParser, "yaml", options);
    return null;
}
function fromPath(configPath, options) {
    //WTF options?.debug Dont workF
    const debug = (options ? options.debug : undefined) || DEBUG; //WTF2
    if (!configPath) {
        configPath = path.resolve(process.cwd(), "config");
        if (debug) {
            logger.log("path based on CWD:", configPath);
        }
    }
    else {
        //FIXME
        if (debug) {
            logger.log("search config in:", configPath);
        }
    }
    let envEniromnent = parseEnvName(process.env.ENVIRONMENT) ||
        parseEnvName(process.env.ENV) ||
        parseEnvName(process.env.NODE_ENV);
    if (!envEniromnent) {
        envEniromnent = EnvironmentType.Development;
    }
    //FIXME
    if (debug) {
        logger.log("Selected env:", envEniromnent);
    }
    // start reading containers
    // priority
    // common + env specific + secret + process.env
    //YAML = DOCKER
    const files = ["default", envEniromnent, "secret"];
    const container = {};
    //const container_from: NodeJS.ProcessEnv = {};
    for (const configFile of files) {
        let fileContainer;
        fileContainer = readDotEnvFile(configPath, configFile, options);
        if (!fileContainer) {
            fileContainer = readYamlFile(configPath, configFile, options);
        }
        if (fileContainer) {
            for (const key in fileContainer) {
                container[key] = fileContainer[key];
                //container_from[key] = configFile;
            }
        }
    }
    /*export const securedEnv: NodeJS.ProcessEnv = {};
      for( let [name, value] of container){
          if name.match(`_SECRET$`){
  
          } else {
              securedEnv[name] = value;
          }
      }*/
    for (const key in process.env) {
        container[key] = process.env[key];
    }
    container["ENVIRONMENT"] = String(envEniromnent);
    return env_var_1.from(container);
}
exports.fromPath = fromPath;
//просто ENV PROXY
//const envConfig = from(process.env);
//export default envConfig;
//# sourceMappingURL=env-config.js.map