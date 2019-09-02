import React, { Component } from 'react'
import {  View ,ActivityIndicator,AsyncStorage} from 'react-native'
import { Button, Container, Content,List, ListItem, Text,Left, Right,Icon,Body } from 'native-base';
import {Row, Grid} from 'react-native-easy-grid'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Searchbar } from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons'
import { NavigationEvents } from "react-navigation";


import {baseUrl} from '../../../scretKey';
import axios from 'axios';


export default class PaymentAgent extends Component {
  constructor(props){
    super(props);
    this.state={
      firstQuery: '',
      payments:[],
      showLoading:0
    }
  }
  componentDidMount = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;

    let res = await axios.get(`${baseUrl}/api/common/payment/getAllPaymentwithstatus`);
    if(res.status === 404){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ payments: res.data, showLoading:1})
  }

  handleGetData = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/common/payment/getAllPaymentwithstatus`);
    if(res.status === 404){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ payments: res.data, showLoading:1})
  }

  render() {
    return (
      <KeyboardAwareScrollView
      extraScrollHeight={90}
      >
        <Container>
          <Content>
            <Grid>
            <NavigationEvents onDidFocus={() => this.handleGetData()} />

              <Row size={100} >
                <List style={{width:'100%'}}>
                {
                  this.state.payments.length > 0  || this.state.showLoading ?

              (
                this.state.payments.length > 0?
                this.state.payments.map((each, index)=>(
                  <ListItem icon
                  key={index}
                    onPress={()=>this.props.navigation.navigate('Payment',{'data':each})}
                    >
                      <Body>
                        <Text>{each.amount}</Text>
                      </Body>
                      <Right>
                        <Ionicons name="ios-arrow-forward" size={30} />
                      </Right>
                  </ListItem>
                ))
                : <Text>No Data Available!</Text>
              ):
                <ActivityIndicator size="small" color="#00ff00" />
              }
              </List>
              </Row>
            </Grid>
          </Content>
        </Container>
      </KeyboardAwareScrollView>
    )
  }
}