import React, { Component } from 'react'
import { StyleSheet, Text, View,Button,StatusBar,Image,AsyncStorage } from 'react-native';
import jwt_decode from 'jwt-decode';

export default class SplashScreen extends Component{

  componentDidMount = () =>{
          setTimeout( () => {
            this.setTimePassed();
          },2000);

  }
  setTimePassed = async()=> {
    let result = await AsyncStorage.getItem('USER');
    if(result){
      result = JSON.parse(result);
      const decodedUser = jwt_decode(result.token);
      if(decodedUser !== null){
        if(decodedUser.isAdmin == true){
          return this.props.navigation.navigate('AdminDashboard');
        }
        this.props.navigation.navigate('Dashboard');
      }
    }else{
      this.props.navigation.navigate('Welcome');
    }
  }

    render(){
      return(
        <View style={styles.container}>
          <StatusBar hidden />
          {/* <Image source={require('../../../assets/icon.png')} style={{ width:100, height:100, borderRadius:85}}/> */}
          <Text style={styles.appTitle}>Syndicate AffiliationApp</Text>
          </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    appTitle:{
      paddingTop:20,
      fontFamily:'Roboto',
      fontWeight:'bold',
      fontSize:30
    }
  });
