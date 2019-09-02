import React, { Component } from 'react'
import {  View,FlatList ,ActivityIndicator,TouchableOpacity,AsyncStorage,ToastAndroid} from 'react-native'
import { Button, Container, Content,List, ListItem, Text,Left, Right,Icon,Body } from 'native-base';
import {Row, Grid} from 'react-native-easy-grid'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { NavigationEvents } from "react-navigation";


import {baseUrl} from '../../../scretKey';
import axios from 'axios';


export default class CashHistory extends Component {
  constructor(props){
    super(props);
    this.state={
      withdrawMoney:[],
      showLoading:0
    }
  }

  componentDidMount = async() =>{
    this.setState({showLoading:1})
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;

    let res = await axios.get(`${baseUrl}/api/user/creditPoint/getPaymentHistory/getAll`);
    if(res.status == 404){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ withdrawMoney: res.data, showLoading:1})

  }

  handleGetData = async() =>{
    this.setState({showLoading:1})
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/user/creditPoint/getPaymentHistory/getAll`);
    if(res.status == 404){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ withdrawMoney: res.data, showLoading:1});
  }
  renderHistory = ({ item }) => (
    <TouchableOpacity >
    <View style={{alignItems:'center', borderBottomWidth:1, borderBottomColor:'orange', marginVertical:4}}>
    <Text style={{textAlign:'center'}}>Amount: {item.withdrawAmount}</Text>
    <Text style={{textAlign:'center'}}>Date Point: {item.withdrawDate}</Text>
    </View>
    </TouchableOpacity>
    );

  render() {
    return (
      <KeyboardAwareScrollView
      extraScrollHeight={90}
      >
        <Container>
          <Content>
            <Grid>
            <NavigationEvents onDidFocus={() => this.handleGetData()} />

              <Row>
                {
                  this.state.withdrawMoney.length > 0 || this.state.showLoading ?

              (
                this.state.withdrawMoney.length >0 ?
                <FlatList
                style={{marginTop:5, marginBottom:10,}}
                vertical
                showsVerticalScrollIndicator={false}
                numColumns={1}
                data={this.state.withdrawMoney}
                renderItem={this.renderHistory}
                keyExtractor={item => `${item._id}`}
                />
                :
                <Text>No Data Available!</Text>
              ):
                <ActivityIndicator size="small" color="#00ff00" />
              }
              </Row>
            </Grid>
          </Content>
        </Container>
      </KeyboardAwareScrollView>
    )
  }
}