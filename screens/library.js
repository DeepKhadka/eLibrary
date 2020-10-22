import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  TextInput,
  Alert,
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
  Spinner
} from "native-base";
import fire from "../Firebase";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

class PublicItems extends Component {
  state = {};
  componentDidMount() {}

  render() {
    return (
      <View>
        <Text>{this.props.name}</Text>
      </View>
    );
  }
}
class PrivateItems extends Component {
  state = {};
  componentDidMount() {}
  render() {
    return (
      <View>
        <Text>{this.props.name}</Text>
      </View>
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
