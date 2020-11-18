import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
export default function Item(props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 4,
    backgroundColor: "#272727",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginHorizontal: "2%",
    marginVertical:"2%",
    
  },
  cardContent: {
    marginHorizontal:"3%",
    paddingVertical:"3%"

  },
});
