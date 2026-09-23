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
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import Loader from '@Loader'
import Header from '@Header'
//import { firebase } from '../../Configs/firebase'
import NavigatorService from '@NavigatorService'
import { useTranslation } from 'react-i18next';

const Materi = (props) => {
  const { t } = useTranslation();
  // Level Petrofisika & CEOR (prefix PFC) tidak punya ujian tata bahasa
  const isPetro = String(props.navigation.state.params.lid || '').startsWith('PFC');
  let lang =  t('common:lang');
  let err_data = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull = t('common:dataNull');
  let err_404 = t('common:err_404');
  let err_500 = t('common:err_500');
  let batal = t('common:batal');
  let oke = t('common:oke');
  let informasi = t('common:informasi');
  let tonton = t('common:tonton');
  let baca = t('common:baca');
  let unduh = t('common:unduh');
  let ujian = t('common:ujian');
  let pelajaran = t('common:pelajaran');
  let tatabahasa = t('common:tatabahasa');
  let err_unduh = t('common:err_unduh');
  let kembali   =  t('common:kembali');
  let youareGuest   =  t('common:guestAlert');

  const [state, setState] = useState({
    loading: false,
    arrayMateri: [],
    uid:'',
    login:''
  })

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


    getMateri()
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

  const getMateri = () => {
    setState(state => ({...state, loading: true }))
    axios.get(svr.url+'materi/get/'+props.navigation.state.params.level+'/'+props.navigation.state.params.value.name+'/'+svr.api)
    .then(result =>{
        if(result.data.status==200){
          //console.log('This level =>', result.data.value);
          let data = result.data.value.map(doc => {
              return {
                id: doc.id,
                value: doc
              }
           })
          console.log('New sublevel => '+ JSON.stringify(data) )
          setState(state => ({...state, loading: false, arrayMateri: data }))
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

  const selectMateri = (level) => {
    showAlert(level)
  }

  const generateBackgroundColor = (index) => {
    if(index % 3 == 0) {
      return '#EE6C4D'
    } else if(index % 3 == 1) {
      return '#7BA95C'
    } else if(index % 3 == 2) {
      return '#A7BD3C'
    } else {
      return 'red' // gak masuk sini ...
    }
  }

  const openLinks = (type, link, value, uid, val, title) => {

      if(type === 'watch') {

        if(lang=='id'){
            NavigatorService.navigate('Watch', {link, value, uid, val})
        }else{

            NavigatorService.navigate('Watch', {link, value, uid, val})

        }

      } else if(type === 'test'){
          if(state.login=="guest"){
            showAlert(youareGuest)
          }else{
              NavigatorService.navigate('Exam', {link, value, uid, val, title, lid:props.navigation.state.params.lid, sublid:props.navigation.state.params.value.id})
          }
      } else if(type === 'unduh'){
        if(lang=='id'){
          NavigatorService.navigate('Download', {link:link, value})
        }else{
          if(val!=''){

            NavigatorService.navigate('Download', {link:val, value})
          }else{
            showAlert(err_unduh)
          }
        }

      } else {
        if(lang=='id'){
            NavigatorService.navigate('Read', {link:link, value})
        }else{
          if(val!=''){

            NavigatorService.navigate('Read', {link:val, value})
          }else{
            showAlert(err_unduh)
          }
        }

      }

  }

  const openLinkPGexam = (id, excerpt, title) => {
    if(state.login=="guest"){
      showAlert(youareGuest)
    }else{
      console.log('------------------------->', id+ excerpt+ title);
      NavigatorService.navigate('FinalExam', {lid:id, excerpt:excerpt, uid:state.uid, title:title})
    }
  }
  const presableMenu = (item, index) => {
    return (
      <Pressable style={[styles.presableMenu, {backgroundColor: generateBackgroundColor(index)}]} >
        <View style={styles.viewText}>
        {lang=='id' ?
          <Text style={styles.title}>
                  {item.value.information}
          </Text>
          :
          <Text style={styles.title}>
              {item.value.information_en!='' ?
                  item.value.information_en
                :
                  item.value.information
              }
          </Text>
        }
          <View style={styles.row}>
            <Pressable style={{padding: toDp(4)}} onPress={() => openLinks('watch', item.value.watch, item.value, state.uid, item.id,item.value.doc_en)}>
              <Text style={styles.textMenu}>{tonton}</Text>
            </Pressable>
            <Pressable style={{padding: toDp(4)}} onPress={() => openLinks('read', item.value.doc, item.value,'',item.value.doc_en,'')}>
              <Text style={styles.textMenu}>{baca}</Text>
            </Pressable>
            <Pressable style={{padding: toDp(4)}} onPress={() => openLinks('unduh', item.value.doc, item.value,'',item.value.doc_en,'')}>
              <Text style={styles.textMenu}>{unduh}</Text>
            </Pressable>
            <Pressable style={{padding: toDp(4)}} onPress={() => openLinks('test', item.value.test, item.id, state.uid,'Materi', item.value.information)}>
              <Text style={styles.textMenu}>{ujian}</Text>
            </Pressable>
          </View>
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
        title={props.navigation.state.params.value.name}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        {
          /*state.arrayMateri.map((data, index) => {
            return (
              presableMenu(data.value.backgroundColor, data.value.name, () => selectMateri(data.value.name))
            )
          })*/
        }

        <View style={{width: '100%'}}>
          <FlatList
            data={state.arrayMateri}
            renderItem={({item, index}) => {
              return (
                presableMenu(item, index)
              )
            }}
            ListFooterComponent={() => <View style={{height: toDp(150)}} />}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.presableMenuFooter} onPress={() => openLinkPGexam(props.navigation.state.params.value.id, 'Ujian Pelajaran', props.navigation.state.params.level)}>
          {lang=='id' ?
            <Text style={styles.textFooter}>{ujian} {props.navigation.state.params.value.name.split(' ')[1]} {pelajaran}</Text>
          :
            <Text style={styles.textFooter}>{props.navigation.state.params.value.name.split(' ')[1]} {pelajaran} {ujian}</Text>
          }
        </Pressable>
        {!isPetro && (
          <React.Fragment>
            <View style={styles.line} />
            <Pressable style={styles.presableMenuFooter} onPress={() => openLinkPGexam(props.navigation.state.params.value.id, 'Ujian Grammer', props.navigation.state.params.level)}>
              {lang=='id' ?
                <Text style={styles.textFooter}>{ujian} {props.navigation.state.params.value.name.split(' ')[1]} {tatabahasa}</Text>
              :
                <Text style={styles.textFooter}>{props.navigation.state.params.value.name.split(' ')[1]} {tatabahasa} {ujian}</Text>
              }
            </Pressable>
          </React.Fragment>
        )}
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
    height: toDp(70),
    borderRadius: toDp(20),
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
    fontSize: toDp(15),
    height: toDp(30),
    fontWeight: '500',
    color: 'white',
    width: '100%',
    textAlign: 'center',
    marginTop: toDp(4)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: toDp(45),

  },
  textMenu: {
    fontSize: toDp(15),
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    height: toDp(60),
    borderTopWidth: toDp(1),
    borderTopColor: 'black',
    backgroundColor: '#F2F3F3',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  presableMenuFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textFooter: {
    fontSize: toDp(15),
    fontWeight: '500',
  },
  line: {
    width: toDp(1),
    height: toDp(24),
    backgroundColor: 'black'
  }
});

export default Materi;
