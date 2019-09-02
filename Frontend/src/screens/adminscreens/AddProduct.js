import React, { Component } from 'react'
import { StyleSheet, Text, View ,ScrollView,AsyncStorage,
  ActivityIndicator,
  ToastAndroid} from 'react-native';
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
import { NavigationEvents } from "react-navigation";

import { baseUrl} from '../../../scretKey';

import axios from 'axios';

export default class AddProduct extends Component {
    constructor(props){
        super(props);
        this.state={
            id:"",
            productTitle:"",
            productOverview:"",
            purposeOfLoan:"",
            keyFeatures:"",
            processingFee:"",
            preClosureCharges:"",
            partPaymentCharges:"",
            otherCharges:"",
            specialSchemes:"",
            DocumentRequired:"",
            productCreditPoint:"",
            showLoading:0,
        }
    }
    componentDidMount = async () =>{
      this.handleClear();
      const data = this.props.navigation.dangerouslyGetParent().getParam('item');
      this.fillStateData(data);
      // NetInfo.fetch().then(state => {
      //   if(state.isConnected == false){
      //     ToastAndroid.show('Please Turn On Internet', ToastAndroid.SHORT)
      //   }
      // });

    }
    checkValidation = () =>{
        if(this.state.productTitle == '' ||
        this.state.productOverview == '' || this.state.purposeOfLoan == ''
        || this.state.keyFeatures == '' || this.state.processingFee ==''
        || this.state.preClosureCharges=='' ||this.state.partPaymentCharges == ''
        || this.state.otherCharges == '' || this.state.specialSchemes == ''
        || this.state.DocumentRequired == '' || this.state.productCreditPoint == ''
        ){
            return false;
        }
        return true;
    }
    handleSaveProduct = async() => {
        if(this.checkValidation()){
          this.setState({ showLoading:1})
            let newProduct = {
              productDescription:{
                keyFeatures:[],
                specialSchemes:[],
                DocumentRequired:[],
              }
            };

              //keyFeatures array create
              let kFeatures = [];
              if(this.state.keyFeatures !== ''){
                let keyFeaturesArr = this.state.keyFeatures.split(",");
                keyFeaturesArr.forEach((each, i) => {
                  kFeatures[i] = each.trim();
                });
              }
               //specialSchemes array create
               let sSchemes = [];
               if(this.state.specialSchemes !== ''){
                 let specialSchemesArr = this.state.specialSchemes.split(",");
                 specialSchemesArr.forEach((each, i) => {
                   sSchemes[i] = each.trim();
                 });
               }
                //DocumentRequired array create
              let DRequired = [];
              if(this.state.DocumentRequired !== ''){
                let DocumentRequiredArr = this.state.DocumentRequired.split(",");
                DocumentRequiredArr.forEach((each, i) => {
                  DRequired[i] = each.trim();
                });
              }

            newProduct.productTitle = this.state.productTitle;
            newProduct.productDescription.overview = this.state.productOverview;
            newProduct.productDescription.purposeOfLoan = this.state.purposeOfLoan;
            newProduct.productDescription.keyFeatures = kFeatures;
            newProduct.productDescription.processingFee = this.state.processingFee;
            newProduct.productDescription.preClosureCharges = this.state.preClosureCharges;
            newProduct.productDescription.partPaymentCharges = this.state.partPaymentCharges;
            newProduct.productDescription.otherCharges = this.state.otherCharges;
            newProduct.productDescription.specialSchemes = sSchemes;
            newProduct.productDescription.DocumentRequired = DRequired;
            newProduct.productCreditPoint = this.state.productCreditPoint;

            // console.log(newProduct);
            let user = await AsyncStorage.getItem('USER');
            user = JSON.parse(user);
            axios.defaults.headers.common["Authorization"] = user.token;

            let res = await axios.post(`${baseUrl}/api/admin/product/regProduct/${this.state.id}`,newProduct);
            if(res.status !== 200){
              ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
            }
            this.setState({ showLoading:0});
            ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
            this.handleClear();
            if(res.data.msg == 'Product Created successfully' || res.data.msg == 'Product Updated Successfully'){
              this.props.navigation.navigate('AllProduct');
            }
        }else{
            ToastAndroid.show('All fields mandetory to fill', ToastAndroid.SHORT);
        }
    }
    handleClear = () =>{
        this.setState({
          id:"",
          productTitle:"",
          productOverview:"",
          purposeOfLoan:"",
          keyFeatures:"",
          processingFee:"",
          preClosureCharges:"",
          partPaymentCharges:"",
          otherCharges:"",
          specialSchemes:"",
          DocumentRequired:"",
          productCreditPoint:"",
        })
    }
    handleFillData = () =>{
      this.handleClear();
      const data = this.props.navigation.dangerouslyGetParent().getParam('item');
      this.fillStateData(data);
    }
    fillStateData = (data) =>{
      if(data !== undefined){
        this.setState({showLoading:1})
        this.setState({
            id:data._id,
            productTitle:data.productTitle,
            productOverview:data.productDescription.overview,
            purposeOfLoan:data.productDescription.purposeOfLoan,
            keyFeatures:data.productDescription.keyFeatures?data.productDescription.keyFeatures.join(","):"",
            processingFee:data.productDescription.processingFee,
            preClosureCharges:data.productDescription.preClosureCharges,
            partPaymentCharges:data.productDescription.partPaymentCharges,
            otherCharges:data.productDescription.otherCharges,
            specialSchemes:data.productDescription.specialSchemes?data.productDescription.specialSchemes.join(","):"",
            DocumentRequired:data.productDescription.DocumentRequired?data.productDescription.DocumentRequired.join(","):"",
            productCreditPoint:data.productCreditPoint+"",
        })
        this.setState({showLoading:0})
      }
    }
    handleDelete = async()=>{
      this.setState({ showLoading:1})
        let user = await AsyncStorage.getItem('USER');
        user = JSON.parse(user);
        axios.defaults.headers.common["Authorization"] = user.token;
        let res = await axios.delete(`${baseUrl}/api/admin/product/delete/${this.state.id}`);
        if(res.status !== 200){
          ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
        }
        this.setState({ showLoading:0})
        ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
        this.handleClear();
        if(res.data.msg == 'Product Deleted successfully'){
          this.props.navigation.navigate('AllProduct');
        }
    }

    render() {
      return (
        <KeyboardAwareScrollView
        enableOnAndroid={true}
        // extraHeight={130}
        extraScrollHeight={90}
        >
            <Container style={{height: '100%'}}>
            {this.state.showLoading?<ActivityIndicator size="small" color="#00ff00" />:<Text></Text>}
            <NavigationEvents onDidFocus={() => this.handleFillData()} />
                <Grid>
                <Row size={5} style={{backgroundColor:'#fff', justifyContent:'center', alignItems:'center',marginBottom: 0}}>
                    <Text style={{alignSelf:'center'}}>Add a new Loan or Policy</Text>
                </Row>
                <Row size={95} style={{backgroundColor:'#fff',marginBottom: 0, justifyContent:'space-around'}}>
                    <Content>
                        <Form>
                            <Item floatingLabel style={{margin:8}}>
                                <Label>Title</Label>
                                { this.state.id?
                                <Text>{this.state.productTitle}</Text>

                                 :
                                 <Input
                                value={`${this.state.productTitle}`}
                                onChangeText={(productTitle)=>this.setState({productTitle})}
                                 />
                                }
                            </Item>
                            <Label style={{margin:8}}>OverView</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={3} placeholder="OverView"
                                value={`${this.state.productOverview}`}
                                onChangeText={(productOverview)=>this.setState({productOverview})}
                            />
                            <Label style={{margin:8}}>Purpose of Loan</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={3} placeholder="Purpose of Loan"
                                value={this.state.purposeOfLoan}
                                onChangeText={(purposeOfLoan)=>this.setState({purposeOfLoan})}
                            />
                            <Label style={{margin:8}}>Key Features</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={3}
                                placeholder="Enter Key Features with (,) seperated each feature eg. Low interest,less documentations"
                                value={this.state.keyFeatures}
                                onChangeText={(keyFeatures)=>this.setState({keyFeatures})}
                            />
                            <Label style={{margin:8}}>Processing Fee</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={2} placeholder="Processing Fee"
                                value={this.state.processingFee}
                                onChangeText={(processingFee)=>this.setState({processingFee})}
                            />
                            <Label style={{margin:8}}>Pre Closure Charges</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={2} placeholder="Pre Closure Charges"
                                value={this.state.preClosureCharges}
                                onChangeText={(preClosureCharges)=>this.setState({preClosureCharges})}
                            />
                            <Label style={{margin:8}}>Part Payment Charges</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={2} placeholder="Part Payment Charges"
                                value={this.state.partPaymentCharges}
                                onChangeText={(partPaymentCharges)=>this.setState({partPaymentCharges})}
                            />
                            <Label style={{margin:8}}>Other Charges</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={2} placeholder="Other Charges"
                                value={this.state.otherCharges}
                                onChangeText={(otherCharges)=>this.setState({otherCharges})}
                            />
                            <Label style={{margin:8}}>Schemes</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={3}
                                placeholder="Enter Schemes with (,) seperated each feature eg. Synd Saral,Personal Loan for Salaried"
                                value={this.state.specialSchemes}
                                onChangeText={(specialSchemes)=>this.setState({specialSchemes})}
                            />
                            <Label style={{margin:8}}>Documents Required</Label>
                            <Textarea style={{margin:9}}
                                rowSpan={3}
                                placeholder="Enter Document Required with (,) seperated each feature eg. Income Proof ,Voter Id"
                                value={this.state.DocumentRequired}
                                onChangeText={(DocumentRequired)=>this.setState({DocumentRequired})}
                            />
                             <Label style={{margin:8}}>Reward Point</Label>
                            {/* <Textarea style={{margin:9}}
                                rowSpan={1}
                                placeholder="Enter Reward Point"
                                value={this.state.productCreditPoint}
                                onChangeText={(productCreditPoint)=>this.setState({productCreditPoint})}
                            /> */}
                            <Item floatingLabel  style={{margin:8}}>
                                <Label>Reward Point</Label>
                                <Input
                                keyboardType="number-pad"
                                value={this.state.productCreditPoint}
                                onChangeText={(productCreditPoint)=>this.setState({productCreditPoint})}
                                 />
                            </Item>
                        </Form>
                        <Button block
                            style={{height:60, margin:8, marginBottom:20}}
                            onPress={()=> this.handleSaveProduct()}
                            >
                            {this.state.id?<Text>Update</Text>:<Text>Save</Text>}
                        </Button>
                        {
                          this.state.id?
                        <Button block
                            style={{height:60, margin:8, marginBottom:20}}
                            onPress={()=> this.handleDelete()}
                            >
                            <Text>Delete</Text>
                        </Button>:<Text></Text>
                        }
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