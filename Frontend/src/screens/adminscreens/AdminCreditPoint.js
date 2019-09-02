import React, { Component } from 'react'
import { StyleSheet, Text, View ,ScrollView,
  ActivityIndicator
  ,AsyncStorage,ToastAndroid} from 'react-native';
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
import ThreeAxisSensor from 'expo-sensors/build/ThreeAxisSensor';


  export default class AdminCreditPoint extends Component {
    constructor(props){
      super(props);
      this.state ={
        id:"",
        indianRupees:"",
        showLoading:0
      }
    }
    componentDidMount = async () =>{
      this.handleClear();
      this.handleGetData();
      // NetInfo.fetch().then(state => {
      //   if(state.isConnected == false){
      //     ToastAndroid.show('Please Turn On Internet', ToastAndroid.SHORT)
      //   }
      // });

    }
    handleGetData = async () =>{
      this.setState({showLoading:1})
      let user = await AsyncStorage.getItem('USER');
        user = JSON.parse(user);
        axios.defaults.headers.common["Authorization"] = user.token;

        let res = await axios.get(`${baseUrl}/api/admin/creditPoint/getvalue/getcreditPointValue`);
        if(res.status !== 200){
          ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
        }

        this.fillStateData(res.data);
    }

    checkValidation = () =>{
      if(this.state.indianRupees == ''){
        return false;
      }
      return true;
    }

    handleSave = async() => {
      if(this.checkValidation()){
        this.setState({ showLoading:1})
        let newCredit = {};

        newCredit.indianRupees = this.state.indianRupees;


        let user = await AsyncStorage.getItem('USER');
        user = JSON.parse(user);
        axios.defaults.headers.common["Authorization"] = user.token;

        let res = await axios.post(`${baseUrl}/api/admin/creditPoint/add`,newCredit);
        if(res.status !== 200){
          ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
        }
        this.setState({ showLoading:0})
        ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
        this.handleClear();
      }else{
        ToastAndroid.show('All fields mandetory to fill', ToastAndroid.SHORT);
      }
    }

    handleUpdate = async () =>{
      this.setState({ showLoading:1})
      let newCredit = {};

      newCredit.indianRupees = this.state.indianRupees;

      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;

      let res = await axios.post(`${baseUrl}/api/admin/creditPoint/updatecreditPointValue/${this.state.id}`,newCredit);
      if(res.status !== 200){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      ThreeAxisSensor.setState({showLoading:0});
      ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
      this.handleGetData();
    }

    handleClear = () =>{
      this.setState({
        id:"",
        indianRupees:""
      })
    }

    handleFillData = () =>{
      this.handleGetData();
    }

    fillStateData = (data) =>{
      if(data.length > 0){
        this.setState({
          showLoading:1,
          id:data[0]._id,
          indianRupees:data[0].indianRupees,
          showLoading:0
        })
      }
    }

    render() {
      return (
        <View>
          {this.state.showLoading?<ActivityIndicator size="small" color="#00ff00" />:<Text></Text>}
        <Text>Bonus</Text>
        <KeyboardAwareScrollView
        enableOnAndroid={true}
        // extraHeight={130}
        extraScrollHeight={90}
        >
        <Container style={{height: '100%'}}>
        <NavigationEvents onDidFocus={() => this.handleFillData()} />
        <Grid>

        <Row size={95} style={{backgroundColor:'#fff',marginBottom: 0, justifyContent:'space-around'}}>
        <Content>
        <Form>
          <Text style={{textAlign:'center', fontSize:23}}>1 Reward Point Equal </Text>
        <Item floatingLabel  style={{margin:8}}>
          <Label>In Indan Rupee</Label>
            <Input
            keyboardType="number-pad"
            value={this.state.indianRupees}
            onChangeText={(indianRupees)=>this.setState({indianRupees})}
            />
        </Item>
        </Form>
        {this.state.id?
        <Button block
        style={{height:60, margin:8, marginBottom:20}}
        onPress={()=> this.handleUpdate()}
        >
        <Text>Update</Text>
        </Button>
        :
        <Button block
        style={{height:60, margin:8, marginBottom:20}}
        onPress={()=> this.handleSave()}
        >
        <Text>Update</Text>
        </Button>
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
        </View>
        )
      }
    }