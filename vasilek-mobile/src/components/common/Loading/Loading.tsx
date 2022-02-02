import React, {FC} from "react";
import {Text} from "react-native";
import {ActivityIndicator} from "@ant-design/react-native";

export const Loading: FC = () => {
    return(
        <ActivityIndicator
            animating={true}
            toast
            size="large"
            text="Loading..."
        />
    );
};