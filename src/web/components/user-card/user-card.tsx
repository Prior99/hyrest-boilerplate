import * as React from "react";
import { Card, Button, Form, Image } from "semantic-ui-react";
import { inject, external } from "tsdi";
import { observer } from "mobx-react";
import { computed, action, observable } from "mobx";
import { bind } from "bind-decorator";
import { History } from "history";

import { User } from "../../../common";
import { routeUser, OwnUserStore, UsersStore } from "../../../common-ui";

export interface UserCardProps {
    readonly user: User;
}

@external @observer
export class UserCard extends React.Component<UserCardProps> {
    @inject private ownUser: OwnUserStore;
    @inject private browserHistory: History;
    @inject private users: UsersStore;

    @observable private createGameVisible = false;
    @observable private size: number;

    @computed private get followedByCurrentUser() {
        return Boolean(this.ownUser.followershipByFollowingId(this.props.user.id));
    }

    @computed private get followsCurrentUser() {
        return Boolean(this.ownUser.followershipByFollowerId(this.props.user.id));
    }

    @computed private get createGameValid() {
        return Boolean(this.size);
    }

    @computed private get avatar() { return this.users.avatarById(this.props.user.id); }

    @bind @action private async unfollow() { await this.ownUser.removeFollowing(this.props.user.id); }
    @bind @action private async follow() { await this.ownUser.addFollowing(this.props.user.id); }

    @bind
    private toUser() {
        this.browserHistory.push(routeUser.path(this.props.user.id));
    }

    public render() {
        const { followedByCurrentUser, followsCurrentUser, avatar } = this;
        const { name, rating } = this.props.user;
        return (
            <Card>
                <Card.Content>
                    <Image floated="right" size="mini" src={avatar} />
                    <Card.Header><a onClick={this.toUser}>{name}</a></Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <Button.Group fluid>
                        {
                            this.followedByCurrentUser ? (
                                <Button color="red" icon="remove" onClick={this.unfollow} content="Unfollow" />
                            ) : (
                                <Button color="green" icon="add" onClick={this.follow} content="Follow" />
                            )
                        }
                    </Button.Group>
                </Card.Content>
            </Card>
        );
    }
}
