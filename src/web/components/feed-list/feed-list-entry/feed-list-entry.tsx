import * as React from "react";
import { observer } from "mobx-react";

import { FeedItem, FeedEvent } from "../../../../common";
import { FeedListEntryNewUser } from "./new-user";

export interface FeedListEntryProps {
    readonly item: FeedItem;
}

@observer
export class FeedListEntry extends React.Component<FeedListEntryProps> {
    public render() {
        const { item } = this.props;
        switch (item.event) {
            case FeedEvent.NEW_USER: return <FeedListEntryNewUser item={item} />;
            default: return null;
        }
    }
}
