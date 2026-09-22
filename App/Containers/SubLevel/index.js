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
  FlatList,AsyncStorage
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import Header from '@Header'
//import { firebase } from '../../Configs/firebase'
import { useTranslation } from 'react-i18next';

const SubLevel = (props) => {
  const { t } = useTranslation();
  let err_data = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull = t('common:dataNull');
  let err_404 = t('common:err_404');
  let err_500 = t('common:err_500');
  let batal = t('common:batal');
  let oke = t('common:oke');
  let informasi = t('common:informasi');
  let kembali   =  t('common:kembali');
  let youareGuest   =  t('common:guestAlert');

  const [state, setState] = useState({
    loading: false,
    arrayLevel: [],
    login:''
  })

  useEffect(() => {
    
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
    let str = props.navigation.state.params.title;
    const title = str.replace(/\s+/g,'%20');
    axios.get(svr.url+'sublevels/'+props.navigation.state.params.title+'/'+svr.api)
    .then(result =>{
        if(result.data.status==200){
          //console.log('This level =>', result.data.value);
          let data = result.data.value.map(doc => {
              return {
                id: doc.id,
                value: doc
              }
           })
          //console.log('New sublevel => '+ JSON.stringify(data) )
          setState(state => ({...state, loading: false, arrayLevel: data }))
          setState(state => ({...state, loading: false }))

        }else if(result.data.status==404){
          showAlert(err_404);
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

  const selectMateri = (value) => {
    NavigatorService.navigate('Materi', {value, level: props.navigation.state.params.title, lid:props.navigation.state.params.lid})
  }

  const presableMenu = (backgroundColor, title, onPress) => {
    return (
      <Pressable style={[styles.presableMenu, {backgroundColor}]} onPress={() => onPress()}>
        <View style={styles.viewText}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </Pressable>
    )
  }



  return (

    <View style={styles.container}>
      <View style={styles.viewCenterAbsolute}>
        <Image source={allLogo.logo} style={styles.logo} />
      </View>
      <Loader loading={state.loading} />
      <Header
        title={props.navigation.state.params.title}
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
        <View style={{width: '100%'}}>
          <FlatList
            data={state.arrayLevel}
            renderItem={({item, index}) => {
              return (
                presableMenu(item.value.backgroundColor, item.value.name, () => selectMateri(item.value))
              )
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
    width: '100%',
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

export default SubLevel;
