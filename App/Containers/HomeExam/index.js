import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,
  Alert,
  FlatList,
  AsyncStorage
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Modal from "react-native-modal";
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import Header from '@Header'
//import { firebase } from '../../Configs/firebase'
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const HomeExam = (props) => {
  const { t } = useTranslation();
  let pilih_jenis_ujian  = t('common:pilih_jenis_ujian');
  let txt_pilih_ujian  = t('common:txt_pilih_ujian');
  let ujian_akhir  = t('common:ujian_akhir');
  let final_test  = t('common:final_test');
  let grammar_test  = t('common:grammar_test');
  let pilih_jenis_test = t('common:pilih_jenis_test');
  let txt_pilih_jenis_test = t('common:txt_pilih_jenis_test');
  let err_data = t('common:err_data');
  let err_500 = t('common:err_500');
  let informasi = t('common:informasi');
  let oke = t('common:oke');
  let youareGuest = t('common:guestAlert');
  /*modal*/
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModaldata] = useState({});
  const [shouldShow, setShouldShow] = useState(false);
  /**/
  const [state, setState] = useState({
    loading: false,
    uid:'',
    arrayLevel: [],
    login:''
  })

  const toggleModal = () => {
     setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    AsyncStorage.getItem('uid').then(uids =>{
      let ids = uids;
      setState(state => ({...state,
        uid: ids
      }))
    });

    AsyncStorage.getItem('login').then(response =>{
      //console.log('login :', response);
      setState(state => ({...state, login: response}))
    }).catch(err =>{
      console.log('err', err)
    })
    getLevel()
  }, [])

  const showAlert = (data) => {
    Alert.alert(
      ""+informasi,
      ""+data,
      [
        {
          text: oke,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    )
  }

  const getLevel = () => {
    setState(state => ({...state, loading: true }))
    axios.get(svr.url+'level/'+svr.api)
    .then(result =>{
        if(result.data.status==200){
          //console.log('This level =>', result.data.value);
          let data = result.data.value.map(doc => {
              return {
                id: doc.id,
                value: doc
              }
           })
          //console.log('New data => '+ JSON.stringify(data) )
          setState(state => ({...state, loading: false, arrayLevel: data }))
          setState(state => ({...state, loading: false }))

        }else if(result.data.status==500){
          showAlert(err_500);
          setState(state => ({...state, loading: false }))
        }
    }).catch(err =>{
      showAlert(err_data)
      setState(state => ({...state, loading: false }))
    })
  }

  const selectMateri = (array) => {
    if(state.login=="guest"){
          showAlert(youareGuest)
    }else{
          //if(level == 'Level 2' || level == 'Level 3') {
            let val  = JSON.stringify(array)
            let data = JSON.parse(val)
            setModalVisible(!isModalVisible);
            setModaldata(data)
        //  } else {
        //   alert(val)
        //  }
    }
  }

  const openLink = (id, excerpt, title) => {
      NavigatorService.navigate('FinalExam', {lid:id, excerpt:excerpt, uid:state.uid, title:title})
      setModalVisible(!isModalVisible);
      setModaldata('')

  }

  const PressableMenu = (backgroundColor, title, onPress) => {
    return (
      <Pressable style={[styles.presableMenu, {backgroundColor}]} onPress={() => onPress()}>
        <Image source={allLogo.icLevel} style={styles.icMateri} />
        <View style={styles.viewText}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </Pressable>
    )
  }

  const modalAlert = (data) => {
    Alert.alert(
      ""+pilih_jenis_test,
      ""+txt_pilih_jenis_test,
      [
        {
          text: grammar_test,
          onPress: () => {
            NavigatorService.navigate('FinalExam', {link:data.final_exam_grammar})
          }
        },
        { text: final_test, onPress: () => {
          NavigatorService.navigate('FinalExam', {link:data.final_exam_quran})
        }}
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewCenterAbsolute}>
        <Image source={allLogo.logo} style={styles.logo} />
      </View>
      <Loader loading={state.loading} />

      <Header
        title={ujian_akhir}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        {
          /*state.arrayLevel.map((data, index) => {
            return (
              presableMenu(data.value.backgroundColor, data.value.name, () => selectMateri(data.value.name))
            )
          })*/
        }

        {shouldShow ? (
          <View style={{width:'100%',alignItems:'center',justifyContent:'center',position:'absolute',flex:1, marginVertical:'70%'}}>
            <Image source={allLogo.Profile} style={{width:toDp(100),height:toDp(100)}}/>
          </View>

        ) : null}

        <View style={{width: '100%'}}>
          <FlatList
            data={state.arrayLevel}
            renderItem={({item, index}) => {
              return (
                PressableMenu(item.value.backgroundColor, item.value.name, () => selectMateri(item))
              )
            }}
            ListFooterComponent={() => <View style={{height: toDp(24)}} />}
          />
        </View>

        {/*modal*/}
        <Modal style={styles.modal} isVisible={isModalVisible}>
          <View style={styles.ViewModal}>
              <Pressable style={styles.modalClose} onPress={()=> toggleModal()}>
                <Image source={allLogo.icSilang} style={{height:toDp(20),width:toDp(20)}}/>
              </Pressable>
              <View style={{padding:toDp(20)}}>
                <Text style={{fontSize:toDp(20), fontWeight:'bold'}}>{pilih_jenis_ujian}</Text>
                <View style={{marginTop: toDp(16)}}>
                  <Text style={{fontSize:toDp(16)}}>{txt_pilih_ujian}</Text>

                </View>
              </View>
              <View style={styles.modalFooter}>
                <Pressable style={[styles.pressMbtn, {borderRightWidth:1, borderRightColor:'#ccc'}]} onPress={()=> openLink(modalData.id, 'Grammer Test', modalData.value.name) }>
                    <Text style={{fontWeight:'bold'}}>{grammar_test}</Text>
                </Pressable>
                <Pressable style={styles.pressMbtn} onPress={()=> openLink(modalData.id, 'Final Test', modalData.value.name) }>
                    <Text style={{fontWeight:'bold'}}>{final_test}</Text>
                </Pressable>
              </View>
          </View>
        </Modal>
        {/*end modal*/}

      </View>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center'
  },
  modal:{
    marginVertical:'50%',
    maxHeight: toDp(200),
  },
  ViewModal:{
    flex: 1,
    width:'100%',
    backgroundColor:'#FFF',
    height:toDp(200),
    borderRadius:toDp(10),
  },
  modalClose:{
    height:toDp(20),
    width:toDp(20),
    position:'absolute',
    right:toDp(20), marginTop:toDp(20),
    zIndex:2,
  },
  modalFooter:{
    flexDirection:'row',
    backgroundColor:'#f3f3f3',
    maxHeight:toDp(60),
    bottom:0,
    position:'absolute',
    width:'100%',
    right:toDp(0),
    borderBottomEndRadius:toDp(10),
    borderBottomStartRadius:toDp(10)
  },
  pressMbtn:{
    height:toDp(60), alignItems:'center',
    justifyContent:'center', flex:1
  },
  viewCenterAbsolute: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  logo: {
    width: toDp(256),
    height: toDp(270),
    resizeMode: 'contain'
  },
  icMateri: {
    width: toDp(39),
    height: toDp(52),
    resizeMode: 'contain',
    marginLeft: toDp(24),
    marginTop: toDp(6)
  },
  presableMenu: {
    width: '90%',
    marginLeft: toDp(16),
    height: toDp(66),
    borderRadius: toDp(25),
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    flexDirection: 'row',
    marginTop: toDp(16)
  },
  viewText: {
    width: '60%',
    marginLeft: toDp(18),
    justifyContent: 'center',
  },
  title: {
    fontSize: toDp(20),
    height: toDp(30),
    fontWeight: '500',
    color: 'white',
    width: '100%',
    textAlign: 'center',
    marginTop: toDp(4)
  },
});

export default HomeExam;
