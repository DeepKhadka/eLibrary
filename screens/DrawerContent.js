import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import { Drawer } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function DrawerContent(props) {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <DrawerContentScrollView {...props}>
        <View>
          <Image
            source={require("../assets/logo.png")}
            style={{
              width: "100%",
            }}
          />
        </View>

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="home" color="white" size={size} />
            )}
            label="Home"
            labelStyle={{ color: "white", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <FontAwesome name="id-card" color="white" size={size} />
            )}
            label="Public Profile"
            labelStyle={{ color: "white", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("Profile");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-multiple-plus" color="white" size={size} />
            )}
            label="Friend Requests"
            labelStyle={{ color: "white", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("Friend Requests");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-group" color="white" size={size} />
            )}
            label="Friends"
            labelStyle={{ color: "white", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("Friends");
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color="white" size={size} />
          )}
          label="Sign Out"
          labelStyle={{ color: "white", fontSize: 15, fontWeight: "bold" }}
          onPress={handleSignout}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <FontAwesome name="trash" color="white" size={size} />
          )}
          label="Delete Account"
          labelStyle={{ color: "white", fontSize: 15, fontWeight: "bold" }}
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
    fontSize: 30,
    marginVertical: "10%",
    fontWeight: "bold",
    fontStyle: "italic",
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
