import * as React from "react";
import { Card, Image } from "semantic-ui-react";
import { inject, external } from "tsdi";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";
import { bind } from "bind-decorator";
import { History } from "history";

import { User } from "../../../common";
import { routeUser, OwnUserStore, UsersStore, LoginStore } from "../../../common-ui";
import { Infos, InfoName, InfoValue } from "..";
import * as css from "./own-user-card.scss";

@external @observer
export class OwnUserCard extends React.Component {
    @inject private ownUser: OwnUserStore;
    @inject private browserHistory: History;
    @inject private users: UsersStore;
    @inject private login: LoginStore;

    @computed private get avatar() { return this.users.avatarById(this.login.userId); }

    @bind private toUser() { this.browserHistory.push(routeUser.path(this.login.userId)); }

    public render() {
        const { user, followers, following } = this.ownUser;
        if (!user) {
            return null;
        }
        const { name, rating } = user;
        const { avatar } = this;
        return (
            <Card>
                <Image onClick={this.toUser} className={css.avatar} src={avatar} />
                <Card.Content>
                    <Card.Header><a onClick={this.toUser}>{name}</a></Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <div className={css.info}>
                        <Infos>
                            <InfoName>Followers</InfoName>
                            <InfoValue>{followers.size}</InfoValue>
                            <InfoName>Following</InfoName>
                            <InfoValue>{following.size}</InfoValue>
                        </Infos>
                    </div>
                </Card.Content>
            </Card>
        );
    }
}
