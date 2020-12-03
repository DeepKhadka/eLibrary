import React, { useState, useEffect, Component } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button } from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

import Home from "./screens/Home";
import LoginSignup from "./screens/LoginSignup";
import Login from "./screens/login";
import Signup from "./screens/signup";
import ForgotPassword from "./screens/forgotpassword";
import Games from "./screens/Games";
import Movies from "./screens/Movies";
import Music from "./screens/Music";
import Books from "./screens/Books";
import Library from "./screens/library";
import { DrawerContent } from "./screens/DrawerContent";
import Search from "./screens/search";
import Requests from "./screens/requests";
import Friends from "./screens/friends";
import Profile from "./screens/profile";
import searchMedia from "./screens/searchMedia";

import fire from "./Firebase";
import { LogBox } from "react-native";
import _ from "lodash";

import { Text } from "react-native-paper";

LogBox.ignoreLogs(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const Stack = createStackNavigator();
const DrawerNav = createDrawerNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();

handleSignout = () => {
  fire.auth().signOut();
};

handleDeleteAccount = () => {
  var userID = fire.auth().currentUser.uid.toString();

  fire
    .firestore()
    .collectionGroup("CONNECTED")
    .where("fID", "==", userID)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      }
    })
    .then(() => {
      fire
        .firestore()
        .collectionGroup("PENDING")
        .where("fID", "==", userID)
        .get()
        .then((querySnapshot) => {});
    });

  fire
    .auth()
    .currentUser.delete()
    .then(() => {})
    .catch((err) => {
      Alert.alert(err.toString());
    });
};

function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBook = (book) => {
    navigation.navigate("Add to your Library", {
      screen: "Books",
      params: { title: book.title },
    });
  };

  const handleMovie = (movie) => {
    navigation.navigate("Add to your Library", {
      screen: "Movies",
      params: { title: movie.title },
    });
  };

  const handleMusic = (music) => {
    navigation.navigate("Add to your Library", {
      screen: "Music",
      params: { title: music.title },
    });
  };

  const handleGame = (game) => {
    var platform = "";
    if (
      game.title.indexOf("PlayStation 4") >= 0 ||
      game.title.indexOf("PS4") >= 0
    ) {
      platform = "PlayStation 4";
    } else if (
      game.title.indexOf("PlayStation 3") >= 0 ||
      game.title.indexOf("PS3") >= 0
    ) {
      platform = "PlayStation 3";
    } else if (game.title.indexOf("Xbox One") >= 0) {
      platform = "Xbox One";
    } else if (game.title.indexOf("Xbox 360") >= 0) {
      platform = "Xbox 360";
    } else if (game.title.indexOf("Nintendo Switch") >= 0) {
      platform = "Nintendo Switch";
    } else if (game.title.indexOf("PlayStation Vita") >= 0) {
      platform = "PlayStation Vita";
    } else if (game.title.indexOf("PC") >= 0) {
      platform = "PC";
    }

    navigation.navigate("Add to your Library", {
      screen: "Games",
      params: { title: game.title, brand: game.brand, platform: platform },
    });
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    var x;

    setScanned(true);
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    //alert(`Barcode number is ${data}`);

    //navigation.push('Home', null);

    var api = "https://api.upcitemdb.com/prod/trial/lookup?upc=" + data.trim();

    await fetch(api)
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.items.forEach((element) => {
          x = element;
        });
      })
      .then(() => {
        if (
          x.category.indexOf("Books") >= 0 ||
          x.category.indexOf("Book") >= 0
        ) {
          handleBook(x);
        } else if (
          x.category.indexOf("Video Game") >= 0 ||
          x.category.indexOf("Games") >= 0 ||
          x.category.indexOf("Game") >= 0
        ) {
          handleGame(x);
        } else if (x.category.indexOf("Televisions") >= 0) {
          handleMovie(x);
        } else if (x.category.indexOf("Music") >= 0) {
          handleMusic(x);
        } else {
          Alert.alert("Illegal item scanned");
          navigation.goBack();
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(
          "You've reached the daily scan limit of 100 items. Scan at a later time."
        );
        navigation.goBack();
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}

      {scanned && (
        <Button
          title={"Continue"}
          onPress={() => navigation.navigate("Home")}
        />
      )}
    </View>
  );
}

function drawer() {
  return (
    <DrawerNav.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <DrawerNav.Screen name="Home" component={Home}></DrawerNav.Screen>
    </DrawerNav.Navigator>
  );
}

function addItemsManuallyStack() {
  return (
    <MaterialTopTabs.Navigator
      tabBarOptions={{
        style: { backgroundColor: "black" },

        showIcon: true,
        activeTintColor: "#BB86FC",
        inactiveTintColor: "white",
      }}
    >
      <MaterialTopTabs.Screen
        name="Games"
        component={Games}
        initialParams={{ title: "", brand: "", platform: "" }}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="gamepad" size={19} color={color} />
          ),
        }}
      ></MaterialTopTabs.Screen>
      <MaterialTopTabs.Screen
        name="Movies"
        component={Movies}
        initialParams={{ title: "" }}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="film" size={19} color={color} />
          ),
        }}
      ></MaterialTopTabs.Screen>
      <MaterialTopTabs.Screen
        name="Music"
        component={Music}
        initialParams={{ title: "" }}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="music" size={19} color={color} />
          ),
        }}
      ></MaterialTopTabs.Screen>
      <MaterialTopTabs.Screen
        name="Books"
        component={Books}
        initialParams={{ title: "" }}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="book" size={19} color={color} />
          ),
        }}
      ></MaterialTopTabs.Screen>
    </MaterialTopTabs.Navigator>
  );
}

function homeStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: "#272727" } }}
      >
        <Stack.Screen
          name="Home"
          children={drawer}
          options={{
            headerShown: false,

            headerStyle: { backgroundColor: "#272727" },
          }}
        />
        <Stack.Screen
          name="Add to your Library"
          children={addItemsManuallyStack}
          options={{
            headerTintColor: "#ffffff",
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "#272727",
              borderBottomWidth: 1,
            },
          }}
        />
        <Stack.Screen
          name="Library"
          component={Library}
          options={{
            headerTintColor: "#ffffff",
            headerShown: false,
            headerStyle: { backgroundColor: "#272727" },
          }}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            headerTintColor: "#ffffff",
            headerStyle: { backgroundColor: "#272727" },
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerTintColor: "#ffffff",
            headerStyle: { backgroundColor: "#272727" },
          }}
        />
        <Stack.Screen
          name="Friend Requests"
          component={Requests}
          options={{
            headerTintColor: "#ffffff",
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "#272727",
              borderBottomWidth: 1,
            },
          }}
        />
        <Stack.Screen
          name="Friends"
          component={Friends}
          options={{
            headerTintColor: "#ffffff",
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "#272727",
              borderBottomWidth: 1,
            },
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          initialParams={{ ID: "" }}
          options={{
            headerTintColor: "#ffffff",
            headerStyle: { backgroundColor: "black" },
          }}
        />
        <Stack.Screen
          name="searchMedia"
          component={searchMedia}
          options={{
            headerTintColor: "#ffffff",
            headerStyle: { backgroundColor: "black" },
            headerTitle: "Filter Media",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function loginStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerTitle: "Welcome",
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "#272727",
              borderBottomWidth: 1,
            },
            headerTintColor: "#ffffff",
            headerTitleStyle: { alignSelf: "center" },
          }}
          name="LoginSignup"
          component={LoginSignup}
        />
        <Stack.Screen
          options={{
            headerTitle: "LOGIN",
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "#272727",
              borderBottomWidth: 1,
            },
            headerTintColor: "#ffffff",
          }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{
            headerTitle: "SIGNUP",
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "#272727",
              borderBottomWidth: 1,
            },
            headerTintColor: "#ffffff",
          }}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{
            headerTitle: "Forgot Password",
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "#272727",
              borderBottomWidth: 1,
            },
            headerTintColor: "#ffffff",
          }}
          name="ForgotPassword"
          component={ForgotPassword}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default class App extends Component {
  state = {
    user: {},
  };

  componentDidMount() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    if (this.state.user) {
      return homeStack();
    } else {
      return loginStack();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles_1 = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
