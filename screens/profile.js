import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
  ToastAndroid,
  ScrollView,
  SectionList,
  Linking,
  Image,
} from "react-native";

import { Container, Content, Spinner } from "native-base";

import Card from "./item";

import fire from "../Firebase";
import "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

import * as ImagePicker from "expo-image-picker";
import PP from "./profileplaceholder";
import { Rating } from "react-native-ratings";

export default class Profile extends Component {
  _isMounted = false;
  state = {
    username: "",
    game: 0,
    movies: 0,
    music: 0,
    books: 0,
    gameData: [],
    movieData: [],
    musicData: [],
    bookData: [],
    loading: true,
    avatar: null,
  };

  isSectionsEmpty(sectionsObject) {
    //logic for deciding if sections object is empty goes here
  }

  setPhotoUri = (uri) => {
    fire
      .auth()
      .currentUser.updateProfile({
        photoURL: uri,
      })
      .then(() => {
        fire
          .firestore()
          .collection("USERS")
          .doc(fire.auth().currentUser.uid.toString())
          .update({
            profileUri: uri,
          });
      })
      .then(() => {
        this.setState({
          avatar: uri,
        });
        ToastAndroid.show("Profile Picture updated!", ToastAndroid.SHORT);
      });
  };

  pickImagehandler = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }
    this.setPhotoUri(pickerResult.uri);
  };

  emptyComponent = () => {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
          Nothing here, come back later...
        </Text>
      </View>
    );
  };

  publicGame = () => {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Games")
      .where("public", "==", true)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
            this.setState({
              game: this.state.game + 1,
            });
          });
          this.setState({
            gameData: data,
          });
        }
      })
      .then(() => {
        this.publicMovie();
      })

      .catch((err) => {
        return err.toString();
      });
  };

  publicMovie = () => {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Movies")
      .where("public", "==", true)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
            this.setState({
              movies: this.state.movies + 1,
            });
          });
          this.setState({
            movieData: data,
          });
        }
      })
      .then(() => {
        this.publicMusic();
      })

      .catch((err) => {
        return err.toString();
      });
  };
  publicMusic = () => {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Music")
      .where("public", "==", true)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
            this.setState({
              music: this.state.music + 1,
            });
          });
          this.setState({
            musicData: data,
          });
        }
      })
      .then(() => {
        this.publicBook();
      })

      .catch((err) => {
        return err.toString();
      });
  };
  publicBook = () => {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Books")
      .where("public", "==", true)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
            this.setState({
              books: this.state.books + 1,
            });
          });
          if (this._isMounted) {
            this.setState({
              bookData: data,

              loading: false,
            });
          }
        } else {
          if (this._isMounted) {
            this.setState({
              loading: false,
            });
          }
        }
      })

      .catch((err) => {
        return err.toString();
      });
  };

  componentDidMount() {
    this._isMounted = true;
    this.userInfo();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  userInfo() {
    var userCheck = this.props.route.params.ID != "";

    var uri = null;

    if (userCheck) {
      fire
        .firestore()
        .collection("USERS")
        .doc(this.props.route.params.ID)
        .get()
        .then((doc) => {
          uri = doc.data().profileUri;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      fire
        .firestore()
        .collection("USERS")
        .doc(fire.auth().currentUser.uid.toString())
        .get()
        .then((doc) => {
          uri = doc.data().profileUri;
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fire
      .firestore()
      .collection("USERS")
      .doc(
        userCheck
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .get()
      .then((doc) => {
        this.setState({
          username: doc.data().username,
          avatar: uri,
        });
        this.fetchGameInfo();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  fetchGameInfo() {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Games")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              // this.setState({
              //   game: this.state.game + 1,
              // });
            }
          });
        }
      })
      .then(this.fetchMoviesInfo())
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  fetchMoviesInfo() {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Movies")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              // this.setState({
              //   movies: this.state.movies + 1,
              // });
            }
          });
        }
      })
      .then(this.fetchMusicInfo())
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }
  fetchMusicInfo() {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Music")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              // this.setState({
              //   music: this.state.music + 1,
              // });
            }
          });
        }
      })
      .then(this.fetchBooksInfo())
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  fetchBooksInfo() {
    fire
      .firestore()
      .collection("USERS")
      .doc(
        this.props.route.params.ID != ""
          ? this.props.route.params.ID
          : fire.auth().currentUser.uid.toString()
      )
      .collection("Books")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            if (this._isMounted) {
              // this.setState({
              //   books: this.state.books + 1,
              // });
            }
          });
        }
      })
      .then(() => {
        this.publicGame();
      })

      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  render() {
    const sections = [
      {
        title: "Games",
        data: this.state.gameData,
      },
      {
        title: "Movies",
        data: this.state.movieData,
      },
      {
        title: "Music",
        data: this.state.musicData,
      },
      {
        title: "Books",
        data: this.state.bookData,
      },
    ];

    return this.state.loading ? (
      <Container style={{ backgroundColor: "black" }}>
        <Content>
          <Spinner color="green" />
        </Content>
      </Container>
    ) : (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View
          style={{
            flex: 1.5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#272727",
            borderBottomLeftRadius: 150,
            borderBottomRightRadius: 150,
          }}
        >
          <View style={{ alignItems: "center" }}>
            {this.props.route.params.ID == "" ? (
              <TouchableOpacity onPress={this.pickImagehandler}>
                <Image
                  style={styles.image}
                  source={{
                    uri: this.state.avatar ? this.state.avatar : PP,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Image
                style={styles.image}
                source={{
                  uri: this.state.avatar ? this.state.avatar : PP,
                }}
              />
            )}

            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginVertical: "5%",
                color: "white",
              }}
            >
              {this.state.username}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ marginHorizontal: "1%", fontSize: 15, color: "white" }}
            >
              {this.state.game}
            </Text>
            <Text style={{ fontSize: 15, color: "white" }}>Games</Text>

            <Text
              style={{ marginHorizontal: "1%", fontSize: 15, color: "white" }}
            >
              {this.state.movies}
            </Text>
            <Text style={{ fontSize: 15, color: "white" }}>Movies</Text>

            <Text
              style={{ marginHorizontal: "1%", fontSize: 15, color: "white" }}
            >
              {this.state.music}
            </Text>
            <Text style={{ fontSize: 15, color: "white" }}>Music</Text>

            <Text
              style={{ marginHorizontal: "1%", fontSize: 15, color: "white" }}
            >
              {this.state.books}
            </Text>
            <Text style={{ fontSize: 15, color: "white" }}>Books</Text>
          </View>
        </View>

        <View style={{ flex: 3, backgroundColor: "black" }}>
          <View
            style={{
              flex: 1,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              Library
            </Text>
          </View>

          <View style={{ flex: 10 }}>
            <SectionList
              sections={this.isSectionsEmpty(sections) ? [] : sections}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text style={{ color: "white" }}>
                        Description: {item.description}
                      </Text>
                      <Text style={{ color: "white" }}>Year : {item.year}</Text>

                      <View
                        style={{
                          marginVertical: "1%",
                          alignItems: "flex-start",
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ color: "white", marginRight: "1%" }}>
                          Rating: {item.rating}
                        </Text>
                        <Rating
                          ratingCount={5}
                          readonly
                          imageSize={20}
                          startingValue={item.rating}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ alignItems: "flex-end" }}
                        onPress={() => {
                          var search =
                            "https://google.com/search?q=" + item.title;
                          Linking.openURL(search);
                        }}
                      >
                        <Image source={require("../assets/google.png")} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              renderSectionHeader={({ section }) => {
                return <Text style={styles.header}>{section.title}</Text>;
              }}
              keyExtractor={(item) => item.title}
              ListEmptyComponent={this.emptyComponent}
            />
          </View>
        </View>
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

    justifyContent: "space-between",
  },
  header: {
    fontSize: 25,
    marginHorizontal: "2%",
    color: "white",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
  },
});
