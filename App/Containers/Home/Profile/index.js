import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,
  AsyncStorage,
  Alert,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform, RefreshControl, ScrollView
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
//import { firebase } from '../../../Configs/firebase'
import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-crop-picker'
//import storage from '@react-native-firebase/storage'
import NavigatorService from '@NavigatorService';
const { width, height } = Dimensions.get('window')
import { svr } from '../../../Configs/apikey';
import axios from 'axios';
import { GoogleSignin,
  GoogleSigninButton,
  statusCodes, } from '@react-native-google-signin/google-signin';
  import {
    AccessToken,
    GraphRequest,
    GraphRequestManager,
    LoginManager,
  } from 'react-native-fbsdk';
import { useTranslation } from 'react-i18next';
import { SignInWithAppleButton, appleAuth } from 'react-native-apple-authentication'

const Profile = (props) => {
  const { t } = useTranslation();
  let namas = t('common:fnama');
  let hp    = t('common:fnohp');
  let mail  = t('common:femail');
  let setting = t('common:pengaturan');
  let txt_setting = t('common:txt_pengaturan');
  let btn_cancel_pgtrn = t('common:btn_cancel_pgtrn');
  let btn_yes_pgtrn = t('common:btn_yes_pgtrn');
  let err_data = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull = t('common:dataNull');
  let err_404 = t('common:err_404');
  let err_500 = t('common:err_500');
  let konfirm = t('common:konfirmasi');
  let txt_konfimout = t('common:txt_konfimout');
  let batal = t('common:batal');
  let keluar = t('common:keluar');
  let informasi =  t('common:informasi');
  let kembali   =  t('common:kembali');
  let youareGuest   =  t('common:guestAlert');
  let OutError =  t('common:outError');



  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState({
    id:'',
    photo: '../../../Assets/img/profile.png',
    name: '',
    phone: '',
    email: '',
    modalVisible: false,
    options: {
      width: 750,
      height: 750,
      cropping: true,
    },
    login:''
  })

  useEffect(() => {
    AsyncStorage.getItem('login').then(response =>{
      //console.log('login :', response);
      setState(state => ({...state, login: response}))
    }).catch(err =>{
      console.log('err', err)
    })

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
      console.log(datas)

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

  }, [])

  const reload = async() =>{
    try {
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
    } catch (e) {
      //console.log('err', e)
    }

  }

  const camera = () => {
    ImagePicker.openCamera(state.options).then(response => {
      upImageToServer(response)
    }).catch(err => {
      console.log(err)
      if(err == 'Error: Required permission missing' || err == 'User did not grant camera permission.') {
        Alert.alert(
          ''+setting,
          ''+txt_setting,
          [
            {text: btn_cancel_pgtrn, onPress: () => console.log('Cancel')},
            {text: btn_yes_pgtrn, onPress: () => {
              Linking.openSettings();
            }},
          ],
          {cancelable: false},
        );
      }
    })
  }

  const gallery = () => {
    ImagePicker.openPicker(state.options).then(response => {
    //  processUpload(response)
      upImageToServer(response)
    }).catch(err => {
      console.log(err)
      if(err == 'Error: Required permission missing' || err == 'Error: Cannot access images. Please allow access if you want to be able to select images.') {
        Alert.alert(
          ''+setting,
          ''+txt_setting,
          [
            {text: btn_cancel_pgtrn, onPress: () => console.log('Cancel')},
            {text: btn_yes_pgtrn, onPress: () => {
              Linking.openSettings();
            }},
          ],
          {cancelable: false},
        );
      }
    })
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

  const upImageToServer=(imagePath) => {
    const imageDta = new FormData();
    imageDta.append("picture", {
      uri: imagePath.path,
      name: 'image.jpg',
      type: 'image/jpg'
    })
    //console.log('THIS => '+ JSON.stringify(imageDta));
    fetch(svr.url+'users/'+state.id+'/'+svr.api+'/',
      {
        headers:{
          'Accept':'application/json',
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: imageDta
      }
    ).then(response => response.json())
     .then(response => {
        console.log(response)
        if(response.status==200){
          refresh()
        }
    }).catch(err =>{
      console.log(err)
      alert(err_data)
      setState(state => ({...state, loading: false }))
    })
  }

  const refresh = () =>{
    setState(state => ({...state, loading: true }))
      axios.get(svr.url+'users/'+state.id+'/'+svr.api+'/')
      .then(result =>{
          if(result.data.status==200){
              const datas = {
                id: result.data.value[0].id,
                value: result.data.value
              }
              if(datas.value.length === 0) {
                alert(dataNull)
              } else {
              //save Async Storage
              try {
                 AsyncStorage.setItem('users', JSON.stringify(datas.value))
              } catch (e) {
                 alert('Error, ' + err_trima)
              }
              getData()
              console.log('===>> ' +JSON.stringify(datas.value));
            }
            setState(state => ({...state, loading: false }))
          }else if(result.data.status==404){
            alert(err_404)
            setState(state => ({...state, loading: false }))
          }
      })

      .catch(err =>{
        console.log(err)
        alert(err_data)
        setState(state => ({...state, loading: false }))
      })
  }

  const getData = () =>{
    try {
        AsyncStorage.getItem('users').then(response =>{
          let data    = JSON.parse(response);
          const datas = JSON.stringify(data[0]);
          let users   = JSON.parse(datas);
          setState(state => ({...state,
            name: users?.name,
            phone: users?.phone,
            email: users?.email,
            photo: users?.picture
          }))
        }).catch(err =>{
          console.log('err', err)
        })
    } catch (e) {
        alert(err_data)
    }
  }

  const renderModal = () => {
    return (
      <Modal
        onBackdropPress={() => setState(state => ({...state, modalVisible: false})) }
        isVisible={state.modalVisible}
        style={styles.bottomModal}>

        <View style={styles.viewRootModal}>
          <View style={[styles.modalBox, {backgroundColor: '#FFFFFF', height: toDp(192)}]}>
            <View style={styles.viewModalTitle}>
              <TouchableOpacity style={styles.touchSilang} onPress={() => setState(state => ({...state, modalVisible: false})) }>
                <Image source={allLogo.icSilang} style={styles.icSilang} />
              </TouchableOpacity>
              <Text style={[styles.textTitleModal, {color: '#363636'}]}>{t('common:txt_ubh_foto')}</Text>
              <View style={styles.touchSilang} />
            </View>

            <View style={{marginTop: toDp(24), marginLeft: toDp(16)}}>

              <View style={styles.viewButton}>
                <Pressable
                  onPress={() => camera() }
                  style={[styles.presableButton, {backgroundColor: '#7BA95C'}]}
                >
                  <Text style={styles.text}>{t('common:kamera')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => gallery() }
                  style={[styles.presableButton, {backgroundColor: '#EE6C4D'}]}>
                  <Text style={styles.text}>{t('common:galeri')}</Text>
                </Pressable>
              </View>

            </View>

          </View>
        </View>
      </Modal>
    )
  }

  const viewMenu = (backgroundColor, title, value) => {
    return (
      <View style={[styles.presableMenu, {backgroundColor}]}>
        <View style={styles.viewText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{value}</Text>
        </View>
      </View>
    )
  }

  const Alrtlogout = (val) => {
    Alert.alert(
      ""+konfirm,
      ""+txt_konfimout,
      [
        {
          text: batal,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: keluar, onPress: () => {
            if(val=='guest'){
              logoutGuest()
            }else{
              logoutGuest()
            }
        }}
      ]
    )
  }

  const logout = () => {
    Alert.alert(
      ""+konfirm,
      ""+txt_konfimout,
      [
        {
          text: batal,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: keluar, onPress: () => {
          AsyncStorage.clear()
          NavigatorService.reset('Login')
        }}
      ]
    )
  }

  const logoutAlmedia = (val) => {
    Alert.alert(
      ""+konfirm,
      ""+txt_konfimout,
      [
        {
          text: batal,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: keluar, onPress: () => {
          if(val=='google'){
            signOut();

          }else if(val=='facebook'){
            logoutWithFacebook();

          }else if(val=='apple'){
            logoutwithApple();
          }

        }}
      ]
    )
  }

  const logoutFacebook = () => {
    Alert.alert(
      ""+konfirm,
      ""+txt_konfimout,
      [
        {
          text: batal,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: keluar, onPress: () => {
          logoutWithFacebook()
        }}
      ]
    )
  }

  const signOut = async () => {
    try {
      AsyncStorage.clear()
      await GoogleSignin.signOut();
      NavigatorService.reset('Login')
    } catch (error) {
      console.error('Logout ',error);
    }
  };

  const logoutWithFacebook = () => {
    AsyncStorage.clear()
    LoginManager.logOut();
    NavigatorService.reset('Login')
  };

  const logoutwithApple = async() =>{
    try {
      const outs = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGOUT
      })
      console.log('Logout ==> '+ outs);
    } catch (e) {
      showAlertone(e)
    }
  }

  const removeLogin = async(key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
 }

  const logoutGuest = () =>{
   setState(state => ({...state, loading: true }))
   console.log(svr.url+'login/gout/out/'+state.id+'/'+svr.api+'/');
     axios.get(svr.url+'login/gout/out/'+state.id+'/'+svr.api+'/')
     .then(result =>{
         //console.log('GUEST'+ JSON.stringify(result.data));
         if(result.data.status==200){
                 //save Async Storage
                 AsyncStorage.clear()
                 setTimeout(function () {
                   NavigatorService.reset('Login')
                 }, 3000);

           setState(state => ({...state, loading: false }))

         }else{
           showAlertone(OutError)
           setState(state => ({...state, loading: false }))
         }
     }).catch(err =>{
       AsyncStorage.clear()
       setTimeout(function () {
         NavigatorService.reset('Login')
       }, 1000);
       setState(state => ({...state, loading: false }))
     })
 }

 const showAlertone = (data) => {
   Alert.alert(
     ""+informasi,
     ""+data,
     [
       {
         text: kembali,
         onPress: () => console.log("Cancel Pressed"),
         style: "cancel"
       }
     ]
   )
 }

 const chageProfile = () =>{
   if(state.login=="guest"){
     showAlertone(youareGuest)
   }else{
     NavigatorService.navigate('UbahProfil')
   }
 }

  return (
    <View style={styles.container}>

    <ScrollView vertical={true} style={{width:'100%',  }} showsVerticalScrollIndicator={false}
          refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={reload}
          />}
        >
            <View style={{alignItems: 'center', marginTop: toDp(25)}}>
                {renderModal()}
                <View style={{alignItems: 'center'}}>
                    <Image
                      source={state.photo
                    ? {uri: state.photo}                      // Use object with 'uri'
                    : require('../../../Assets/img/profile.png')}
                      style={styles.imgProf} />
                </View>

                {viewMenu('#7BA95C', namas, state.name)}
                {viewMenu('#EE6C4D',hp, state.phone)}
                {viewMenu('#00AF90',mail, state.email)}
            </View>

            <View style={{width:'100%', paddingHorizontal:toDp(15), marginBottom:toDp(30)}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:toDp(25), marginLeft:toDp(2)}}>
                    {state.login==='google' ?
                      <Pressable style={styles.presableLogout} onPress={() => logoutAlmedia('google')}>
                        <Text style={styles.textLogout}>{t('common:keluar')}</Text>
                      </Pressable>
                    : state.login==='facebook' ?
                      <Pressable style={styles.presableLogout} onPress={() => logoutAlmedia('facebook')}>
                        <Text style={styles.textLogout}>{t('common:keluar')}</Text>
                      </Pressable>

                    : state.login==='apple' ?
                        <Pressable style={styles.presableLogout} onPress={() => logoutAlmedia('apple')}>
                          <Text style={styles.textLogout}>{t('common:keluar')}</Text>
                        </Pressable>

                    : state.login==='guest' ?
                      <Pressable style={styles.presableLogout} onPress={() => Alrtlogout('guest')}>
                        <Text style={styles.textLogout}>{t('common:keluar')}</Text>
                      </Pressable>

                    :
                        <Pressable style={styles.presableLogout} onPress={() => logout()}>
                          <Text style={styles.textLogout}>{t('common:keluar')}</Text>
                        </Pressable>
                    }

                    <Pressable style={styles.presableUbah} onPress={()=> chageProfile()}>
                      <Text style={styles.textEdit}>{t('common:ubahProfil')}</Text>
                    </Pressable>
              </View>
            </View>

      </ScrollView>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width:'100%'
  },
  title: {
    fontSize: toDp(20),
    height: toDp(30),
    fontWeight: '500',
    color: 'white',
  },
  desc: {
    fontSize: toDp(14),
    height: toDp(15),
    fontWeight: '500',
    color: 'white',
  },
  presableMenu: {
    width: '90%',
    height: toDp(65),
    borderRadius: toDp(15),
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
  imgUnderstand: {
    width: toDp(50),
    height: toDp(57),
    marginLeft: toDp(19),
    marginTop: toDp(12)
  },
  viewText: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  presableLogout: {
    width: '40%',
    height: toDp(45),
    backgroundColor: '#EE6C4D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(25),
  },
  presableUbah:{
    width: '40%',
    height: toDp(45),
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(25),
  },
  textLogout: {
    fontSize: toDp(13),
    color: '#FFF',
    letterSpacing: toDp(1)
  },
  textEdit:{
    fontSize: toDp(13),
    color: '#FFF',
    letterSpacing: toDp(1)
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
  text: {
    fontSize: toDp(16),
    fontWeight: 'bold',
    color: 'white',
  },
  imgProf:{
    width:toDp(100),
    height:toDp(100),
    borderRadius: toDp(60),
    backgroundColor:'#ccc'
  },
});

export default Profile;
