import React, { Component } from 'react'
import { StyleSheet, Text, View,Button,Image } from 'react-native';


export default class AdminDashboard extends Component {
  static navigationOptions = {
    drawerLabel: 'AdminDashboard',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../../../assets/icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };
    render() {
      return (
        <View>
          <Text style={{textAlign:'center', fontSize:22, color:'orange'}}> Welcome to Syndicate Bank</Text>
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