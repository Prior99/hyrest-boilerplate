import {
    controller,
    route,
    is,
    created,
    body,
    ok,
    param,
    notFound,
    query,
    noauth,
    populate,
    context,
    unauthorized,
    dump,
} from "hyrest";
import { inject, component } from "tsdi";
import { Connection } from "typeorm";
import { startOfDay, compareAsc } from "date-fns";
import * as gravatar from "gravatar-url";

import { User, Token } from "../models";
import { signup, owner, world } from "../scopes";
import { Context } from "../context";

@controller @component
export class Users {
    @inject private db: Connection;

    @route("POST", "/user").dump(User, owner) @noauth
    public async createUser(@body(signup) user: User) {
        await this.db.getRepository(User).save(user);
        return ok(user);
    }

    @route("GET", "/user/:id").dump(User, world) @noauth
    public async getUser(@param("id") @is() id: string) {
        const user = await this.db.getRepository(User).findOneById(id);
        if (!user) { return notFound<User>(`Could not find user with id '${id}'`); }
        return ok(user);
    }

    @route("GET", "/user/:id/owner").dump(User, owner)
    public async getOwnUser(@param("id") @is() id: string, @context ctx?: Context) {
        const user = await this.db.getRepository(User).findOneById(id);
        if (!user) { return notFound<User>(`Could not find user with id '${id}'`); }
        if (user.id !== (await ctx.currentUser()).id) {
            return unauthorized<User>();
        }
        return ok(user);
    }

    @route("GET", "/user/:id/avatar") @noauth
    public async getUserAvatar(@param("id") @is() id: string) {
        const user = await this.db.getRepository(User).findOneById(id);
        if (!user) { return notFound<string>(`Could not find user with id '${id}'`); }
        return ok({
            body: gravatar(user.email, { size: 200, default: "identicon" }),
        });
    }

    @route("GET", "/user").dump(User, world) @noauth
    public async findUsers(@query("search") @is() search: string) {
        const users = await this.db.getRepository(User).createQueryBuilder()
            .where("name LIKE :name", { name: `%${search}%` })
            .limit(100)
            .getMany();
        return ok(users);
    }
}
