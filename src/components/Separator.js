import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Separator = ({ height, color, marginHorizontal }) => (
  <View
    style={{
      height: height,
      backgroundColor: color,
      marginHorizontal: marginHorizontal
    }}
  />
)

const styles = StyleSheet.create({
  defaultStyle: {
    height: 1,
    backgroundColor: 'black'
  }
})