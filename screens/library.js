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
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Segment,
  Content,
  Title,
  Button,
  Spinner,
} from "native-base";
import fire from "../Firebase";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Card from "./item";
import { LogBox } from "react-native";

class PublicItems extends Component {
  state = {
    data: null,
    refreshing: false,
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
            Alert.alert("Successfully Updated!");
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
        {this.state.data ? (
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <Card>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {item.title}
                </Text>
                <Text>Description: {item.description}</Text>
                <Text>Year : {item.year}</Text>
                <TouchableOpacity
                  style={{ marginTop: "4%" }}
                  onPress={() => this.changeToPrivate(item.title)}
                >
                  <Text style={{ fontSize: 15, color: "#009BFF" }}>
                    Make Private
                  </Text>
                </TouchableOpacity>
              </Card>
            )}
            keyExtractor={(item) => item.title}
            extraData={this.state.data}
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

class PrivateItems extends Component {
  state = {
    data: null,
    refreshing: false,
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
      },
      () => {
        this.componentDidMount();
      }
    );
  };

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
            Alert.alert("Successfully Updated!");
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
        {this.state.data ? (
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <Card>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {item.title}
                </Text>
                <Text>Description: {item.description}</Text>
                <Text>Year : {item.year}</Text>
                <TouchableOpacity
                  style={{ marginTop: "4%" }}
                  onPress={() => this.changeToPublic(item.title)}
                >
                  <Text style={{ fontSize: 15, color: "#009BFF" }}>
                    Make Public
                  </Text>
                </TouchableOpacity>
              </Card>
            )}
            keyExtractor={(item) => item.title}
            extraData={this.state.data}
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
      <Container>
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
