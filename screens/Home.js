import React, { useState, useEffect, Component } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
} from "react-native";

import { TextInput } from "react-native-gesture-handler";
import fire from "../Firebase";
import "firebase/firestore";
import { FloatingAction } from "react-native-floating-action";
import Loading from "../Loading";
import Expo from "expo";

import {
  Container,
  Header,
  Content,
  Spinner,
  ProgressBar,
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
              });
            }
          });
        } else {
          if (this._isMounted) {
            this.setState({
              loading: false,
            });
          }
        }
      })

      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

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
      <Container>
        <Content>
          <Spinner color="green" />
        </Content>
      </Container>
    ) : (
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
              placeholder="Search friends"
              onChangeText={(val) => {
                this.setState({
                  search: val,
                });
              }}
              autoCapitalize="none"
            />
            <Icon
              name="ios-search"
              onPress={() => {
                Alert.alert(this.state.search);
              }}
            />
          </Item>
        </Header>
        <Container>
          <Content style={{ backgroundColor: "black" }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Library", { dbName: "Games" });
              }}
            >
              <Card style={{ borderColor: "white" }}>
                <CardItem header>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    Games
                  </Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={{ fontSize: 20 }}>
                      You have {this.state.game} games in your library.
                    </Text>
                  </Body>
                </CardItem>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Library", { dbName: "Movies" });
              }}
            >
              <Card style={{ borderColor: "darkgreen" }}>
                <CardItem header>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    Movies
                  </Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={{ fontSize: 20 }}>
                      You have {this.state.movies} movies in your library.
                    </Text>
                  </Body>
                </CardItem>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Library", { dbName: "Music" });
              }}
            >
              <Card style={{ borderColor: "darkgreen" }}>
                <CardItem header>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    Music
                  </Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={{ fontSize: 20 }}>
                      You have {this.state.music} music in your library.
                    </Text>
                  </Body>
                </CardItem>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Library", { dbName: "Books" });
              }}
            >
              <Card style={{ borderColor: "darkgreen" }}>
                <CardItem header>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    Books
                  </Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={{ fontSize: 20 }}>
                      You have {this.state.books} books in your library.
                    </Text>
                  </Body>
                </CardItem>
              </Card>
            </TouchableOpacity>
          </Content>
        </Container>
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
