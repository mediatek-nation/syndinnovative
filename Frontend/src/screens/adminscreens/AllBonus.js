import React, { Component } from 'react'
import {  View,ActivityIndicator,AsyncStorage,FlatList,TouchableOpacity } from 'react-native'
import { Button, Container, Content,List, ListItem, Text,Left, Right,Icon,Body } from 'native-base';
import {Row, Grid} from 'react-native-easy-grid'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Searchbar } from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons'
import { NavigationEvents } from "react-navigation";


import { baseUrl} from '../../../scretKey';
import axios from 'axios';

export default class AllBonus extends Component {
  constructor(props){
    super(props);
    this.state={
      firstQuery: '',
      allBonus:[],
      showLoading: 0
    }
  }
  componentDidMount = async() =>{

    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;

    let res = await axios.get(`${baseUrl}/api/admin/bonus/getAll`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ allBonus: res.data})
  }

  handleGetData = async(searchText) =>{
    let user = await AsyncStorage.getItem('USER');
    user = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = user.token;
    let res = await axios.get(`${baseUrl}/api/admin/bonus/getAll/${searchText}`);
    if(res.status !== 200){
      ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
    }
    this.setState({ showLoading:1});
    this.setState({ allBonus: res.data})
  }
  onPressBonus = (item)=>{
    this.props.navigation.navigate('EditBonus', {'item': item });
  }
  renderBonus = ({ item }) => (
    <TouchableOpacity  onPress={() => this.onPressBonus(item)} >
    <View style={{alignItems:'center', borderBottomWidth:1, borderBottomColor:'orange', marginVertical:4}}>
    <Text style={{textAlign:'center'}}>Reward Point: {item.creditPoint}</Text>
    <Text style={{textAlign:'center'}}>Bonus Point: {item.bonusCreditPoint}</Text>
    <Text style={{textAlign:'center'}}>Position: Level {item.agentLabel}</Text>
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
            <NavigationEvents onDidFocus={() => this.handleGetData("")} />
              <Row size={20}>
                <Searchbar
                style={{width:'100%'}}
                  placeholder="Type reward point or level.."
                  onChangeText={query => { this.handleGetData(query)}}
                  // value={this.state.firstQuery}
                />
              </Row>
              <Row size={80} >
                <List style={{width:'100%'}}>
                {
                  this.state.allBonus.length > 0 || this.state.showLoading ?
                  this.state.allBonus.length > 0 ?
                    <FlatList
                    style={{marginTop:5, marginBottom:10,}}
                    vertical
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    data={this.state.allBonus}
                    renderItem={this.renderBonus}
                    keyExtractor={item => `${item._id}`}
                    />
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