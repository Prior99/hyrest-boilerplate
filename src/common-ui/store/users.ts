import { observable, computed, action } from "mobx";
import { bind, memoize } from "decko";
import { History } from "history";
import { component, inject } from "tsdi";

import { User, Users } from "../../common";

import { LoginStore, OwnUserStore } from ".";

@component
export class UsersStore {
    @inject private usersController: Users;

    @observable private users: Map<string, User> = new Map();
    @observable private avatars: Map<string, string> = new Map();
    @observable public loading = false;

    @bind @action
    public async searchUsers(search: string) {
        this.loading = true;
        const users = await this.usersController.findUsers(search);
        users.forEach(user => {
            this.users.set(user.id, user);
        });
        this.loading = false;
        return users;
    }

    @computed
    public get all(): User[] {
        return Array.from(this.users.values());
    }

    @bind @action @memoize
    public async load(id: string) {
        const existing = this.users.get(id);
        if (existing) {
            return existing;
        }
        const user = await this.usersController.getUser(id);
        this.users.set(user.id, user);
        return user;
    }

    @bind
    public byId(id: string) {
        const user = this.users.get(id);
        if (!user) { this.load(id); }
        return user;
    }
}
