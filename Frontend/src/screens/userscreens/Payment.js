import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base';

export default class Payment extends Component {
  constructor(props){
    super(props);
    this.state ={
      payment:null
    }
  }
  componentDidMount(){

    const { navigation } = this.props;
    const data = navigation.getParam('data', 'NO-data');
    if(data !== null){
      this.setState({ payment: data});
    }
  }
  render() {
    return (
      <View>
        <Text style={{textAlign:'center',
        fontSize:25, color:'#9e9d24',
        fontWeight:'900'}}>Payment</Text>
        {this.state.payment?
        <View>
        <Text style={{textAlign:'center', color:'#424242'}}>Payment Id: {this.state.payment._id}</Text>
        <Text style={{textAlign:'center', color:'#424242'}}>Request On: {this.state.payment.date}</Text>
        <Text style={{textAlign:'center', color:'#424242'}}>Amount: {this.state.payment.amount}</Text>
        <Text style={{textAlign:'center', color:'#424242'}}>Status: {this.state.payment.status}</Text>
       </View>
        :<Text></Text>}

      </View>
    )
  }
}