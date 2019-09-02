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

export default class AllCustomer extends Component {
  constructor(props){
    super(props);
    this.state={
      firstQuery: '',
      customers:[],
      showLoading:0
    }
  }
  componentDidMount = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/common/customerRead/getAll`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ customers: res.data})
  }

  handleGetData = async(searchText) =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/common/customerRead/getAll/${searchText}`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ customers: res.data})
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
                  placeholder="Type ID or name.."
                  onChangeText={query => { this.handleGetData(query)}}
                  // value={this.state.firstQuery}
                />
              </Row>
              <Row size={80} >
                <List style={{width:'100%'}}>
                {
                  this.state.customers.length > 0 || this.state.showLoading ?
                  this.state.customers.length > 0 ?
                  (
                    this.state.customers.map((each, index)=>(

                                <ListItem icon
                                key={index}
                                onPress={()=>this.props.navigation.navigate('SingleCustomer',{'item':each})}
                                // onPress={()=>alert(each._id)}
                                  >
                                    <Body>
                                      <Text>{each.name}</Text>
                                    </Body>
                                    <Right>
                                      <Ionicons name="ios-arrow-forward" size={30} />
                                    </Right>
                                </ListItem>
                    ))
                  )
                  :<Text>No Data Available!</Text>
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