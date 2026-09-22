import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable, TextInput, ScrollView, AsyncStorage,TouchableOpacity,Dimensions,
  Linking,
  Platform,
  Alert
} from "react-native";
//import { firebase } from '../../../Configs/firebase'
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import Loader from '@Loader'
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import Modal from 'react-native-modal'
const { width, height } = Dimensions.get('window')
import ImagePicker from 'react-native-image-crop-picker'
import NavigatorService from '@NavigatorService';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import VerificationAnimate from '@VerificationAnimate';

const Verification = (props) => {
  const { t } = useTranslation();
  let verivicationTitle = t('common:verivicationTitle');


  //setState

  const [userss, setUser] = useState({})
  const [state, setState] = useState({
    loading: false,
  })

  //get data
  useEffect(() => {
    AsyncStorage.getItem('login').then(response =>{
      //console.log('login :', response);
      setState(state => ({...state, login: response}))
    }).catch(err =>{
      console.log('err', err)
    })
    //Get data pengguna
    AsyncStorage.getItem('users').then(response => {
      //console.log('response =>'+ response);
      let data    = JSON.parse(response);
      const datas = JSON.stringify(data[0]);
      let users   = JSON.parse(datas);
      setState(state => ({...state,
        name: users?.name,
        phone: users?.phone,
        email: users?.email,
        photo: users?.picture
      }))
      //console.log(response)

    }).catch(err => {
      console.log('err', err)
    })
    //Get id pengguna
    AsyncStorage.getItem('uid').then(uids =>{
      let ids = uids;
      setState(state => ({...state,
        id: ids
      }))

    }).catch(err =>{
      console.log('err', err)
    })
    if(state.name!='' && state.phone!='' && state.email!=''){
      setState(state => ({...state, valName:false }))
      setState(state => ({...state, valMail:false }))
      setState(state => ({...state, valPhone:false }))
    }
  }, [])

  //Lets update
  const ToasSuccess = () =>{
     Toast.show({
       type: 'success',
       visibilityTime: 6000,
       position:'bottom',
       bottomOffset:10 ,
       text1: ubahprofil,
       text2: profil_update + '👋'
    });
  }

  const randomString = (len, charSet) => {
    charSet = charSet || 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  }


  const toUppercase = (str) =>{
    return str.replace(
      /\w\S*/g,
      function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }


  const alertdel = () => {
    Alert.alert(
      ""+konfirm,
      ""+txt_konfirmdelacct,
      [
        {
          text: batal,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: yakin, onPress: () => {
          console.log('hahaha');
        }}
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={verivicationTitle}
        onPress={() => props.navigation.goBack()}
      />
          <ScrollView style={styles.scrollView}>
            <VerificationAnimate tipe={props.navigation.state.params.type}/>

          </ScrollView>

          <Toast/>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF'
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'black',
  },
  card:{
    flex: 1,
    width: toDp(300),
    padding: toDp(8)
  },
  vimput:{
    marginTop: toDp(1),
    marginBottom:toDp(12),
    width: '100%',
  },
  vimputbtn:{
    marginTop: toDp(1),
    marginBottom:toDp(12),
    backgroundColor:'cyan'
  },
  input:{
    width: '100%',
    height: toDp(55),
    backgroundColor: '#F2F3F3',
    paddingHorizontal: toDp(18),
    borderRadius: toDp(4),
    marginTop: toDp(4),
  },
  presableSave: {
    width: '40%',
    height: toDp(40),
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(25),
  },
  imgProf:{
    width:toDp(100),
    height:toDp(100),
    borderRadius: toDp(60)
  },
  errorMessage:{
    color: 'red',
    marginBottom:12,
    fontSize: 12,
    left:0,
    position: 'relative',
  },
  imgProfile: {
    marginTop:toDp(0),
    width: toDp(110),
    height: toDp(110),
    borderRadius: toDp(70),
    marginBottom:toDp(12),
    zIndex: 1,
    backgroundColor: '#CCC'
  },
  icEdit:{
    marginTop:toDp(75),
    width:toDp(40),
    height:toDp(40),
    position: 'absolute',
    right: toDp(0),zIndex: 5
  },
  mbb:{
    marginBottom:toDp(20)
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  viewRootModal: {
    width,
    position: 'absolute',
    bottom: 0
  },
  modalBox: {
    width,
    height: toDp(165),
    backgroundColor: '#111111',
    borderTopLeftRadius: toDp(16),
    borderTopRightRadius: toDp(16)
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewModalTitle: {
    marginTop: toDp(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: toDp(16)
  },
  touchSilang: {
    padding: toDp(4),
  },
  icSilang: {
    width: toDp(24),
    height: toDp(24),
  },
  textTitleModal: {
    fontSize: toDp(16),
    color: '#363636',
    fontWeight: 'bold'
  },
  viewButton: {
    marginTop: toDp(16),
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  text: {
    fontSize: toDp(16),
    fontWeight: 'bold',
    color: 'white',
  },
  presableButton: {
    width: 'auto',
    paddingHorizontal: toDp(16),
    height: toDp(39),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(25),
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Verification;
