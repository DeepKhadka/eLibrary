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
} from "react-native";

import fire from "../Firebase";
import "firebase/firestore";

export default class Signup extends Component {
  state = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    errorMessage: "",
    errorUsername: 0,
  };

  handlefirebasesignup = () => {
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        errorMessage: "Password do not match!",
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
    } else if (this.state.username.length != 7) {
      this.setState({
        errorMessage: "Username should be exactly 7 characters long!",
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
      <SafeAreaView style={styles.container}>
        <View style={{ marginLeft: "10%" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 25,
              marginTop: "15%",
              marginBottom: "5%",
              color: "white",
            }}
          >
            Create an Account
          </Text>
          <Text style={{ marginVertical: 10, color: "red", fontSize: 15 }}>
            {this.state.errorMessage}
          </Text>
          <View>
            <Text style={{ fontWeight: "bold", color: "white" }}>
              Email Address
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 5,
                marginRight: 100,
                marginVertical: "2%",
                padding: "2%",
                backgroundColor: "#272727",
                color: "white",
              }}
              placeholder="Email"
              placeholderTextColor="gray"
              onChangeText={(val) => {
                this.setState({ email: val });
              }}
              autoCapitalize="none"
            ></TextInput>
          </View>
          <View style={{ marginVertical: "5%" }}>
            <Text style={{ fontWeight: "bold", color: "white" }}>Username</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 5,
                marginRight: 100,
                marginVertical: "2%",
                padding: "2%",
                backgroundColor: "#272727",
                color: "white",
              }}
              placeholder="Username"
              onChangeText={(val) => {
                this.setState({ username: val.toLowerCase() });
              }}
              maxLength={7}
              placeholderTextColor="gray"
              autoCapitalize="none"
            ></TextInput>
          </View>
          <View style={{ marginVertical: "5%" }}>
            <Text style={{ fontWeight: "bold", color: "white" }}>Password</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 5,
                marginRight: 100,
                marginVertical: "2%",
                padding: "2%",
                backgroundColor: "#272727",
                color: "white",
              }}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(val) => {
                this.setState({ password: val });
              }}
            ></TextInput>
          </View>
          <View style={{ marginVertical: "5%" }}>
            <Text style={{ fontWeight: "bold", color: "white" }}>
              Confirm Password
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 5,
                marginRight: 100,
                marginVertical: "2%",
                padding: "2%",
                backgroundColor: "#272727",
                color: "white",
              }}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="gray"
              onChangeText={(val) => {
                this.setState({ confirmPassword: val });
              }}
            ></TextInput>
          </View>
          <View style={{ marginLeft: "15%" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 5,
                height: "23%",
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: "7%",
              }}
              onPress={this.handleSignUp}
            >
              <Text style={{ fontSize: 20 }}>SignUp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
