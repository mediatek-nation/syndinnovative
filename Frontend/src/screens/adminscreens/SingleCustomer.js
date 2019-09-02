import React, { Component } from 'react'
import { Text, View,TouchableOpacity,ToastAndroid, ActivityIndicator, AsyncStorage } from 'react-native'
import { Button } from 'native-base';
import { NavigationEvents } from "react-navigation";

import { baseUrl} from '../../../scretKey';

import axios from 'axios';

export default class SingleCustomer extends Component {
  constructor(props){
    super(props);
    this.state ={
      customer:null,
      showLoading:0
    }
  }
  componentDidMount(){
    const { navigation } = this.props;
    const data = navigation.getParam('item', 'NO-data');
    if(data !== null){
      this.setState({showLoading: 1});
      this.setState({ customer: data});
      this.setState({showLoading: 0});

    }
  }
  updateStatus = async(status) =>{
    if(status == 'PENDING_FOR_CIBIL_SCORE'){
      this.setState({showLoading: 1});
      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.post(`${baseUrl}/api/admin/customer/pendingForCibilScore/${this.state.customer._id}`);
      if(res.status !== 200){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      this.setState({ showLoading:0});
      ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
      this.handleGetData();
    }
    else if(status == 'CIBIL_SCORE_COMPLETE'){
      this.setState({ showLoading:1});
      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.post(`${baseUrl}/api/admin/customer/completeCibileScore/${this.state.customer._id}`);
      if(res.status !== 200){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      this.setState({ showLoading:0});
      ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
      this.handleGetData();
    }
    else if(status == 'LOAN_APPROVED'){
      this.setState({ showLoading:1});
      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.post(`${baseUrl}/api/admin/customer/loanApprovedComplete/${this.state.customer._id}`);
      if(res.status !== 200){
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
    this.setState({ showLoading:1});
    let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.get(`${baseUrl}/api/common/customerRead/getOne/${this.state.customer._id}`);
      if(res.status !== 200){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      this.setState({ showLoading:0});
      this.setState({ customer: res.data});
  }
  render() {
    return (
      <View>
        {this.state.showLoading?<ActivityIndicator size="small" color="#00ff00" />:<Text></Text>}
        <Text style={{textAlign:'center',
        fontSize:25, color:'#9e9d24',
        fontWeight:'900'}}>Customer</Text>
        {this.state.customer?
         <View style={{alignItems:'center'}}>
         <Text style={{textAlign:'center', color:'#424242'}}>Customer Name: {this.state.customer.name}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Customer Email: {this.state.customer.email}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Customer Id: {this.state.customer.idProof.idProofNumber}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Customer Loan: {this.state.customer.loanTitle}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Customer Status: {this.state.customer.currentStatus}</Text>
       {
         this.state.customer.currentStatus === 'CREATED'?

         <TouchableOpacity
         style={{
           backgroundColor:'orange', width:150,height:50, borderRadius:25, marginTop:15}}
         onPress = {()=> this.updateStatus('PENDING_FOR_CIBIL_SCORE')}
         >
           <Text style={{textAlign:'center', textAlignVertical:'center'}}>CIBILSCORE CHECK</Text>
         </TouchableOpacity>:<Text></Text>
       }
       {
         this.state.customer.currentStatus === 'PENDING_FOR_CIBIL_SCORE'?
         <TouchableOpacity
         style={{
          backgroundColor:'orange', width:150,height:50, borderRadius:25, marginTop:15}}
         onPress = {()=> this.updateStatus('CIBIL_SCORE_COMPLETE')}
         >
           <Text style={{textAlign:'center', textAlignVertical:'center'}}>CIBILSCORE COMPLETE</Text>
         </TouchableOpacity>:<Text></Text>
       }
       {
         this.state.customer.currentStatus === 'CIBIL_SCORE_COMPLETE'?
         <TouchableOpacity
         style={{
          backgroundColor:'orange', width:150,height:50, borderRadius:25, marginTop:15}}
         onPress = {()=> this.updateStatus('LOAN_APPROVED')}
         >
           <Text style={{textAlign:'center', textAlignVertical:'center'}}>LOAN APPROVE</Text>
         </TouchableOpacity>:<Text></Text>
       }
       {
         this.state.customer.currentStatus === 'LOAN_APPROVED'?
           <Text>LOAN APPROVED SUCCESFULLY</Text>:<Text></Text>
       }
       </View>
        :<Text></Text>
        }

      </View>
    )
  }
}