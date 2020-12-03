import React, { Component, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import fire from "../Firebase";
import { Rating, AirbnbRating } from "react-native-ratings";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default class searchMedia extends Component {
  state = {
    data: null,
    media: "",
    minRate: "",
    maxRate: "",
  };

  filter = () => {
    this.setState({
      data: null,
    });
    if (
      this.state.minRate == "" ||
      this.state.maxRate == "" ||
      this.state.media == "" ||
      this.state.media == "Nothing"
    ) {
      Alert.alert("Please fill both the fields and select a media types.");
    } else if (
      Number(this.state.minRate) < 1 ||
      Number(this.state.maxRate) > 5
    ) {
      Alert.alert("Please provide a valid rating from min 1 to max 5.");
    } else {
      if (this.state.media == "Games") {
        this.allRATEDGames();
      } else if (this.state.media == "Movies") {
        this.allRATEDMovies();
      } else if (this.state.media == "Music") {
        this.allRATEDMusic();
      } else {
        this.allRATEDBooks();
      }
    }
  };

  allMusic = () => {
    this.setState({
      data: null,
    });

    var docID;
    fire
      .firestore()
      .collectionGroup("Music")
      .orderBy("title", "asc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              description: doc.data().description,
              artist: doc.data().artist,
              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  allRATEDMusic = () => {
    this.setState({
      data: null,
    });

    var docID;
    fire
      .firestore()
      .collectionGroup("Music")
      .where("rating", ">=", Number(this.state.minRate))
      .where("rating", "<=", Number(this.state.maxRate))
      .orderBy("rating", "desc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              description: doc.data().description,
              artist: doc.data().artist,
              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  allMovies = () => {
    this.setState({
      data: null,
    });
    var docID;
    fire
      .firestore()
      .collectionGroup("Movies")
      .orderBy("title", "asc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              description: doc.data().description,
              genre: doc.data().genre,

              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  allRATEDMovies = () => {
    this.setState({
      data: null,
    });
    var docID;
    fire
      .firestore()
      .collectionGroup("Movies")
      .where("rating", ">=", Number(this.state.minRate))
      .where("rating", "<=", Number(this.state.maxRate))
      .orderBy("rating", "desc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              description: doc.data().description,
              genre: doc.data().genre,

              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  allBooks = () => {
    this.setState({
      data: null,
    });
    var docID;
    fire
      .firestore()
      .collectionGroup("Books")
      .orderBy("title", "asc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              author: doc.data().author,
              description: doc.data().description,
              genre: doc.data().genre,
              numberOfPages: doc.data().numberOfPages,
              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  allRATEDBooks = () => {
    this.setState({
      data: null,
    });
    var docID;
    fire
      .firestore()
      .collectionGroup("Books")
      .where("rating", ">=", Number(this.state.minRate))
      .where("rating", "<=", Number(this.state.maxRate))
      .orderBy("rating", "desc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              author: doc.data().author,
              description: doc.data().description,
              genre: doc.data().genre,
              numberOfPages: doc.data().numberOfPages,
              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  allGames = () => {
    this.setState({
      data: null,
    });
    var docID;
    fire
      .firestore()
      .collectionGroup("Games")
      .orderBy("title", "asc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              company: doc.data().company,
              description: doc.data().description,
              genre: doc.data().genre,
              platform: doc.data().platform,
              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  allRATEDGames = () => {
    this.setState({
      data: null,
    });
    var docID;
    fire
      .firestore()
      .collectionGroup("Games")
      .where("rating", ">=", Number(this.state.minRate))
      .where("rating", "<=", Number(this.state.maxRate))
      .orderBy("rating", "desc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            docID = doc.id;
            const x = {
              company: doc.data().company,
              description: doc.data().description,
              genre: doc.data().genre,
              platform: doc.data().platform,
              public: doc.data().public,
              title: doc.data().title,
              year: doc.data().year,
              ID: docID,
              rating: doc.data().rating,
            };
            data.push(x);
          });
          this.setState({
            data: data,
          });
        }
      });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 20,
                borderColor: "red",
              }}
              onPress={this.allGames}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
                All Games
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 20,
                borderColor: "red",
              }}
              onPress={this.allMovies}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
                All Movies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 20,
                borderColor: "red",
              }}
              onPress={this.allMusic}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
                All Music
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 20,
                borderColor: "red",
              }}
              onPress={this.allBooks}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
                All Books
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ color: "white", fontSize: 15, marginBottom: "5%" }}
              >
                Media Type*
              </Text>
              <Picker
                selectedValue={this.state.media}
                style={{
                  height: 40,
                  width: 120,
                  color: "white",
                  borderColor: "white",
                  borderWidth: 5,
                }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ media: itemValue })
                }
              >
                <Picker.Item label="Select" value="Nothing" />
                <Picker.Item label="Games" value="Games" />
                <Picker.Item label="Movies" value="Movies" />
                <Picker.Item label="Music" value="Music" />
                <Picker.Item label="Books" value="Books" />
              </Picker>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ color: "white", fontSize: 15, marginBottom: "5%" }}
              >
                Rating between*
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={{
                    borderBottomWidth: 3,
                    borderColor: "#BB86FC",
                    borderRadius: 2,
                    width: 50,
                    height: 40,
                    backgroundColor: "#272727",
                    paddingLeft: 3,
                    fontSize: 15,
                    color: "white",
                  }}
                  placeholder="min"
                  placeholderTextColor="gray"
                  keyboardType="decimal-pad"
                  onChangeText={(val) => {
                    this.setState({
                      minRate: val,
                    });
                  }}
                />
                <TextInput
                  style={{
                    borderBottomWidth: 3,
                    borderColor: "#BB86FC",
                    borderRadius: 2,
                    width: 50,
                    height: 40,
                    backgroundColor: "#272727",
                    paddingLeft: 3,
                    fontSize: 15,
                    color: "white",
                  }}
                  placeholder="max"
                  placeholderTextColor="gray"
                  keyboardType="decimal-pad"
                  onChangeText={(val) => {
                    this.setState({
                      maxRate: val,
                    });
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                backgroundColor: "#BB86FC",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={this.filter}
            >
              <FontAwesome name="search" color="black" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 4 }}>
          <FlatList
            data={this.state.data}
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
            keyExtractor={(item) => item.title}
            extraData={this.state.data}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            ListEmptyComponent={this.emptyComponent}
          />
        </View>
      </View>
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
});
