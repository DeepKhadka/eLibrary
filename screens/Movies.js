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
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";

import fire from "../Firebase";
import "firebase/firestore";
import FloatingTextBox from "./FloatingScan";
import FloatingTextError from "./FloatingTextError";

export default class Movies extends Component {
  state = {
    title: this.props.route.params.title,
    genre: "",
    year: "",
    description: "",
    public: false,
    errorMessage: "",
    rating: 0,
  };

  handleAdd = () => {
    if (this.state.title == "") {
      this.setState({
        errorMessage: "Please fill in all the required fields.",
      });
    } else if (this.state.rating < 1) {
      this.setState({
        errorMessage: "Rating cannot be less than 1.",
      });
    } else {
      fire
        .firestore()
        .collection("USERS")
        .doc(fire.auth().currentUser.uid.toString())
        .collection("Movies")
        .doc()
        .set({
          title: this.state.title,

          genre: this.state.genre,
          year: Number(this.state.year),

          description: this.state.description,
          public: this.state.public,
          rating: this.state.rating,
        })
        .then(() => {
          ToastAndroid.show("Movie successfully added!", ToastAndroid.SHORT);

          this.props.navigation.navigate("Home");
        })
        .catch((err) => {
          Alert.alert(err.toString());
        });
    }
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
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <View
              style={{ width: "80%", height: 60, justifyContent: "center" }}
            >
              <Text style={{ color: "red", fontSize: 15 }}>
                {this.state.errorMessage}
              </Text>
            </View>
          </View>
          <View style={{ flex: 10, alignItems: "center" }}>
            {this.props.route.params.title == "" ? (
              <FloatingTextError
                label="Title"
                placeholderTextColor="gray"
                onChangeText={(val) => {
                  this.setState({
                    title: val.toLowerCase().trim(),
                  });
                }}
                test={this.state.title}
              ></FloatingTextError>
            ) : (
              <FloatingTextError
                label="Title"
                placeholderTextColor="gray"
                onChangeText={(val) => {
                  this.setState({
                    title: val.toLowerCase().trim(),
                  });
                }}
                defaultValue={this.props.route.params.title}
                test={this.state.title}
              ></FloatingTextError>
            )}

            <View style={{ height: 30 }}></View>
            <FloatingTextBox
              label="Genre"
              test={this.state.genre}
              placeholderTextColor="gray"
              onChangeText={(val) => {
                this.setState({
                  genre: val.toLowerCase().trim(),
                });
              }}
            ></FloatingTextBox>
            <View style={{ height: 30 }}></View>
            <FloatingTextBox
              label="Year Released"
              test={this.state.year}
              placeholderTextColor="gray"
              maxLength={4}
              keyboardType="number-pad"
              onChangeText={(val) => {
                this.setState({
                  year: val,
                });
              }}
            ></FloatingTextBox>

            <View style={{ height: 30 }}></View>
            <FloatingTextBox
              label="Description"
              test={this.state.description}
              placeholderTextColor="gray"
              multiline={true}
              onChangeText={(val) => {
                this.setState({
                  description: val.trim(),
                });
              }}
            ></FloatingTextBox>
            <View style={{ height: 30 }}></View>
            <View style={{ width: "80%", alignItems: "flex-start" }}>
              <Rating
                type="custom"
                ratingBackgroundColor="gray"
                ratingCount={5}
                fractions={1}
                startingValue={0}
                imageSize={30}
                onFinishRating={(rating) => {
                  this.setState({
                    rating: rating,
                  });
                }}
                showRating={true}
                style={{ backgroundColor: "black" }}
              />
            </View>
            <View style={{ height: 30 }}></View>
            <View
              style={{
                width: "80%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  flex: 1,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Make Item Public
              </Text>
              <View style={{ flex: 1 }}>
                <Switch
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
            <View style={{ height: 30 }}></View>
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 5,
                height: "6%",
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: "5%",
              }}
              onPress={this.handleAdd}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>ADD</Text>
            </TouchableOpacity>
            <View style={{ height: 50 }}></View>
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
