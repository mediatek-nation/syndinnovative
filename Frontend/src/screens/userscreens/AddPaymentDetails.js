import React, { Component } from 'react'
import { StyleSheet, Text, View ,ScrollView,TextInput, ActivityIndicator, ToastAndroid, AsyncStorage} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {Container,
    Content,
    Thumbnail,
    Form,
    Item,
    Label,
    Icon ,
    Input,Button,Textarea,Picker} from 'native-base'
import { Row, Grid } from 'react-native-easy-grid';

import {baseUrl} from '../../../scretKey';

import axios from 'axios';

export default class AddPaymentDetails extends Component {
    constructor(props){
        super(props);
        this.state={
            accountHolderName:"",
            bankName:"",
            accountNo:"",
            ifscCode:"",
            micr:"",
            availableAmount:'',
            availableCreditPoint:'',
            creditPointEncash:'',
            amount:"",
            showLoading:0,
            onePointval:""
        }
    }

    checkValidation = () =>{
        if(this.state.accountHolderName == ''
        ||  this.state.bankName == '' || this.state.accountNo == ''
        ||  this.state.ifscCode == '' || this.state.micr == ''
        // ||  this.state.availableAmount == '' || this.state.availableAmount == '0'
        // ||  this.state.availableCreditPoint == '' || this.state.availableCreditPoint == '0'
        ||  this.state.creditPointEncash == ''
        ){
            return false;
        }
        return true;
    }

    componentDidMount = () =>{
        const data = this.props.navigation.getParam('item', 'NO-data');
        this.setState({ availableAmount:data.rupees, availableCreditPoint: data.currentCreditPoint})
    }

    handleRequestPayment = async() => {

        if(this.checkValidation()){
            if( +this.state.creditPointEncash > +this.state.availableCreditPoint ){
                alert('You have Not Enough Point');
            } else if( +this.state.availableCreditPoint == 0) {
                alert('You have Not Enough Point');
            }
            else{
                this.setState({ showLoading:1})
                let onePointval = +this.state.availableAmount / +this.state.availableCreditPoint ;
                this.setState({onePointval:onePointval});
                let amountMoney = +this.state.creditPointEncash * onePointval;
                let availablecreditPointCount =+this.state.availableCreditPoint -  +this.state.creditPointEncash;

                //now make an payment obj and call backend
                let newPayment = {
                    accountHolderName: this.state.accountHolderName,
                    bankName: this.state.bankName,
                    accountNo: this.state.accountNo,
                    ifscCode: this.state.ifscCode,
                    micr: this.state.micr,
                    amount: amountMoney,
                    availableCreditPoint: availablecreditPointCount
                };
                let user = await AsyncStorage.getItem('USER');
                user = JSON.parse(user);
                axios.defaults.headers.common["Authorization"] = user.token;
                let res = await axios.post(`${baseUrl}/api/common/payment/saveAgentBankDetails`, newPayment);
                ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
                this.handleClear();
                this.setState({ showLoading:0});
                this.handleGetData();
            }
        }else{
            ToastAndroid.show('All fields mandetory to fill', ToastAndroid.SHORT);
        }
    }
    handleClear = () =>{
        this.setState({
            accountHolderName:"",
            bankName:"",
            accountNo:"",
            ifscCode:"",
            micr:"",
            creditPointEncash:null,
            amount:"",
            showLoading:0
        })
    }
    handleGetData= async () =>{
        this.setState({showLoading:1});
        let user = await AsyncStorage.getItem('USER');
        user = JSON.parse(user);
        axios.defaults.headers.common["Authorization"] = user.token;
        let res = await axios.get(`${baseUrl}/api/user/creditPoint/getCreditPointAndRupees`);
        if(res.status == 404){
          ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
        }
        this.setState({
            availableCreditPoint:res.data.currentCreditPoint,
            availableAmount: +this.state.onePointval * res.data.currentCreditPoint,
            point: res.data,
            showLoading:0
        })
    }


    render() {
      return (
        <KeyboardAwareScrollView
        enableOnAndroid={true}
        // extraHeight={130}
        extraScrollHeight={90}
        >
            <Container style={{height: '100%'}}>
                {this.state.availableAmount >= 0 && this.state.availableCreditPoint >= 0 ?
                <View>
                        <Text style={{textAlign:'center'}}>Point Available: {this.state.availableCreditPoint}</Text>
                        <Text style={{textAlign:'center'}}>Amount Available: {this.state.availableAmount}</Text>
                </View>:<Text>You have No Credit Point!</Text>}

            {this.state.showLoading?<ActivityIndicator size="small" color="#00ff00" />:<Text></Text>}
                <Grid>
                <Row size={5} style={{backgroundColor:'#fff', justifyContent:'center', alignItems:'center',marginBottom: 0}}>
                    <Text style={{alignSelf:'center'}}>Request A payment</Text>
                </Row>
                <Row size={95} style={{backgroundColor:'#fff',marginBottom: 0, justifyContent:'space-around'}}>
                    <Content>
                        <Form>
                            <Item floatingLabel style={{margin:8}}>
                                <Label>AccountHolderName</Label>
                                <Input
                                value={this.state.accountHolderName}
                                onChangeText={(accountHolderName)=>this.setState({accountHolderName})}
                                 />
                            </Item>
                            <Item floatingLabel  style={{margin:8}}>
                                <Label>BankName</Label>
                                <Input
                                value={this.state.bankName}
                                onChangeText={(bankName)=>this.setState({bankName})}
                                 />
                            </Item>
                            <Item floatingLabel  style={{margin:8}}>
                                <Label>AccountNo</Label>
                                <Input
                                value={this.state.accountNo}
                                onChangeText={(accountNo)=>this.setState({accountNo})}
                                 />
                            </Item>
                            <Item floatingLabel  style={{margin:8}}>
                                <Label>Ifsc Code</Label>
                                <Input
                                value={this.state.ifscCode}
                                onChangeText={(ifscCode)=>this.setState({ifscCode})}
                                 />
                            </Item>
                            <Item floatingLabel  style={{margin:8}}>
                                <Label>Micr</Label>
                                <Input
                                value={this.state.micr}
                                onChangeText={(micr)=>this.setState({micr})}
                                 />
                            </Item>
                            <Item floatingLabel  style={{margin:8}}>
                                <Label>Point</Label>
                                <Input
                                keyboardType="number-pad"
                                value={this.state.creditPointEncash}
                                onChangeText={(creditPointEncash)=>this.setState({creditPointEncash})}
                                 />
                            </Item>
                        </Form>
                        <Button block
                            style={{height:60, margin:8, marginBottom:20}}
                            onPress={()=> this.handleRequestPayment()}
                            >
                            <Text>Save</Text>
                        </Button>
                        <Button block
                            style={{height:60, margin:8, marginBottom:20}}
                            onPress={()=> this.handleClear()}
                            >
                            <Text>Clear</Text>
                        </Button>
                    </Content>
                </Row>
                </Grid>
            </Container>
        </KeyboardAwareScrollView>
      )
    }
  }


  const styles = StyleSheet.create({
    profileImage:{
      flex:1,
      // alignItems:'center', //vertical center
      justifyContent:'center', //horizontal center
      marginBottom: 20,
      // padding:10
    },
    formUser:{
      // marginTop:10
    },
    content: {
      marginBottom: 20,
  },
  lastRow: {
      marginBottom: 0,
  }
  })