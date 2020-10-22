// Loading.js
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{ fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
