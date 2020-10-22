import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";

import {
  Container,
  Header,
  Content,
  Spinner,
  ProgressBar,
  Card,
  CardItem,
  Body,
  Item,
  Input,
  Icon,
  Button,
} from "native-base";
import { color } from "react-native-reanimated";

export default class LoginSignup extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 50,
            fontStyle: "italic",
            color: "white",
            paddingVertical: 100,
          }}
        >
          eLibrary
        </Text>

        <View
          style={{
            height: "10%",
            marginVertical: "15%",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#BB86FC",
              borderRadius: 5,
              height: "100%",
              width: 225,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: "10%", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#BB86FC",
              borderRadius: 5,
              height: "100%",
              width: 225,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Signup");
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>SIGNUP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
  },
});
