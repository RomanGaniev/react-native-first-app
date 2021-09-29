// import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export class Home extends Component {
  loadScene = () => {
    this.props.navigation.navigate('Coin')
  }
  
  render() {
    return (
      <View>
        <Button title='Открыть страницу с монетами' onPress={this.loadScene} />
      </View>
    );
  }
}

export default Home;