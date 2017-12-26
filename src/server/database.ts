import { component, factory, initialize } from "tsdi";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { info } from "winston";
import * as Yaml from "yamljs";
import { existsSync } from "fs";

import { User, Token, Followership } from "../common";

function envConfig() {
    const result: any = {};
    if (!process || !process.env) {
        return result;
    }
    const {
        DB_DATABASE,
        DB_USER,
        DB_PASSWORD,
        DB_PORT,
        DB_HOST,
        DB_LOGGING,
        DB_DRIVER,
    } = process.env;
    if (DB_DATABASE) { result.database = DB_DATABASE; }
    if (DB_USER) { result.username = DB_USER; }
    if (DB_PASSWORD) { result.password = DB_PASSWORD; }
    if (DB_PORT) { result.port = DB_PORT; }
    if (DB_HOST) { result.host = DB_HOST; }
    if (DB_DRIVER) { result.type = DB_DRIVER; }
    if (DB_LOGGING) { result.logging = DB_LOGGING === "true"; }
    return result;
}

@component
export class Database {
    public conn: Connection;

    public async connect() {
        info("Connecting to database...");
        this.conn = await createConnection({
            synchronize: true,
            entities: [
                User,
                Token,
                Followership,
            ],
            ...(
                existsSync("./database.yml") ? Yaml.load("./database.yml") : {}
            ),
            ...envConfig(),
        });
        info("Connected to database.");
    }

    @factory
    public getConnection(): Connection {
        return this.conn;
    }
}
