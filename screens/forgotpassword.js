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
} from "react-native";
import fire from "../Firebase";

export default class ForgotPassword extends Component {
  state = {
    email: "",
    message: "",
  };

  handleReset = () => {
    fire
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({ message: "Password reset email sent successfully." });
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ marginLeft: "10%" }}>
          <Text style={{ fontWeight: "bold", marginTop: "8%" ,color:"white"}}>
            Please enter the email address associated with your account
          </Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "#ffffff",
              borderWidth: 2,
              borderRadius: 5,
              marginRight: 100,
              marginVertical: "5%",
              padding: "2%",
              backgroundColor:"#272727",
              color:"white"
            }}
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={(val) => {
              this.setState({ email: val });
            }}
          ></TextInput>
          <Text style={{ marginVertical: "1%", fontSize: 15, color: "yellow" }}>
            {this.state.message}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#BB86FC",
              borderRadius: 5,
              height: "15%",
              width: "40%",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: "7%",

            }}
            onPress={this.handleReset}
          >
            <Text style={{ fontSize: 17, fontWeight: "700" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  1;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
