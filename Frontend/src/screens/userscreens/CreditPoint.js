import React, { Component } from 'react'
import { StyleSheet, Text, View,ActivityIndicator,AsyncStorage ,TouchableOpacity} from 'react-native';
import {Container, Content,Button,Thumbnail} from 'native-base'
import {Row, Grid} from 'react-native-easy-grid'

import { NavigationEvents } from "react-navigation";


import {baseUrl} from '../../../scretKey';
import axios from 'axios';

export default class CreditPoint extends Component {
  constructor(props){
    super(props);
    this.state={
      point:null,
      showLoading:0,
    }
  }

  componentDidMount = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/user/creditPoint/getCreditPointAndRupees`);
    if(res.status === 404){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ point: res.data, showLoading:1})
  }

  handleGetData = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/user/creditPoint/getCreditPointAndRupees`);
    if(res.status === 404){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ point: res.data, showLoading:1})
  }
    render() {
      return (
        <View>
           <NavigationEvents onDidFocus={() => this.handleGetData()} />
           {this.state.point || this.state.showLoading?
              (
                this.state.point?
                <View>
                  <Text style={{alignSelf:'center'}}>Joined On: {this.state.point.joiningDate}</Text>
                  <Text style={{alignSelf:'center'}}>Reward Point: {this.state.point.currentCreditPoint}</Text>
                  <Text style={{alignSelf:'center'}}>Converted Cash Amount: INR. {this.state.point.rupees}</Text>
                  <Text style={{alignSelf:'center'}}>Level: {this.state.point.label}</Text>

                  <TouchableOpacity
                  style={{height:45, margin:10,
                    backgroundColor:'orange', width:180, borderRadius:25,
                  alignItems:'center', justifyContent:'center', alignSelf:'center'}}
                  onPress={()=>this.props.navigation.navigate('AddPaymentDetails',{'item':this.state.point})}
                  >
                  <Text style={{textAlign:'center'}}>EnCash to Real Money</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={{height:45, margin:10,
                    backgroundColor:'orange', width:180, borderRadius:25,
                  alignItems:'center', justifyContent:'center', alignSelf:'center'}}
                  onPress={()=> this.props.navigation.navigate('CashHistory')}
                  >
                  <Text style={{textAlign:'center'}}>Withdraw History</Text>
                  </TouchableOpacity>
                </View>
                :<Text>No Data Available!</Text>


              ):<ActivityIndicator size="small" color="#00ff00" />
          }
        </View>

     )
    }
  }
