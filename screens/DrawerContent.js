import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import { Title, Drawer } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import fire from "../Firebase";

export function DrawerContent(props) {
  // const [username, setUsername] = useState("");

  // useEffect(() => {
  //   fire
  //     .firestore()
  //     .collection("USERS")
  //     .doc(fire.auth().currentUser.uid.toString())
  //     .get()
  //     .then((doc) => {
  //       setUsername(doc.data().username);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}></View>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ marginLeft: 15, flexDirection: "column" }}>
              <Title style={styles.title}>Username</Title>
            </View>
          </View>
        </View>

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            )}
            label="Home"
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <FontAwesome name="id-card" color={color} size={size} />
            )}
            label="Profile"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-multiple-plus" color={color} size={size} />
            )}
            label="Friend Requests"
            onPress={() => {
              props.navigation.navigate("Friend Requests");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-group" color={color} size={size} />
            )}
            label="Friends"
            onPress={() => {
              props.navigation.navigate("Friends");
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={handleSignout}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <FontAwesome name="trash" color={color} size={size} />
          )}
          label="Delete Account"
          onPress={handleDeleteAccount}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    marginTop: 20,
    flexDirection: "column",
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
