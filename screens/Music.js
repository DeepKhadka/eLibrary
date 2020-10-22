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
  ScrollView,
  Switch,
} from "react-native";

import fire from "../Firebase";
import "firebase/firestore";

export default class Music extends Component {
  state = {
    title: "",
    artist: "",
    year: 0,
    description: "",
    public: false,
    errorMessage: "",
  };

  handleAdd = () => {
    if (this.state.title == "" || this.state.artist == "") {
      Alert.alert("Please fill in all the required (*) fields.");
    } else {
      fire
        .firestore()
        .collection("USERS")
        .doc(fire.auth().currentUser.uid.toString())
        .collection("Music")
        .doc()
        .set({
          title: this.state.title,

          artist: this.state.artist,
          year: this.state.year,

          description: this.state.description,
          public: this.state.public,
        })
        .then(() => {
          Alert.alert("Music successfully added!");
          this.props.navigation.navigate("Home");
        })
        .catch((err) => {
          Alert.alert(err.toString());
        });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={{ marginLeft: "10%" }}>
            <Text style={{ marginVertical: 10, color: "yellow", fontSize: 15 }}>
              {this.state.errorMessage}
            </Text>
            <View>
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 15 }}
              >
                Title *
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
                placeholder="Title"
                placeholderTextColor="gray"
                onChangeText={(val) => {
                  this.setState({
                    title: val.toLowerCase().trim(),
                  });
                }}
              ></TextInput>
            </View>
            <View style={{ marginVertical: "5%" }}>
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 15 }}
              >
                Artist *
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
                placeholder="Artist"
                placeholderTextColor="gray"
                onChangeText={(val) => {
                  this.setState({
                    artist: val.toLowerCase().trim(),
                  });
                }}
              ></TextInput>
            </View>

            <View style={{ marginVertical: "5%" }}>
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 15 }}
              >
                Year Released
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
                placeholder="Year"
                placeholderTextColor="gray"
                maxLength={4}
                keyboardType="number-pad"
                onChangeText={(val) => {
                  this.setState({
                    year: val,
                  });
                }}
              ></TextInput>
            </View>

            <View style={{ marginVertical: "5%" }}>
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 15 }}
              >
                Description
              </Text>
              <TextInput
                style={{
                  height: 150,
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 5,
                  marginRight: 100,
                  marginVertical: "2%",
                  padding: "2%",
                  backgroundColor: "#272727",
                  color: "white",
                }}
                placeholder="Description"
                placeholderTextColor="gray"
                multiline={true}
                onChangeText={(val) => {
                  this.setState({
                    description: val.trim(),
                  });
                }}
              ></TextInput>
              <View
                style={{
                  marginTop: "5%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "white",
                    fontSize: 15,
                  }}
                >
                  Make Item Public
                </Text>
                <Switch
                  style={{ marginLeft: "10%" }}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.public ? "#f5dd4b" : "#f4f3f4"}
                  onValueChange={() => {
                    this.setState({
                      public: !this.state.public,
                    });
                  }}
                  value={this.state.public}
                />
              </View>
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
                  marginVertical: "5%",
                }}
                onPress={this.handleAdd}
              >
                <Text style={{ fontSize: 20 }}>ADD</Text>
              </TouchableOpacity>
              <View style={{ marginVertical: "5%" }}></View>
            </View>
          </View>
        </ScrollView>
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
