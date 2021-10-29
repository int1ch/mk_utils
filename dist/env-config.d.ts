/// <reference types="node" />
export declare enum EnvironmentType {
    Production = "production",
    Testing = "testing",
    Development = "development"
}
interface Options {
    debug?: boolean;
}
export declare function fromPath(configPath?: string, options?: Options): import("env-var").IEnv<import("env-var").IOptionalVariable<import("env-var").Extensions> & import("env-var").ExtenderTypeOptional<import("env-var").Extensions>, NodeJS.ProcessEnv>;
export {};
