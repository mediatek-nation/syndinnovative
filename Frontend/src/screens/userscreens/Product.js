import React, { Component } from 'react'
import { Text, View, BackHandler } from 'react-native'
import { Button } from 'native-base';

export default class Product extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
}
handleBackButtonClick = () =>{
  return false;
}
  constructor(props){
    super(props);
    this.state ={
      product:null
    }
  }
  componentDidMount(){
    const { navigation } = this.props;
    const data = navigation.getParam('data', 'NO-data');
    if(data !== null){
      this.setState({ product: data});
    }
  }
  render() {
    return (
      <View>
        <Text style={{textAlign:'center',
        fontSize:25, color:'#9e9d24',
        fontWeight:'900'}}>Plan</Text>
        {this.state.product?
         <View style={{alignItems:'center'}}>
         <Text style={{textAlign:'center', color:'#424242'}}>{this.state.product.productTitle}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Reward Point: {this.state.product.productCreditPoint}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>OverView: {this.state.product.productDescription.overview}</Text>

         <Text style={{fontSize:30}}>Key Features</Text>
        {
                  this.state.product.productDescription.keyFeatures.length > 0 ?
              (
                  this.state.product.productDescription.keyFeatures.map((each, index)=>(
                    <Text key={index}>{each}</Text>
                  ))
              ):
                <Text></Text>
        }
         <Text style={{fontSize:30}}>Special Schemes</Text>
        {
                  this.state.product.productDescription.specialSchemes.length > 0 ?
              (
                  this.state.product.productDescription.specialSchemes.map((each, index)=>(
                    <Text key={index}>{each}</Text>
                  ))
              ):
                <Text></Text>
        }

      <Text style={{fontSize:30}}> Documents Required</Text>
        {
                  this.state.product.productDescription.DocumentRequired.length > 0 ?
              (
                  this.state.product.productDescription.DocumentRequired.map((each, index)=>(
                    <Text key={index}>{each}</Text>
                  ))
              ):
                <Text></Text>
        }
         <Text style={{textAlign:'center', color:'#424242'}}>Purpose: {this.state.product.productDescription.purposeOfLoan?this.state.product.productDescription.purposeOfLoan:"NA" }</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Processing Fee: {this.state.product.productDescription.processingFee?this.state.product.productDescription.processingFee:"NA"}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Pre Closure Charges: {this.state.product.productDescription.preClosureCharges?this.state.product.productDescription.preClosureCharges:"NA"}</Text>
         <Text style={{textAlign:'center', color:'#424242'}}>Part payment Charges: {this.state.product.productDescription.partPaymentCharges?this.state.product.productDescription.partPaymentCharges:"NA"}</Text>
       </View>
        :<Text></Text>}

      </View>
    )
  }
}
