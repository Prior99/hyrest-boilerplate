import { controller, route, is, body, ok, noauth, dump, populate } from "hyrest";
import { inject, component } from "tsdi";
import { Connection } from "typeorm";
import { compareDesc } from "date-fns";

import { User, FeedItem, FeedEvent } from "../models";
import { world } from "../scopes";
import { Context } from "../context";

const feedLimit = 50;

@controller @component
export class Feed {
    @inject private db: Connection;

    @route("GET", "/feed").dump(FeedItem, world) @noauth
    public async getFeed() {
        const users = await this.db.getRepository(User).createQueryBuilder("user")
            .orderBy("created", "DESC")
            .limit(feedLimit)
            .getMany();
        const userJoinEvents = users.map(user => populate(world, FeedItem, {
            date: user.created,
            event: FeedEvent.NEW_USER,
            user,
        }));
        const events = [...userJoinEvents]
            .sort((a, b) => compareDesc(a.date, b.date))
            .filter((_, index) => index < feedLimit);
        return ok(events);
    }
}
