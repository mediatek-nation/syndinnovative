import React, { Component } from 'react'
import { Text, View,TouchableOpacity,ToastAndroid, ActivityIndicator, AsyncStorage } from 'react-native'
import { Button } from 'native-base';
import { NavigationEvents } from "react-navigation";

import { baseUrl} from '../../../scretKey';

import axios from 'axios';

export default class SinglePayment extends Component {
  constructor(props){
    super(props);
    this.state ={
      payment:null,
      showLoading:0
    }
  }
  componentDidMount(){
    const { navigation } = this.props;
    const data = navigation.getParam('item', 'NO-data');
    if(data !== null){
      this.setState({showLoading: 1});
      this.setState({ payment: data});
      this.setState({showLoading: 0});

    }
  }
  updateStatus = async(status) =>{
    if(status == 'CREATED'){
      this.setState({showLoading: 1});
      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.post(`${baseUrl}/api/common/payment/underProcessing/${this.state.payment._id}`);
      if(res.status === 404){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      this.setState({ showLoading:0});
      ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
      this.handleGetData();
    }
    else if(status == 'UNDER_PROCESSING'){
      this.setState({ showLoading:1});
      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.post(`${baseUrl}/api/common/payment/completePayment/${this.state.payment._id}`);
      if(res.status === 404){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      this.setState({ showLoading:0});
      ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
      this.handleGetData();
    }
    else {
      ToastAndroid('Incorrect Option', ToastAndroid.SHORT)
    }
  }
  handleGetData = async() =>{
    this.setState({showLoading: 1});
      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.get(`${baseUrl}/api/common/payment/getOnePayment/${this.state.payment._id}`);
      if(res.status === 404){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      this.setState({ showLoading:0});
      this.setState({ payment: res.data});
  }

  render() {
    return (
      <View>
        {this.state.showLoading?<ActivityIndicator size="small" color="#00ff00" />:<Text></Text>}
        <Text style={{textAlign:'center',
        fontSize:25, color:'#9e9d24',
        fontWeight:'900'}}>Payment</Text>
        {this.state.payment?
         <View style={{alignItems:'center'}}>
         <Text style={{textAlign:'center', color:'#424242'}}>Account Holder Name: {this.state.payment.AccountHolderName}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Account Number: {this.state.payment.AccountNo}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Bank: {this.state.payment.BankName}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>IFSC: {this.state.payment.IfscCode}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>MICR: {this.state.payment.Micr}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Payment Amount: {this.state.payment.amount}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Payment Status: {this.state.payment.status}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Payment Request On: {this.state.payment.date}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Agent Email: {this.state.payment.userEmail}</Text>


         {
         this.state.payment.status == 'CREATED'?
         <TouchableOpacity
         style={{
           backgroundColor:'orange', width:150,height:50, borderRadius:25, marginTop:15}}
         onPress = {()=> this.updateStatus('UNDER_PROCESSING')}
         >
           <Text style={{textAlign:'center', textAlignVertical:'center'}}>PROCESSING</Text>
         </TouchableOpacity>:<Text></Text>
       }
       {
         this.state.payment.status === 'UNDER_PROCESSING'?
         <TouchableOpacity
         style={{
          backgroundColor:'orange', width:150,height:50, borderRadius:25, marginTop:15}}
         onPress = {()=> this.updateStatus('COMPLETE_PAYMENT')}
         >
           <Text style={{textAlign:'center', textAlignVertical:'center'}}>COMPLETE PAYMENT</Text>
         </TouchableOpacity>:<Text></Text>
       }
       {
         this.state.payment.status === 'COMPLETE_PAYMENT'?
           <Text>PAYMENT IS COMPLETED!</Text>:<Text></Text>
       }
       </View>
        :<Text></Text>
        }

      </View>
    )
  }
}