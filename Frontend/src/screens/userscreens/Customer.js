import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base';

export default class Customer extends Component {
  constructor(props){
    super(props);
    this.state ={
      customer:null
    }
  }
  componentDidMount(){

    const { navigation } = this.props;
    const data = navigation.getParam('data', 'NO-data');
    if(data !== null){
      this.setState({ customer: data});
    }
  }
  render() {
    return (
      <View>
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
       </View>
        :<Text></Text>}

      </View>
    )
  }
}