import React, { Component } from 'react'
import { StyleSheet, Text, View,Button,Image,BackHandler,Alert } from 'react-native';
import Profile from './Profile';

export default class Dashboard extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
}
handleBackButtonClick = () =>{
  return true;
}
  static navigationOptions = {
    drawerLabel: 'Dashboard',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../../../assets/icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };
    render() {
      return (
        <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text
          style={{
            textAlign:'center', fontSize:25,justifyContent:'center',
            color:'#ff5722',fontWeight:'bold'
          }}
          >Welcome To Syndicate bank</Text>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
  });