import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";

import fire from "../Firebase";
import "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default class Search extends Component {
  _isMounted = false;

  state = {
    data: null,
    ID: "",
  };

  sendRequest = (ID) => {
    var uid = fire.auth().currentUser.uid.toString();
    fire
      .firestore()
      .collection("USERS")
      .doc(ID)
      .collection("PENDING")
      .doc(uid)
      .set({
        fID: uid,
      })
      .then(() => {
        Alert.alert("Friend request sent.");
        this.props.navigation.goBack();
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    var docID;
    var username;

    fire
      .firestore()
      .collection("USERS")
      .where("username", "==", this.props.route.params.uname)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            docID = doc.id;
            username = doc.data().username;
            const x = { username: username, ID: docID };
            data.push(x);
          });
          this.setState({
            data: data,
            ID: docID,
          });
        }
      })

      .catch((err) => {
        return err.toString();
      });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.data &&
        this.state.ID != fire.auth().currentUser.uid.toString() ? (
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome name="user" size={20} />
                    <Text
                      style={{
                        marginLeft: "5%",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {item.username}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.sendRequest(item.ID);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#BB86FC",
                          borderRadius: 5,
                          borderWidth: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: "3%",
                            color: "black",
                          }}
                        >
                          Send Request
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.ID}
            ListHeaderComponent={() => {
              return (
                <Text
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 10,
                    fontSize: 15,
                  }}
                >
                  Showing search result:
                </Text>
              );
            }}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", fontStyle: "italic" }}
            >
              No User found!
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 4,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginHorizontal: "3%",
    marginVertical: "2%",
  },
  cardContent: {
    marginHorizontal: "3%",
    paddingVertical: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
