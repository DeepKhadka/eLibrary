import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Pressable,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { Thumbnail } from "native-base";

import fire from "../Firebase";
import "firebase/firestore";

import * as ImagePicker from "expo-image-picker";
import PP from "./profileplaceholder";
import FloatingTextError from "./FloatingTextError";

export default class Signup extends Component {
  state = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    errorMessage: "",
    errorUsername: 0,
    avatar: null,
  };

  handlefirebasesignup = () => {
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        errorMessage: "Passwords do not match!",
      });
    } else if (
      this.state.email == "" ||
      this.state.username == "" ||
      this.state.password == "" ||
      this.state.username == ""
    ) {
      this.setState({
        errorMessage: "Please fill in all the fields!",
      });
    } else if (this.state.username.length < 7) {
      this.setState({
        errorMessage: "Username should be at least 7 characters long!",
      });
    } else {
      fire
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          fire
            .firestore()
            .collection("USERS")
            .doc(fire.auth().currentUser.uid.toString())
            .set({
              email: this.state.email,
              username: this.state.username,
              profileUri: this.state.avatar,
            });
        })
        .then(() => {
          fire.auth().currentUser.sendEmailVerification();
        })
        .then(() => {
          fire
            .auth()
            .currentUser.updateProfile({
              displayName: this.state.username,
            })
            .then(() => {
              Alert.alert("User name successfully updated!");
            })
            .catch((err) => {
              Alert.alert(err.toString());
            });
        })
        .catch((err) => {
          Alert.alert(err.toString());
        });
    }
  };

  pickImagehandler = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }
    this.setState({
      avatar: pickerResult.uri,
    });
  };

  handleSignUp = () => {
    fire
      .firestore()
      .collection("USERS")
      .where("username", "==", this.state.username)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return this.handlefirebasesignup();
        } else {
          return this.setState({
            errorMessage: "Username already taken!",
          });
        }
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
        enabled={true}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
          enabled={true}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,

                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={this.pickImagehandler}>
                <Thumbnail
                  style={{ borderWidth: 1, borderColor: "white" }}
                  large
                  source={{
                    uri: this.state.avatar ? this.state.avatar : PP,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 6,
              }}
            >
              <View style={{ height: 10 }}></View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",

                  alignItems: "center",
                }}
              >
                <View style={{ width: "80%" }}>
                  <Text style={{ color: "red", fontSize: 15 }}>
                    {this.state.errorMessage}
                  </Text>
                </View>
              </View>
              <View style={{ height: 10 }}></View>
              <View
                style={{
                  flex: 10,

                  alignItems: "center",
                }}
              >
                <FloatingTextError
                  label="Email"
                  placeholderTextColor="gray"
                  keyboardType="email-address"
                  onChangeText={(val) => {
                    this.setState({ email: val });
                  }}
                  autoCapitalize="none"
                  test={this.state.email}
                ></FloatingTextError>
                <View style={{ height: 40 }}></View>
                <FloatingTextError
                  label="Username"
                  placeholderTextColor="gray"
                  onChangeText={(val) => {
                    this.setState({ username: val });
                  }}
                  autoCapitalize="none"
                  test={this.state.username}
                ></FloatingTextError>
                <View style={{ height: 40 }}></View>
                <FloatingTextError
                  label="Password"
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  onChangeText={(val) => {
                    this.setState({ password: val });
                  }}
                  autoCapitalize="none"
                  test={this.state.password}
                ></FloatingTextError>
                <View style={{ height: 40 }}></View>
                <FloatingTextError
                  label="Confirm Password"
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  onChangeText={(val) => {
                    this.setState({ confirmPassword: val });
                  }}
                  autoCapitalize="none"
                  test={this.state.confirmPassword}
                ></FloatingTextError>
                <View style={{ height: 40 }}></View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#BB86FC",
                    borderRadius: 5,
                    height: "8%",
                    width: "80%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: "7%",
                  }}
                  onPress={this.handleSignUp}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    SIGN UP
                  </Text>
                </TouchableOpacity>
                <View style={{ height: 40 }}></View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
