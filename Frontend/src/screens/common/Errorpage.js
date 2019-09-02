import React, { Component } from 'react'
import { Text, View,TouchableOpacity } from 'react-native'

export default class Errorpage extends Component {
    // handlePress = () =>{
    //     NetInfo.fetch().then(state => {
    //           if(state.isConnected == false){
    //             ToastAndroid.show('Please Turn On Internet', ToastAndroid.SHORT)
    //           }else{
    //               this.props.navigation.navigate('SplashScreen');
    //           }
    //         });
    // }
  render() {
    return (
      <View>
        <Text> Oops No Connectivity ! Please check Your Internet Connection </Text>
        <TouchableOpacity
                  style={{height:45, margin:10,
                    backgroundColor:'orange', width:180, borderRadius:25,
                  alignItems:'center', justifyContent:'center', alignSelf:'center'}}
                  onPress={()=> handlePress()}
                  >
                  <Text style={{textAlign:'center'}}>Retry</Text>
                  </TouchableOpacity>
      </View>
    )
  }
}