import React, { Component } from 'react'
import { StyleSheet, Text, View ,ScrollView,AsyncStorage, ToastAndroid} from 'react-native';
import {Container, Content,Thumbnail,Form,Item,Label,Input,Button,H4} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import jwt_decode from "jwt-decode";
import * as Expo from "expo";
import { NavigationEvents } from "react-navigation";


import axios from 'axios';
import { baseUrl } from '../../../scretKey';

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.state ={
      joiningDate:"12-Jan-2019",
      lebels:"Lebel 1",
      email:"",
      name:"",
      mobile:null,
      profileImage:"https://i.ibb.co/cytsxWb/default-Men-Dp.png",
      signInType:"default"
    }
  }

  componentDidMount = async()=>{
    try {
      let result = await AsyncStorage.getItem('USER');
      result = JSON.parse(result);
      const decodedUser = jwt_decode(result.token);
      // console.log(decodedUser);
      if (decodedUser !== null) {
        // We have data!!
        //collect all data
        let data = {
          isAdmin: decodedUser.isAdmin,
          email: decodedUser.email
        }
        axios.post(`${baseUrl}/api/common/auth/getUserData`,data )
        .then(res=>{
          console.log(res.data);
          let jointDt = res.data.joiningDate.split("T")[0].split("-").reverse().join("-")
          this.setState({
            email: res.data.email,
            name: res.data.name,
            mobile:res.data.mobile? res.data.mobile:null,
            joiningDate:jointDt?jointDt:"",
            lebels: res.data.labels? res.data.labels:"0",
            profileImage: decodedUser.profileImage?decodedUser.profileImage: this.state.profileImage ,
            signInType:result.signInType
          })
        })

      }else{
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
      alert('problem while getting data')
    }
  }

  handleDeleteAccount = async() =>{
    confirm('Are you sure?');
    alert('account is deleted now!')
  }

  handleLogout = async() =>{
    let result = await AsyncStorage.getItem('USER');
      result = JSON.parse(result);
      if(result.signInType === 'google'){
        await Expo.Google.logOutAsync({
          androidClientId:
          "182867259493-1n2dcoq4isd0reck2593t5mmkaq5vpmr.apps.googleusercontent.com",
          accessToken:result.accessToken
        })
      }
      await AsyncStorage.removeItem('USER');
      this.props.navigation.navigate('Login');
  }
  handleGetData = async() =>{
  try {
        let result = await AsyncStorage.getItem('USER');
        result = JSON.parse(result);
        const decodedUser = jwt_decode(result.token);
        // console.log(decodedUser);
        if (decodedUser !== null) {
          // We have data!!
          //collect all data
          let data = {
            isAdmin: decodedUser.isAdmin,
            email: decodedUser.email
          }
          axios.post(`${baseUrl}/api/common/auth/getUserData`,data )
          .then(res=>{
            console.log(res.data);
            let jointDt = res.data.joiningDate.split("T")[0].split("-").reverse().join("-")
            this.setState({
              email: res.data.email,
              name: res.data.name,
              mobile:res.data.mobile? res.data.mobile:null,
              joiningDate:jointDt?jointDt:"",
              lebels: res.data.labels? res.data.labels:"0",
              profileImage: decodedUser.profileImage?decodedUser.profileImage: this.state.profileImage ,
              signInType:result.signInType
            })
          })

        }else{
          this.props.navigation.navigate('Login');
        }
      } catch (error) {
        console.log(error);
        alert('problem while getting data')
      }
  }
    render() {
      return (
        <KeyboardAwareScrollView
        enableOnAndroid={true}
        // extraHeight={130}
        extraScrollHeight={90}
        >
        <Container>
        <NavigationEvents onDidFocus={() => this.handleGetData()} />
        <Grid>
          <Row size={15} style={{backgroundColor:'#fff', justifyContent:'center', alignItems:'center',marginBottom: 0}}>
            <Thumbnail style={{width:90, height:90, borderRadius:60}} source={{uri:this.state.profileImage}} />
          </Row>
          <Row size={85} style={{backgroundColor:'#fff',marginBottom: 0}}>
            <Content>
            <Text style={{alignSelf:'center'}}>Joined On: {this.state.joiningDate}</Text>
            <Text style={{alignSelf:'center'}}>Lebel: {this.state.lebels}</Text>
            <Text style={{fontSize:18, textAlign:'center'}}>Email: {this.state.email}</Text>
            <Text style={{fontSize:18,textAlign:'center'}}>Name: {this.state.name}</Text>
            <Text style={{fontSize:18,textAlign:'center'}}>Mobile: {this.state.mobile}</Text>

              <Button block
                  style={{height:65, margin:15,borderTopStartRadius:40,backgroundColor:'black', borderTopEndRadius:45}}
                  onPress={()=> this.handleLogout()}
                  >
                  <Text style={{textAlign:'center', textAlignVertical:'center', color:'white', fontSize:22, fontFamily:'Roboto'}}>Logout</Text>
              </Button>
              <Button block
                  style={{height:65, margin:15,borderTopStartRadius:40,backgroundColor:'black', borderTopEndRadius:45}}
                  onPress={()=> this.handleDeleteAccount()}
                  >
                  <Text style={{textAlign:'center', textAlignVertical:'center', color:'white', fontSize:22, fontFamily:'Roboto'}}>Delete Account?</Text>
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