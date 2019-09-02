import React, { Component } from 'react'
import { StyleSheet, Text, View ,
  ScrollView,ActivityIndicator,
  AsyncStorage,ToastAndroid} from 'react-native';
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


  export default class EditBonus extends Component {
    constructor(props){
      super(props);
      this.state ={
        id:"",
        creditPoint:"",
        bonusCreditPoint:"",
        agentLabel:"",
        showLoading: 0
      }
    }
    // componentDidMount(){
    //   // const { navigation } = this.props;
    //   // const id = navigation.getParam('item', 'NO-ID');
    //   // alert(JSON.stringify(id))
    // }
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
      if(this.state.creditPoint == '' || this.state.bonusCreditPoint == '' || this.state.agentLabel == ''){
        return false;
      }
      return true;
    }
    handleSaveBonus = async() => {
      if(this.checkValidation()){
        this.setState({ showLoading: 1})
        let newBonus = {};

        newBonus.creditPoint = this.state.creditPoint;
        newBonus.bonusCreditPoint = this.state.bonusCreditPoint;
        newBonus.agentLabel = this.state.agentLabel;


        let user = await AsyncStorage.getItem('USER');
        user = JSON.parse(user);
        axios.defaults.headers.common["Authorization"] = user.token;

        let res = await axios.post(`${baseUrl}/api/admin/bonus/addBonus/${this.state.id}`,newBonus);
        if(res.status !== 200){
          ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
        }
        this.setState({ showLoading:0});
        ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
        this.handleClear();
        if(res.data.msg == 'Bonus Created Successfully'
        || res.data.msg == 'Bonus Updated Successfully'){
          this.props.navigation.navigate('AllBonus');
        }
      }else{
        ToastAndroid.show('All fields mandetory to fill', ToastAndroid.SHORT);
      }
    }
    handleClear = () =>{
      this.setState({
        id:"",
        creditPoint:"",
        bonusCreditPoint:"",
        agentLabel:"",
        showLoading:0
      })
    }
    handleFillData = () =>{
      this.handleClear();
      const data = this.props.navigation.dangerouslyGetParent().getParam('item');
      this.fillStateData(data);
    }
    fillStateData = (data) =>{

      if(data !== undefined){
        this.setState({showLoading: 1})
        this.setState({
          id:data._id,
          creditPoint:data.creditPoint+"",
          bonusCreditPoint:data.bonusCreditPoint+"",
          agentLabel:data.agentLabel+""
        })
        this.setState({showLoading: 0})
      }
    }
    handleDelete = async()=>{
      this.setState({showLoading: 1})
      let user = await AsyncStorage.getItem('USER');
      user = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = user.token;
      let res = await axios.delete(`${baseUrl}/api/admin/bonus/deleteBonus/${this.state.id}`);
      if(res.status !== 200){
        ToastAndroid.show('Server Error! Try after Sometime', ToastAndroid.SHORT);
      }
      this.setState({ showLoading:0});
      ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
      this.handleClear();

      if(res.data.msg == 'Bonus Deleted Successfully'){
        this.props.navigation.navigate('AllBonus');
      }
    }
    render() {
      return (
        <View>
        <Text>Bonus</Text>
        <KeyboardAwareScrollView
        enableOnAndroid={true}
        // extraHeight={130}
        extraScrollHeight={90}
        >
        <Container style={{height: '100%'}}>
        {this.state.showLoading?<ActivityIndicator size="small" color="#00ff00" />:<Text></Text>}
        <NavigationEvents onDidFocus={() => this.handleFillData()} />
        <Grid>

        <Row size={95} style={{backgroundColor:'#fff',marginBottom: 0, justifyContent:'space-around'}}>
        <Content>
        <Form>
        <Item floatingLabel style={{margin:8}}>
        <Label>Reward Point</Label>
        { this.state.id?
          <Input
          disabled
          value={`${this.state.creditPoint}`}
          onChangeText={(creditPoint)=>this.setState({creditPoint})}
          />
          :
          <Input
          value={`${this.state.creditPoint}`}
          onChangeText={(creditPoint)=>this.setState({creditPoint})}
          />
        }
        </Item>
        <Item floatingLabel  style={{margin:8}}>
        <Label>Bonus Reward Point</Label>
        <Input
        keyboardType="number-pad"
        value={this.state.bonusCreditPoint}
        onChangeText={(bonusCreditPoint)=>this.setState({bonusCreditPoint})}
        />
        </Item>
        <Item floatingLabel  style={{margin:8}}>
        <Label>Level</Label>
        <Input
        keyboardType="number-pad"
        value={this.state.agentLabel}
        onChangeText={(agentLabel)=>this.setState({agentLabel})}
        />
        <Text style={{textAlign:'center'}}>level 0, 1 ,2 etc like</Text>
        </Item>
        </Form>
        <Button block
        style={{height:60, margin:8, marginBottom:20}}
        onPress={()=> this.handleSaveBonus()}
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
        </View>
        )
      }
    }