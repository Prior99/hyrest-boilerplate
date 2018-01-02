import * as React from "react";
import { View, Text, AppRegistry } from "react-native";

export default class AndroidApp extends React.Component { // tslint:disable-line
    public render() {
        return (
            <View>
                <Text>AndroidApp hello world.</Text>
            </View>
        );
    }
}

AppRegistry.registerComponent("main", () => AndroidApp);
