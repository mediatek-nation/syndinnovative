import React, { Component } from 'react'
import {  View,ActivityIndicator,AsyncStorage,TouchableHighlight,FlatList } from 'react-native'
import { Button, Container, Content,List, ListItem, Text,Left, Right,Icon,Body } from 'native-base';
import {Row, Grid} from 'react-native-easy-grid'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Searchbar } from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons'

import { NavigationEvents } from "react-navigation";


import { baseUrl} from '../../../scretKey';
import axios from 'axios';

export default class AllAgent extends Component {
  constructor(props){
    super(props);
    this.state={
      firstQuery: '',
      agents:[],
      showLoading:0
    }
  }
  componentDidMount = async() =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;

    let res = await axios.get(`${baseUrl}/api/admin/creditPoint`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ agents: res.data})
  }

  handleGetData = async(searchText) =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/admin/creditPoint/${searchText}`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ agents: res.data})
  }
  renderAgents = ({ item }) => (
    <View style={{alignItems:'center', borderBottomWidth:1, borderBottomColor:'orange', marginVertical:4}}>
    <Text style={{textAlign:'center'}}>{item.agentName}</Text>
    <Text style={{textAlign:'center'}}>Level: {item.agentLabel}</Text>
    <Text style={{textAlign:'center'}}>Point: {item.agentCreditPoint}</Text>
    </View>
    );
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
        placeholder="Type Agent name.."
        onChangeText={query => { this.handleGetData(query)}}
        />
        </Row>
        <Row size={80} >
        <List style={{width:'100%'}}>
        {
          this.state.agents.length > 0 || this.state.showLoading ?
          this.state.agents.length > 0 ?
            <FlatList
            style={{marginTop:5, marginBottom:10,}}
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={1}
            data={this.state.agents}
            renderItem={this.renderAgents}
            keyExtractor={item => `${item._id}`}
            />
          : <Text>No Data Available!</Text>
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