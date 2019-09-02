import React, { Component } from 'react'
import { StyleSheet, View,StatusBar,TouchableOpacity } from 'react-native';

import {Container, Text} from 'native-base'

export default class Welcome extends Component {

    render() {
      return (
        <Container style={styles.Container}>
          <StatusBar hidden />
          <View style={{flexDirection:'column'}}>
              <Text style={styles.appTitle}>Welcome</Text>
              <Text style={styles.quote}>"Earn Money Easily"</Text>
              <Text style={styles.subject}>I am a </Text>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  onPress={()=> this.props.navigation.navigate('Login')}
                >
                  <Text style={styles.agentButton}>Agent</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=> this.props.navigation.navigate('AdminLogin')}
                >
                  <Text style={styles.adminButton}>Admin</Text>
                </TouchableOpacity>
              </View>
          </View>

      </Container>
      )
    }
  }

  const styles = StyleSheet.create({
    Container:{
      flex:1,
      backgroundColor:'#FAFAFA',
      justifyContent:'center',
      alignItems:'center'
    },
    appTitle:{
      paddingTop:40,
      fontFamily:'Roboto',
      fontWeight:'bold',
      fontSize:35,
      alignSelf:'center'
    },
    quote:{
      paddingTop:10,
      fontFamily:'Roboto',
      fontWeight:'bold',
      alignSelf:'center',
      fontSize:20,
    },
    subject:{
      paddingTop:10,
      fontFamily:'Roboto',
      fontWeight:'bold',
      alignSelf:'center',
      fontSize:28,
    },
    buttonView:{
      flexDirection:'row',

    },
    agentButton:{
      marginRight:10,
      backgroundColor:'#FF9800',height:80, textAlign:'center', textAlignVertical:'center',
      width:150,
      fontFamily:'Roboto',
      fontWeight:'200',
      color:'#1A237E',
      borderRadius:45,
      fontSize:25
    },
    adminButton:{
      marginLeft:10,
      backgroundColor:'#FF9800',height:80, textAlign:'center', textAlignVertical:'center',
      width:150,
      fontFamily:'Roboto',
      fontWeight:'200',
      color:'#1A237E',
      borderRadius:45,
      fontSize:25
    },
    WelcomeText:{
      backgroundColor: '#635DB7',
      height: '100%',
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      color:'#fff'
    },
    buttons:{
      backgroundColor: '#635DB7',
      height: '100%',
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      color:'#fff'
    }

  })
