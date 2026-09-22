import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  Pressable,
  Platform,
  AsyncStorage,Alert
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
//import { firebase } from '../../Configs/firebase'
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import { sha1 } from 'react-native-sha1';
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Login = (props) => {
  const { t }   = useTranslation();
  let informasi = t('common:informasi');
  let batal = t('common:batal');
  let err_user404 = t('common:err_user404');
  let err_500 = t('common:err_500');
  let err_data = t('common:err_data');
  let err_500V3 = t('common:err_500V3');
  let err_konek = t('common:err_konek');
  let err_emailNsm = t('common:err_emailNsm');
  let konfirmasi = t('common:konfirmasi');
  let inf_ubahpsw = t('common:inf_ubahpsw');
  let us_sandi = t('common:us_sandi');
  let inf_deskUbhsandi = t('common:inf_deskUbhsandi');
  let fpengguna = t('common:fpengguna');
  let plc_nmpengguna = t('common:plc_nmpengguna');
  let plc_email = t('common:plc_email');
  let plc_sandi = t('common:plc_sandi');
  let sandiBaru = t('common:sandiBaru');
  let err_sandi = t('common:err_sandi');
  let inf_wajib = t('common:inf_wajib');
  let kirim = t('common:kirim');
  let verifikasi = t('common:verifikasi');
  let ubah = t('common:ubah');
  let oke = t('common:oke');
  let inf_qlog = t('common:inf_qlog');
  let inf_sandiPulih = t('common:inf_sandiPulih');

  const [state, setState] = useState({
    id:'',
    secureTextEntry: true,
    loading: false,
    username: '',
    email:'aws.asdjasdhj@gmail.com',
    password:'',
    confirmMail:'',
    getUsername:true,
    showEmail:false,
    resetPassword:false,
    valPass:'',
    btnRes:false
  })

  const showAlertone = (data) => {
    Alert.alert(
      ""+informasi,
      ""+data,
      [
        {
          text: batal,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    )
  }
  //must change
  const fetchUser = () => {
    const username = state.username;
    setState(state => ({...state, loading: true }))
    const data ={uname:username}
      axios.post(svr.url+'forgetpass/'+svr.api, data)
      .then(result =>{
          if(result.data.status==200){

               let data = result.data.value.map(doc => {
                  return {
                    id: doc.id,
                    value: doc
                  }
               })

              if(data.length === 0) {
                showAlertone(err_user404)
              } else {
                //save Async Storage
                AsyncStorage.setItem('fgusers', JSON.stringify(data[0].value))
                AsyncStorage.setItem('fguid', JSON.stringify(data[0].id))
                getData()

              }
              setState(state => ({...state, loading: false }))
          }else if(result.data.status==404){
            showAlertone(err_user404)
            setState(state => ({...state, loading: false }))

          }if(result.data.status==500){
            showAlertone(err_500)
            setState(state => ({...state, loading: false }))
          }

      }).catch(err =>{
        console.log(err)
        showAlertone(err_data)
        setState(state => ({...state, loading: false }))
      })
  }

  const getData = () =>{
    try {
        AsyncStorage.getItem('fgusers').then(response =>{
          console.log('response', response);
          let users =JSON.parse(response)
          setState(state => ({...state,
            username: users?.username,
            phone: users?.phone,
            email: users?.email,
          }))
          setState(state => ({...state, getUsername: false }))
          setState(state => ({...state, showEmail: true }))
        }).catch(err =>{
          console.log('err', err)
        })

        //Get id pengguna
        AsyncStorage.getItem('fguid').then(uids =>{
          let ids =JSON.parse(uids)
          setState(state => ({...state,
            id: ids
          }))

        }).catch(err =>{
          console.log('err uid', err)
        })
    } catch (e) {
        showAlertone('Error ' + e)
    }




  }

  const hideemail= (text)=> {
    let email = text
    let hiddenEmail = "";
    for (let i = 0; i < email.length; i++) {
      if (i > 2 && i< email.indexOf("@") ) {
        hiddenEmail += "*";
      } else {
        hiddenEmail += email[i];
      }
    }
    return hiddenEmail;
 }

  //must change
  const updateNewPassword = () =>{
    const data = {
      password : state.password
    }
    setState(state => ({...state, loading: true }))
    axios.post(svr.url+'forgetpass/up/'+state.id+'/'+svr.api, data)
    .then(result =>{
        if(result.data.status==200){
          showSuccess()
          setState(state => ({...state, loading: false }))
        }else if(result.data.status==500){
          showAlertone(err_500V3)
          setState(state => ({...state, loading: false }))
        }
    }) .catch(err =>{
      console.log(err)
      showAlertone(err_konek)
      setState(state => ({...state, loading: false }))
    })

  }

  const verifyEmail = () =>{
      if(state.email === state.confirmMail){
        setState(state => ({...state, showEmail: false }))
        setState(state => ({...state, resetPassword: true }))

      }else{
        showAlertone(err_emailNsm)
      }
  }

  const passlength = (pass) =>{
    const psw = pass;

    if(psw.length >= 6 ){
      setState(state => ({...state, valPass: false }));
        setState(state => ({...state, btnRes: true }));
      Shaone(pass);

    }else{
      setState(state => ({...state, valPass: true }))
        setState(state => ({...state, btnRes: false }));

    }
  }

  const Shaone = (pass) =>{
    sha1(pass).then( hash => {
      setState(state => ({...state, password: hash }));
    })
  }


  const showSuccess = () => {
    Alert.alert(
      ""+konfirmasi,
      ""+inf_ubahpsw,
      [
        { text: oke, onPress: () => {
          AsyncStorage.clear()
          NavigatorService.reset('Login')
        }}
      ]
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'} />
      <Loader loading={state.loading} />
        <Image source={allLogo.logo} style={styles.logo} />
          <Text style={styles.title}>BAQi</Text>
          <View style={styles.viewContent}>
            <Text style={styles.titleForm}>{inf_sandiPulih}</Text>
            <Text style={styles.descForm}>{inf_deskUbhsandi}</Text>

            <View style={{height: toDp(46)}} />
            {/*Input username default show- button submit will be active*/}
            { state.getUsername==true ?
              (
              <View>
                    <Text style={styles.textName}>{fpengguna}</Text>

                    <TextInput
                      style={styles.textInput}
                      placeholder={plc_nmpengguna}
                      placeholderTextColor={'grey'}
                      onChangeText={(text) => setState(state => ({...state, username: text })) }
                    />
              </View>
                ) :null
            }

            {/*Input username default hide, show when success fetch email - button verivy will be active*/}
            {state.showEmail==true ?
              (
                <View>
                  <Text style={styles.mailTrap}>{hideemail(state.email)}</Text>

                  <TextInput
                    style={styles.textInput}
                    placeholder={plc_email}
                    placeholderTextColor={'grey'}
                    value={state.confirmMail}
                    onChangeText={(text) => setState(state => ({...state, confirmMail: text })) }
                  />

                  <Text style={styles.mailTips}>
                  * {plc_email}...
                  </Text>
                </View>

              ) :null

            }

            {/*Input username default hide, show when success fetch email - button Reser Password will be active*/}
            {state.resetPassword==true ?(
              <View>
                <Text style={styles.textName}>{sandiBaru}</Text>
                <TextInput
                  style={[styles.textInput, {marginTop: toDp(8)}]}
                  placeholder={plc_sandi}
                  placeholderTextColor={'grey'}
                  secureTextEntry={state.secureTextEntry}

                  onChangeText={(text) => passlength(text) }
                />
                <Pressable style={styles.presableShow} onPress={() => setState(state => ({...state, secureTextEntry: !state.secureTextEntry }))}>
                  <Image source={state.secureTextEntry ? allLogo.icVisibilityOff : allLogo.icVisibilityOn} style={styles.icVisibility} />
                </Pressable>
                { state.valPass === true ? (
                 <Text style={styles.errorMessage}>
                   * {err_sandi}
                 </Text>
                ) : null  }
              </View>
            ):null

            }

            <View style={styles.viewRow}>
              <Pressable style={styles.presableLogin}
                onPress={() => NavigatorService.reset('Login')}>
                <Text style={styles.textLogin}>{inf_qlog}</Text>
              </Pressable>

              { state.getUsername==true ? (
                  <Pressable style={styles.presableSubmit} onPress={() => fetchUser()}>
                    <Text style={styles.textSubmit}>{kirim}</Text>
                  </Pressable>
                )
                : state.showEmail==true ? (
                  <Pressable style={styles.presableSubmit} onPress={() => verifyEmail()}>
                    <Text style={styles.textSubmit}>{verifikasi}</Text>
                  </Pressable>
                )
                : state.resetPassword==true ?(
                  <>
                  {state.btnRes==true ? (

                      <Pressable style={styles.presableSubmit} onPress={() => updateNewPassword()}>
                        <Text style={styles.textSubmit}>{ubah}</Text>
                      </Pressable>

                    ):null
                  }
                  </>
                ) : null
              }

            </View>

            <View style={[styles.positionRight, {marginTop: toDp(20)}]}>

            </View>

          </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: toDp(24),
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: toDp(155),
    height: toDp(154),
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0
  },
  errorMessage:{
    color: '#FFF',
    fontSize: 12,
    left:0,
    position: 'relative',
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center'
  },
  desc: {
    fontSize: toDp(18),
    color: '#000000',
    textAlign: 'left'
  },
  viewContent: {
    zIndex: 2,
    width: '90%',
    height: 'auto',
    backgroundColor: '#52B788',
    borderRadius: toDp(24),
    marginTop: toDp(16),
    padding: toDp(16),
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textInput: {
    width: '100%',
    height: toDp(50),
    backgroundColor: '#F2F3F3',
    paddingHorizontal: toDp(8),
    borderRadius: toDp(4),
    marginTop: toDp(8)
  },
  positionRight: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: toDp(8)
  },
  textLogin: {
    textAlign: 'left',
    fontSize:toDp(15),
    color:'#FFF',
    marginLeft:toDp(-14)
  },
  textDont: {
    marginTop: toDp(16),
    fontSize: toDp(12),
    color: '#000000',
  },
  presableClick: {
    padding: toDp(4)
  },
  textClick: {
    fontSize: toDp(14),
    fontWeight: 'bold',
    color: '#009EE2',
  },
  presableShow: {
    padding: toDp(4),
    position: 'absolute',
    right: toDp(8),
    top: Platform.OS === 'ios' ? toDp(30) : toDp(34)
  },
  icVisibility: {
    width: toDp(24),
    height: toDp(24),
    tintColor: 'grey'
  },
  rowFooter: {
    marginTop: toDp(8),
    flexDirection: 'row'
  },
  icon: {
    width: toDp(30),
    height: toDp(30)
  },
  textName: {
    fontSize: toDp(15),
    color: '#FFF',
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toDp(24)
  },
  presableLogin: {
    width: toDp(130),
    paddingVertical: toDp(4),
    height: toDp(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  presableSubmit: {
    width: toDp(100),
    height: toDp(45),
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(20),
  },
  textSubmit: {
    fontSize: toDp(14),
    letterSpacing: toDp(1),
    color: 'white',
    textAlign: 'center'
  },
  textCreate: {
    textAlign: 'right'
  },
  titleForm: {
    fontSize: toDp(20),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: toDp(4)
  },
  descForm: {
    fontSize: toDp(12),
    color: '#000000',
    textAlign: 'center',
    marginTop: toDp(14)
  },
  mailTrap:{
    color:'#FFF',
    fontWeight: 'bold',
    fontSize:toDp(17),
    textAlign:'center'
  },
  mailTips:{
    marginTop: toDp(10),
    color: '#FFF'
  }
});

export default Login;
