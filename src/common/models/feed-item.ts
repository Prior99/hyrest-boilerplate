import { is, DataType, scope, specify } from "hyrest";
import { computed } from "mobx";

import { world } from "../scopes";
import { User } from ".";

export enum FeedEvent {
    NEW_USER = "new_user",
}

export class FeedItem {
    @scope(world) @specify(() => Date)
    public date?: Date;

    @scope(world)
    public event?: FeedEvent;

    @scope(world)
    public user?: User;
}
