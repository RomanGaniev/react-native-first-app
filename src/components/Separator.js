import React from 'react';
import { View } from 'react-native';

export const Separator = ({ height, color, marginHorizontal }) => (
  <View
    style={{
      height: height,
      backgroundColor: color,
      marginHorizontal: marginHorizontal
    }}
  />
)