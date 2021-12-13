import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export const CustomActivityIndicator = ({ size, color, backgroundStyle }) => {
  return (
    <View style={backgroundStyle ? backgroundStyle : styles.defaultStyle}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  defaultStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});