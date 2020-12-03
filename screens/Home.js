import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  RefreshControl,
  StatusBar,
} from "react-native";
import fire from "../Firebase";
import "firebase/firestore";
import { FloatingAction } from "react-native-floating-action";
import { Badge } from "native-base";

import {
  Container,
  Header,
  Content,
  Spinner,
  Card,
  CardItem,
  Body,
  Item,
  Input,
  Icon,
} from "native-base";

export default class Home extends Component {
  _isMounted = false;
  state = {
    username: "",
    loading: true,
    game: 0,
    movies: 0,
    music: 0,
    books: 0,
    test: "",
    search: "",
    refreshing: false,
  };

  componentDidMount() {
    this._isMounted = true;
    fire.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.fetchGameInfo(user);
      }
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchGameInfo(user) {
    fire
      .firestore()
      .collection("USERS")
      .doc(user.uid.toString())
      .collection("Games")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              this.setState({
                game: this.state.game + 1,
              });
            }
          });
        }
      })
      .then(this.fetchMoviesInfo(user))
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  fetchMoviesInfo(user) {
    fire
      .firestore()
      .collection("USERS")
      .doc(user.uid.toString())
      .collection("Movies")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              this.setState({
                movies: this.state.movies + 1,
              });
            }
          });
        }
      })
      .then(this.fetchMusicInfo(user))
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }
  fetchMusicInfo(user) {
    fire
      .firestore()
      .collection("USERS")
      .doc(user.uid.toString())
      .collection("Music")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              this.setState({
                music: this.state.music + 1,
              });
            }
          });
        }
      })
      .then(this.fetchBooksInfo(user))
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  fetchBooksInfo(user) {
    fire
      .firestore()
      .collection("USERS")
      .doc(user.uid.toString())
      .collection("Books")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              this.setState({
                books: this.state.books + 1,
                loading: false,
                refreshing: false,
              });
            }
          });
        } else {
          if (this._isMounted) {
            this.setState({
              loading: false,
              refreshing: false,
            });
          }
        }
      })

      .catch((err) => {
        Alert.alert(err.toString());
      });
  }
  onRefresh = () => {
    this.setState({
      username: "",

      game: 0,
      movies: 0,
      music: 0,
      books: 0,
      test: "",
      search: "",
      refreshing: true,
    });
    this.componentDidMount();
  };


  render() {
    const actions = [
      {
        text: "Manual Entry",
        icon: require("../icons/add.png"),
        name: "bt_manual_entry",
        position: 1,
        color: "#BB86FC",
      },
      {
        text: "Barcode Entry",
        icon: require("../icons/barcode.png"),
        name: "bt_barcode_entry",
        position: 2,
        color: "#BB86FC",
      },
    ];
    return this.state.loading ? (
      <Container style={{ backgroundColor: "black" }}>
        <Content>
          <Spinner color="green" />
        </Content>
      </Container>
    ) : (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <Container>
          <Header
            searchBar
            rounded
            autoCorrect={false}
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "#272727",
            }}
          >
            <Icon
              name="menu"
              onPress={() => {
                this.props.navigation.openDrawer();
              }}
              style={{ fontSize: 35, color: "white" }}
            />
            <View style={{ marginHorizontal: "1%" }}></View>
            <Item>
              <Icon name="ios-people" />
              <Input
                placeholder="Search friends by username"
                onChangeText={(val) => {
                  this.setState({
                    search: val,
                  });
                }}
                autoCapitalize="none"
                returnKeyType="search"
                onSubmitEditing={() => {
                  this.props.navigation.navigate("Search", {
                    uname: this.state.search.trim(),
                  });
                }}
              />
              <Icon name="ios-search" onPress={this.allRATEDMusic} />
            </Item>
          </Header>

          {this.state.refreshing ? (
            <Container style={{ backgroundColor: "black" }}>
              <Content>
                <Spinner color="green" />
              </Content>
            </Container>
          ) : (
            <View style={{ backgroundColor: "black", flex: 1 }}>
              <View
                style={{
                  flex: 1,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  Dashboard
                </Text>
              </View>
              <View style={{ flex: 12 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("Library", {
                        dbName: "Games",
                      });
                    }}
                  >
                    <View
                      style={{
                        height: "50%",
                        width: "80%",
                        backgroundColor: "#272727",
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Badge danger>
                        <Text style={{ color: "white", fontSize: 15 }}>
                          {this.state.game}
                        </Text>
                      </Badge>

                      <View></View>
                      <Image
                        source={require("../assets/game.png")}
                        style={{ marginTop: "5%" }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 25,
                          fontWeight: "bold",
                          marginVertical: "5%",
                        }}
                      >
                        Games
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("Library", {
                        dbName: "Movies",
                      });
                    }}
                  >
                    <View
                      style={{
                        height: "50%",
                        width: "80%",
                        backgroundColor: "#272727",
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Badge danger>
                        <Text style={{ color: "white", fontSize: 15 }}>
                          {this.state.movies}
                        </Text>
                      </Badge>
                      <Image
                        source={require("../assets/movies.png")}
                        style={{ marginTop: "5%" }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 25,
                          fontWeight: "bold",
                          marginVertical: "5%",
                        }}
                      >
                        Movies
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,

                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("Library", {
                        dbName: "Music",
                      });
                    }}
                  >
                    <View
                      style={{
                        height: "50%",
                        width: "80%",
                        backgroundColor: "#272727",
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Badge danger>
                        <Text style={{ color: "white", fontSize: 15 }}>
                          {this.state.music}
                        </Text>
                      </Badge>
                      <Image
                        source={require("../assets/music.png")}
                        style={{ marginTop: "5%" }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 25,
                          fontWeight: "bold",
                          marginVertical: "5%",
                        }}
                      >
                        Music
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("Library", {
                        dbName: "Books",
                      });
                    }}
                  >
                    <View
                      style={{
                        height: "50%",
                        width: "80%",
                        backgroundColor: "#272727",
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Badge danger>
                        <Text style={{ color: "white", fontSize: 15 }}>
                          {this.state.books}
                        </Text>
                      </Badge>
                      <Image
                        source={require("../assets/books.png")}
                        style={{ marginTop: "5%" }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 25,
                          fontWeight: "bold",
                          marginVertical: "5%",
                        }}
                      >
                        Books
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <FloatingAction
            actions={actions}
            color="#BB86FC"
            onPressItem={(name) => {
              name == "bt_manual_entry"
                ? this.props.navigation.navigate("Add to your Library")
                : this.props.navigation.navigate("Scan");
            }}
          />
        </Container>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
