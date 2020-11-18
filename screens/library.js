import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  FlatList,
  Linking,
} from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Segment,
  Content,
  Button,
  Spinner,
  Toast,
} from "native-base";
import { Rating, AirbnbRating } from "react-native-ratings";
import fire from "../Firebase";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Card from "./item";
import { LogBox } from "react-native";

class PublicItems extends Component {
  state = {
    data: null,
    refreshing: false,
    loading: true,
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

  deleteItem(itemTitle) {
    var docID;

    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection(this.props.name)
      .where("title", "==", itemTitle)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            docID = doc.id;
          });
        }
      })
      .then(() => {
        fire
          .firestore()
          .collection("USERS")
          .doc(fire.auth().currentUser.uid.toString())
          .collection(this.props.name)
          .doc(docID)
          .delete()
          .then(() => {
            Alert.alert("Successfully deleted!");
            this.componentDidMount();
          })
          .catch((err) => {
            Alert.alert(err.toString());
          });
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  changeToPrivate = (itemTitle) => {
    var docID;

    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection(this.props.name)
      .where("title", "==", itemTitle)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            docID = doc.id;
          });
        }
      })
      .then(() => {
        fire
          .firestore()
          .collection("USERS")
          .doc(fire.auth().currentUser.uid.toString())
          .collection(this.props.name)
          .doc(docID)
          .update({
            public: false,
          })
          .then(() => {
            // Alert.alert("Successfully Updated!");
            // Toast.show({
            //   text: "Wrong password!",
            //   buttonText: "Okay",
            //   type: "success",
            // });
            ToastAndroid.show("Successfully updated!", ToastAndroid.SHORT);

            this.componentDidMount();
          })
          .catch((err) => {
            Alert.alert(err.toString());
          });
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  };
  emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "white",
          }}
        >
          Nothing here, come back later...
        </Text>
      </View>
    );
  };

  componentDidMount() {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection(this.props.name)
      .where("public", "==", true)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
          });
          this.setState({
            data: data,
            refreshing: false,
            loading: false,
          });
          console.log(this.state.loading);
        } else {
          this.setState({
            loading: false,
            refreshing: false,
          });
        }
      })

      .catch((err) => {
        return err.toString();
      });
  }

  render() {
    return !this.state.loading ? (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{ marginTop: "4%" }}
                onPress={() => this.changeToPrivate(item.title)}
              >
                <Text style={{ fontSize: 15, color: "#009BFF" }}>
                  Make Private
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: "4%", marginRight: "5%" }}
                onPress={() => this.deleteItem(item.title)}
              >
                <Text style={{ fontSize: 15, color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.title}
        extraData={this.state.data}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        ListEmptyComponent={this.emptyComponent}
      />
    ) : (
      <Container style={{ backgroundColor: "black" }}>
        <Content>
          <Spinner color="green" />
        </Content>
      </Container>
    );
  }
}

class PrivateItems extends Component {
  state = {
    data: null,
    refreshing: false,
    loading: true,
  };

  // showEmpty = () => {
  //   return (
  //     <View
  //       style={{ justifyContent: "center", alignContent: "center", flex: 1 }}
  //     >
  //       <Text style={{ fontSize: 15, fontWeight: "bold" }}>
  //         No items to display
  //       </Text>
  //     </View>
  //   );
  // };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        loading: true,
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "white",
          }}
        >
          Nothing here, come back later...
        </Text>
      </View>
    );
  };

  deleteItem(itemTitle) {
    var docID;

    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection(this.props.name)
      .where("title", "==", itemTitle)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            docID = doc.id;
          });
        }
      })
      .then(() => {
        fire
          .firestore()
          .collection("USERS")
          .doc(fire.auth().currentUser.uid.toString())
          .collection(this.props.name)
          .doc(docID)
          .delete()
          .then(() => {
            ToastAndroid.show("Successfully deleted!", ToastAndroid.SHORT);

            this.componentDidMount();
          })
          .catch((err) => {
            Alert.alert(err.toString());
          });
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  }

  changeToPublic = (itemTitle) => {
    var docID;

    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection(this.props.name)
      .where("title", "==", itemTitle)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          sub.forEach((doc) => {
            docID = doc.id;
          });
        }
      })
      .then(() => {
        fire
          .firestore()
          .collection("USERS")
          .doc(fire.auth().currentUser.uid.toString())
          .collection(this.props.name)
          .doc(docID)
          .update({
            public: true,
          })
          .then(() => {
            ToastAndroid.show("Successfully updated!", ToastAndroid.SHORT);
            this.setState({
              loading: true,
            });
            this.componentDidMount();
          })
          .catch((err) => {
            Alert.alert(err.toString());
          });
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  };

  componentDidMount() {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

    fire
      .firestore()
      .collection("USERS")
      .doc(fire.auth().currentUser.uid.toString())
      .collection(this.props.name)
      .where("public", "==", false)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
          });

          this.setState({
            data: data,
            refreshing: false,
            loading: false,
          });
        } else {
          this.setState({
            loading: false,
            refreshing: false,
          });
        }
      })

      .catch((err) => {
        return err.toString();
      });
  }

  render() {
    return !this.state.loading ? (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{ marginTop: "4%" }}
                onPress={() => this.changeToPublic(item.title)}
              >
                <Text style={{ fontSize: 15, color: "#009BFF" }}>
                  Make Public
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: "4%", marginRight: "5%" }}
                onPress={() => this.deleteItem(item.title)}
              >
                <Text style={{ fontSize: 15, color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.title}
        extraData={this.state.data}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        ListEmptyComponent={this.emptyComponent}
      />
    ) : (
      <Container style={{ backgroundColor: "black" }}>
        <Content>
          <Spinner color="green" />
        </Content>
      </Container>
    );
  }
}

export default class Library extends Component {
  state = {
    activePage: 1,
  };

  selectComponent = (activePage) => () => this.setState({ activePage });

  _renderComponent = () => {
    if (this.state.activePage === 1)
      return <PublicItems name={this.props.route.params.dbName} />;
    //... Your Component 1 to display
    else return <PrivateItems name={this.props.route.params.dbName} />; //... Your Component 2 to display
  };

  render() {
    return (
      <Container style={{ backgroundColor: "black" }}>
        <Header
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#272727",
          }}
        >
          <Left>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Segment
              style={{
                backgroundColor: "#272727",
              }}
            >
              <Button
                style={{
                  width: "50%",
                  justifyContent: "center",
                }}
                active={this.state.activePage === 1}
                onPress={this.selectComponent(1)}
              >
                <FontAwesome name="globe" size={20} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Public
                </Text>
              </Button>
              <Button
                style={{
                  width: "50%",
                  justifyContent: "center",
                }}
                active={this.state.activePage === 2}
                onPress={this.selectComponent(2)}
              >
                <FontAwesome name="user-shield" size={20} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Private
                </Text>
              </Button>
            </Segment>
          </Body>
          <Right />
        </Header>
        <Content padder>{this._renderComponent()}</Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
