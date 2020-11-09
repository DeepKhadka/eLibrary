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
import { Container, Content, Spinner } from "native-base";
import fire from "../Firebase";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default class Requests extends Component {
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

  deleteDocument(itemID) {
    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection("PENDING")
      .doc(itemID)
      .delete()
      .then(() => {
        this.componentDidMount();
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  }

  acceptRequest(itemID) {
    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection("CONNECTED")
      .doc(itemID)
      .set({
        fID: itemID,
      })
      .then(() => {
        this.deleteDocument(itemID);
      })
      .then(() => {
        fire
          .firestore()
          .collection("USERS")
          .doc(itemID)
          .collection("CONNECTED")
          .doc(fire.auth().currentUser.uid.toString())
          .set({
            fID: fire.auth().currentUser.uid.toString(),
          });
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  async handleRequests() {
    var data = [];
    return await fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection("PENDING")
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
                  data.push({ username: snap.data().username, ID: snap.id });
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
    this.handleRequests();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.data ? (
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

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginRight: "5%",
                    }}
                  >
                    <View>
                      <TouchableOpacity
                        style={{
                          marginLeft: "5%",
                          paddingHorizontal: "5%",
                          backgroundColor: "green",
                          borderRadius: 50,
                          alignItems: "center",
                        }}
                        onPress={() => {
                          this.acceptRequest(item.ID);
                        }}
                      >
                        <FontAwesome name="check" size={25} color="white" />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 15 }}>Accept</Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "darkred",
                          borderRadius: 50,
                          alignItems: "center",
                        }}
                        onPress={() => {
                          this.deleteDocument(item.ID);
                        }}
                      >
                        <FontAwesome name="times" size={25} color="white" />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 15 }}>Decline</Text>
                    </View>
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
    borderRadius: 6,
    elevation: 4,
    backgroundColor: "#fff",
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
  },
});
