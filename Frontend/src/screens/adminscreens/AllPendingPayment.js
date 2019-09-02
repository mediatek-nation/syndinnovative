import React, { Component } from 'react'
import {  View,ActivityIndicator,AsyncStorage } from 'react-native'
import { Button, Container, Content,List, ListItem, Text,Left, Right,Icon,Body } from 'native-base';
import {Row, Grid} from 'react-native-easy-grid'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Searchbar } from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons'
import { NavigationEvents } from "react-navigation";


import { baseUrl} from '../../../scretKey';
import axios from 'axios';

export default class AllPendingPayment extends Component {
  constructor(props){
    super(props);
    this.state={
      firstQuery: '',
      payments:[],
      showLoading: 0
    }
  }
  componentDidMount = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/common/payment/getAllPaymentRequests`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ payments: res.data})
  }

  handleGetData = async(searchText) =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/common/payment/getAllPaymentRequests/${searchText}`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ payments: res.data})
  }
  render() {
    return (
      <KeyboardAwareScrollView
      extraScrollHeight={90}
      >
        <Container>
          <Content>
            <Grid>
            <NavigationEvents onDidFocus={() => this.handleGetData("")} />
              <Row size={20}>
                <Searchbar
                style={{width:'100%'}}
                  placeholder="Type agent email."
                  onChangeText={query => { this.handleGetData(query)}}
                  // value={this.state.firstQuery}
                />
              </Row>
              <Row size={80} >
                <List style={{width:'100%'}}>
                {
                  this.state.payments.length > 0 || this.state.showLoading?
                  this.state.payments.length > 0 ?
                  (
                    this.state.payments.map((each, index)=>(

                                <ListItem icon
                                key={index}
                                onPress={()=>this.props.navigation.navigate('SinglePayment',{'item':each})}
                                // onPress={()=>alert(each._id)}
                                  >
                                    <Left><Text>{each.userEmail}</Text></Left>
                                    <Body>
                                      <Text>{each.amount}</Text>
                                    </Body>
                                    <Right>
                                      <Ionicons name="ios-arrow-forward" size={30} />
                                    </Right>
                                </ListItem>
                    ))
                  )
                  :<Text>NO Data Available!</Text>
             :
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