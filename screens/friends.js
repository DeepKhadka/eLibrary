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
import { Container, Content, Spinner, Thumbnail } from "native-base";
import fire from "../Firebase";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import PP from "./profileplaceholder";

export default class Friends extends Component {
  _isMounted = false;

  state = {
    data: null,
    reffreshing: false,
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  deleteFriend(itemID) {
    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection("CONNECTED")
      .doc(itemID)
      .delete()
      .then(() => {
        fire
          .firestore()
          .collection("USERS")
          .doc(itemID)
          .collection("CONNECTED")
          .doc(fire.auth().currentUser.uid.toString())
          .delete();
      })
      .then(() => {
        this.componentDidMount();
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  }

  async handleFriends() {
    var data = [];

    return await fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection("CONNECTED")
      .get()
      .then(
        function (querySnapshot) {
          var results = [];

          querySnapshot.forEach(function (doc) {
            var docRef = fire
              .firestore()
              .collection("USERS")
              .doc(doc.id)
              .get()
              .then(
                function (snap) {
                  data.push({
                    username: snap.data().username,
                    ID: snap.id,
                    profileUri: snap.data().profileUri,
                  });
                },
                function (error) {
                  Alert.alert(error.toString());
                }
              );
            // push promise from get into results
            results.push(docRef);
          });
          // dbPromise.then() resolves to  a single promise that resolves
          // once all results have resolved
          return Promise.all(results);
        },
        function (val) {
          // The Promise was rejected.
          console.log(val);
        }
      )
      .then(() => {
        this.setState({
          data: data,
          refreshing: false,
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  emptyComponent = () => {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
          Nothing here, come back later...
        </Text>
      </View>
    );
  };

  componentDidMount() {
    this._isMounted = true;
    this.handleFriends();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        {this.state.data ? (
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("Profile", {
                          ID: item.ID,
                        });
                      }}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Thumbnail
                        style={{ borderWidth: 1, borderColor: "white" }}
                        source={{
                          uri: item.profileUri ? item.profileUri : PP,
                        }}
                      />

                      <Text
                        style={{
                          marginLeft: "5%",
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        {item.username}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginRight: "5%",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "darkred",
                        borderRadius: 50,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        this.deleteFriend(item.ID);
                      }}
                    >
                      <FontAwesome name="times" size={25} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, color: "white" }}>
                      Unfriend
                    </Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.ID}
            ListEmptyComponent={this.emptyComponent}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        ) : (
          <Container>
            <Content>
              <Spinner color="green" />
            </Content>
          </Container>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "#272727",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginHorizontal: "2%",
    marginVertical: "2%",
  },
  cardContent: {
    marginHorizontal: "3%",
    paddingVertical: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
