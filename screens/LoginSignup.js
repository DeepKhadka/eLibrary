import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
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
      <SafeAreaView style={{ flex: 1 }} >
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "black",
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Image source={require("../assets/logo.png")} />
          </View>
          <View
            style={{
              flex: 2,
              backgroundColor: "black",
              alignItems: "center",
            }}
          >
            <View style={{ height: "20%" }}></View>
            <TouchableOpacity
              style={{
                width: "90%",
                height: "15%",
                backgroundColor: "#BB86FC",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>LOGIN</Text>
            </TouchableOpacity>
            <View style={{ height: "10%" }}></View>
            <TouchableOpacity
              style={{
                width: "90%",
                height: "15%",
                backgroundColor: "#BB86FC",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => {
                navigation.navigate("Signup");
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});

// backgroundColor: "#BB86FC",
