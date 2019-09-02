import React, { Component } from 'react'
import {  View,ActivityIndicator,AsyncStorage,ToastAndroid } from 'react-native'
import { Button, Container, Content,List, ListItem, Text,Left, Right,Icon,Body } from 'native-base';
import {Row, Grid} from 'react-native-easy-grid'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Ionicons} from '@expo/vector-icons'
import { NavigationEvents } from "react-navigation";


import { baseUrl} from '../../../scretKey';
import axios from 'axios';

export default class Notification extends Component {
  constructor(props){
    super(props);
    this.state={
      firstQuery: '',
      notifications:[],
      showLoading:0
    }
  }
  componentDidMount = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/common/notification/getNotification`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ notifications: res.data,showLoading:1})
  }

  handleGetData = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/common/notification/getNotification`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ notifications: res.data,showLoading:1})
  }

  updateNotificationStatus = async (id) =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.post(`${baseUrl}/api/common/notification/updateNotificationStatus/${id}`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({showLoading:1})
    ToastAndroid.show(res.data, ToastAndroid.SHORT);
    this.handleGetData();
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
              <Row size={80} >
                <List style={{width:'100%'}}>
                  {
                    this.state.notifications.length > 0 || this.state.showLoading ?(
                      this.state.notifications.length > 0?
                      this.state.notifications.map(each=>(
                        <ListItem icon
                        key={each._id}
                        onPress={()=>this.updateNotificationStatus(each._id)}
                        >
                          <Body>
                            <Text>The Loan of {each.name} is Approved. </Text>
                          </Body>
                          <Right>
                            <Ionicons name="ios-arrow-forward" size={30} />
                          </Right>
                      </ListItem>
                      ))
                      :<Text>No Data Available!</Text>
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