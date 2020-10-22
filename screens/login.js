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

export default class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  handleLogin = () => {
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
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
              marginVertical: "10%",
              marginTop: "50%",
              color:"white"
            }}
          >
            LOGIN
          </Text>
          <View>
            <Text style={{ fontWeight: "bold", color:"white" }}>Email Address</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "#ffffff",
                borderWidth: 2,
                borderRadius: 5,
                marginRight: 100,
                marginVertical: "2%",
                padding: "2%",
                backgroundColor:"#272727",
                color:"white"
              }}
              placeholder="Email"
              placeholderTextColor="gray"
              autoCapitalize="none"
              onChangeText={(val) => {
                this.setState({ email: val });
              }}
            ></TextInput>
          </View>
          <View style={{ marginVertical: "5%" }}>
            <Text style={{ fontWeight: "bold",color:"white"  }}>Password</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "#ffffff",
                borderWidth: 2,
                borderRadius: 5,
                marginRight: 100,
                marginVertical: "2%",
                padding: "2%",
                backgroundColor:"#272727",
                color:"white"
              }}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(val) => {
                this.setState({ password: val });
              }}
            ></TextInput>
          </View>
          <View style={{ marginLeft: "15%" }}>
            <Text
              style={{
                fontSize: 15,
                textDecorationLine: "underline",
                color: "lightblue",
                fontWeight: "900",
              }}
              onPress={() => {
                this.props.navigation.navigate("ForgotPassword");
              }}
            >
              Forgot your Password?
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 5,
                height: "23%",
                width: "46%",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: "7%",
              }}
              onPress={this.handleLogin}
            >
              <Text style={{ fontSize: 17, fontWeight: "700" }}>SIGNIN</Text>
            </TouchableOpacity>
          </View>
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
