import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  AsyncStorage,
  Alert
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import { useTranslation } from 'react-i18next';
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import Header from '@Header'
import { svr } from '../../Configs/apikey';
import axios from 'axios';

const Petrofisika = (props) => {
  const { t } = useTranslation();
  let err_data = t('common:err_data');
  let err_500 = t('common:err_500');
  let batal = t('common:batal');
  let informasi = t('common:informasi');
  let youareGuest = t('common:guestAlert');
  let judul_petro = t('common:judulPetro');
  let ujianBAB = t('common:ujianBab');
  let final_test = t('common:final_test');

  const [state, setState] = useState({
    loading: false,
    arrayLevel: [],
    uid: '',
    login: ''
  })

  useEffect(() => {
    AsyncStorage.getItem('uid').then(uids =>{
      setState(state => ({...state, uid: uids || ''}))
    });

    AsyncStorage.getItem('login').then(response =>{
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
          text: batal,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
      ]
    )
  }

  const getLevel = () => {
    setState(state => ({...state, loading: true }))
    axios.get(svr.url+'level/'+svr.api)
    .then(result =>{
        if(result.data.status==200){
          // hanya level kurikulum petrofisika (prefix PFC...)
          let data = result.data.value
            .filter(doc => {
              return String(doc.id).startsWith('PFC')
            })
            .map(doc => {
              return {
                id: doc.id,
                value: doc
              }
            })
          setState(state => ({...state, loading: false, arrayLevel: data }))
        }else if(result.data.status==500){
          showAlert(err_500);
          setState(state => ({...state, loading: false }))
        }
    }).catch(err =>{
      showAlert(err_data)
      setState(state => ({...state, loading: false }))
    })
  }

  const selectMateri = (level, lid) => {
    NavigatorService.navigate('SubLevel', {title: level, lid:lid})
  }

  const openFinalTest = (lid, title) => {
    if(state.login=="guest"){
      showAlert(youareGuest)
    }else if(!state.uid){
      showAlert(youareGuest)
    }else{
      NavigatorService.navigate('FinalExam', {lid:lid, excerpt:final_test, uid:state.uid, title:title})
    }
  }

  const presableMenu = (item, index) => {
    return (
      <View style={{width:'100%', alignItems:'center'}}>
        <Pressable style={[styles.presableMenu, {backgroundColor: item.value.backgroundColor}]}
          onPress={() => selectMateri(item.value.name, item.value.id)}>
          <Image source={allLogo.icLevel} style={styles.icMateri} />
          <View style={styles.viewText}>
            <Text style={styles.title}>{item.value.name}</Text>
          </View>
        </Pressable>
        <Pressable style={styles.btnUjian} onPress={() => openFinalTest(item.value.id, item.value.name)}>
          <Text style={styles.btnUjianText}>{ujianBAB} · {final_test}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewCenterAbsolute}>
        <Image source={allLogo.logo} style={styles.logo} />
      </View>
      <Loader loading={state.loading} />
      <Header
        title={judul_petro}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={{width: '100%'}}>
          <FlatList
            data={state.arrayLevel}
            renderItem={({item, index}) => {
              return presableMenu(item, index)
            }}
            ListFooterComponent={() => <View style={{height: toDp(24)}} />}
          />
        </View>
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
  btnUjian: {
    width: '90%',
    marginLeft: toDp(16),
    height: toDp(34),
    borderRadius: toDp(17),
    backgroundColor: '#F2F3F3',
    marginTop: toDp(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: toDp(1),
    borderColor: '#d5d8dc',
  },
  btnUjianText: {
    fontSize: toDp(13),
    fontWeight: '500',
    color: '#1F618D',
  },
});

export default Petrofisika;