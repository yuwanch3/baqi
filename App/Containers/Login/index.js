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
  AsyncStorage, ScrollView,TouchableOpacity, Alert
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
//import { firebase } from '../../Configs/firebase'
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import { sha1 } from 'react-native-sha1';
import { GoogleSignin,
  GoogleSigninButton,
  statusCodes, } from '@react-native-google-signin/google-signin';
import { svr } from '../../Configs/apikey';
import axios from 'axios';
// import auth from '@react-native-firebase/auth';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';
import { useTranslation } from 'react-i18next';
import { SignInWithAppleButton, appleAuth, appleAuthAndroid, AppleButton  } from 'react-native-apple-authentication';


const Login = (props) => {
  const { t }   = useTranslation();
  let lang =  t('common:lang');
  let informasi =  t('common:informasi');
  let batal =  t('common:batal');
  let oke =  t('common:oke');
  let infoLoginform= t('common:infoLoginform');
  let fpengguna    = t('common:fpengguna');
  let fsandi       = t('common:fsandi');
  let lupasandi    = t('common:lupasandi');
  let buatakun     = t('common:buatakun');
  let masuk        = t('common:masuk');
  let masukdengan  = t('common:masukdengan');
  let btnfb        = t('common:btnfb');
  let btngoogle    = t('common:btngoogle');
  let plc_nmpengguna = t('common:plc_nmpengguna');
  let plc_sandi      = t('common:plc_sandi');
  let baqi_desk       = t('common:baqi_desk');
  let err_batal       = t('common:err_batal');
  let err_proseson    = t('common:err_proseson');
  let err_playservice = t('common:err_playservice');
  let err_prosesoff   = t('common:err_prosesoff');
  let err_pu_salah    = t('common:err_pu_salah');
  let err_user404     = t('common:err_user404');
  let err_data        = t('common:err_data');
  let err_konek       = t('common:err_konek');
  let err_reg409      = t('common:err_reg409');
  let err_regGagal    = t('common:err_regGagal');
  let err_500V2       = t('common:err_500V2');
  let gueslogin       = t('common:gueslogin');

  const [state, setState] = useState({
    loading: false,
    secureTextEntry: true,
    username: '',
    password: '',
    encpass:'',
    updatePass:false,
    GUser:[],
    name:'',
    email: '',
    phone: '',
    picture:'',
    userfbInfo:[],
    linkLogin:''
  })

  const placeholdercolor  = '#000';
  const [llogin, setLogin] = useState('');
  //props.navigation.state.params.link

  useEffect (() => {
    AsyncStorage.setItem('login', '')
    GoogleSignin.configure({
      webClientId:'983699891629-bgels9oqvkkurhfcmas7demg9s0h3bab.apps.googleusercontent.com',
    });
  }, [])

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

  const showAlert= (data) => {
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

  {/*Google Sigin*/}
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const ugDatas = JSON.stringify(userInfo);
      const newdata = JSON.parse(ugDatas);
      state.GUser.push({userInfo});
      //console.log('length : ', state.GUser.length)

      let body = {
         name: newdata.user.name,
         email: newdata.user.email,
         phone: '',
         username: newdata.user.email,
         picture: newdata.user.photo
      }

      let datas = [];
        datas.push({
          id:newdata.user.id,
          value:[{
            name:newdata.user.name,
            phone:'',
            picture: newdata.user.photo,
            email:newdata.user.email
          }]

        })
        //console.log('user log : '+ JSON.stringify(datas))
        //console.log('user ============> : '+ JSON.stringify(newdata.user))
      if(state.GUser.length>0){
        //console.log('user log : '+ state.linkLogin)
        cekGlogin(newdata.user.email, body, datas, newdata.user.id,'google')
        // const credentialGoogle = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken)
        // return firebase.auth().signInWithCredential(credentialGoogle);
      }

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        showAlertone(err_batal)
        //console.log('1');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        showAlertone(err_proseson)
        //console.log('2');
        //console.log("user info 3",error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        showAlertone(err_playservice)
        //console.log('3');
      } else {
        showAlertone(err_prosesoff)
        //console.log('4' + error);
        // some other error happened
        //console.log("user info 5",error)
      }
    }
  };

  {/*Normal Login*/}
  const getlogin = async() =>{
    setState(state => ({...state, linkLogin: 'normal' }))
    const data = {
      password: state.password,
      username: state.username
    }
    setState(state => ({...state, loading: true }))
      axios.post(svr.url+'login/'+svr.api+'/', data)
      .then(result =>{
          if(result.data.status==200){
              const datas = {
                id: result.data.value[0].id,
                value: result.data.value
              }
              if(datas.value.length === 0) {
                showAlertone(err_pu_salah)
              } else {
              //save Async Storage
              AsyncStorage.setItem('users', JSON.stringify(datas.value))

              AsyncStorage.setItem('uid', datas.id)
              NavigatorService.reset('Home')

            }
            setState(state => ({...state, loading: false }))
          }else if(result.data.status==404){
            showAlertone(err_user404)
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==500){
            showAlertone(err_500V2)
            setState(state => ({...state, loading: false }))
          }
      })

      .catch(err =>{
        //console.log(err)
        showAlertone(err_data)
        setState(state => ({...state, loading: false }))
      })


  }

  const Shaone = (pass) =>{
    sha1(pass).then( hash => {
      setState(state => ({...state, password: hash }));
    })
  }

  const Fbsignbutton = (resCallback) =>{
    return LoginManager.logInWithPermissions(['email', 'public_profile'])
      .then(
        result => {
          //console.log("facebook result = ", result);
          if (result.declinedPermissions && result.declinedPermissions.includes("email")) {
            resCallback({ message: "email is required" })
          }

          if (result.isCancelled) {
            // alert('user cancelled the login')
            //console.log("error")
          } else {
            const infoRequest = new GraphRequest(
              '/me?fields=email,name,picture',
              null,
              resCallback
            );
            new GraphRequestManager().addRequest(infoRequest).start()

          }
        },
        function (error) {
          console.log("login fail with error :" + error)
        }
      )
  }

  const onFbLogin = async () => {
    setState(state => ({...state, linkLogin: '' }))
   try {
     setState(state => ({...state, linkLogin: 'facebook' }))
     await Fbsignbutton(_responseInfoCallBack)
   } catch (error) {
     console.log("Error raised", error)
   }
 }

  const _responseInfoCallBack = async (error, result) => {
   if (error) {
     console.log("Error : ", error)
     return;
   } else {
     const userData = result
     //console.log("facebook data = ", userData)
     state.GUser.push({userData});
       let datas = [];
         datas.push({
           id:result.id,
           value:[{
             name:result.name,
             phone:'',
             picture:result.picture.data.url,
             email:result.email
           }]

         })

       let body = {
            name: result.name,
            email: result.email,
            phone: '',
            username: result.email,
            picture: result.picture.data.url,
       }

       if(state.GUser.length>0){
         setState(state => ({...state, linkLogin: 'facebook' }))
         //console.log('user ada : ',state.GUser.length)
         //console.log('ALL FB : ',datas)

         // Get the Access Token
         cekGlogin(result.email, body,datas, result.id, 'facebook')
         const data = await AccessToken.getCurrentAccessToken();
         //console.log('The TOKEN : ',data)
         // If we don't get the access token, then something has went wrong.
         if (!data) {
           throw 'Something went wrong obtaining access token';
         }
         // Access Token to create a facebook credential.
         // const facebookCredential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
         // // facebook credential to sign in to the application.
         // return firebase.auth().signInWithCredential(facebookCredential);

       }


   }
 }

  const cekGlogin = (email, body, dataus, id, login) => {
      //rev 2
      let data = [];
      if(login=='apple'){
         data = {email: email, appleid:dataus[0].id}
      }else{
         data = {email: email}
      }

      //console.log('data =>'+ JSON.stringify(data));

      setState(state => ({...state, loading: true }))
        axios.post(svr.url+'login/'+svr.api+'/', data)
        .then(result =>{
            if(result.data.status==200){
                const datas = {
                  id: result.data.value[0].id,
                  value: result.data.value
                }

                if(datas.value.length === 0) {
                   RegisterUser(body,id,dataus, login);
                } else {
                  //save Async Storage

                  //console.log('datas regestred ------------>'+JSON.stringify(datas));
                  AsyncStorage.setItem('users', JSON.stringify(datas.value))
                  AsyncStorage.setItem('uid', datas.id)

                  let switch_login = '';
                  if(login=='google'){
                     AsyncStorage.setItem('login', 'google')
                     switch_login = 'google'

                  }else if(login=='facebook'){
                     AsyncStorage.setItem('login', 'facebook')
                     switch_login = 'facebook'

                  }else if(login=='apple'){
                      AsyncStorage.setItem('login', 'apple')
                      switch_login = 'apple'
                  }

                  setTimeout(function () {
                    NavigatorService.reset('Home',{login:switch_login });
                  }, 2000);

               }
                setState(state => ({...state, loading: false }))

            }else if(result.data.status==404){
              setState(state => ({...state, loading: false }))

              RegisterUser(body,id,dataus,login);

            }else if(result.data.status==500){
              showAlertone(err_data)

              setState(state => ({...state, loading: false }))

            }else if(result.data.status==405){
              showAlertone(err_data)
              setState(state => ({...state, loading: false }))
            }

        }).catch(err =>{
          //console.log(err)
          showAlertone(err_konek + err)
          console.log('err => '+ err);
          setState(state => ({...state, loading: false }))
        })
}

  const RegisterUser = (body,id,datas,login) => {
      setState(state => ({...state, loading: true }))
      axios.post(svr.url+'users/'+svr.api+'/',body)
      .then(result =>{
        //console.log('STS=========> : '+ JSON.stringify(result.data))
          if(result.data.status==201){
            console.log('Register =========> : '+ JSON.stringify(datas))
            AsyncStorage.setItem('users', JSON.stringify(datas[0].value))
            AsyncStorage.setItem('uid', result.data.trid)
            if(login==='google'){
              //console.log('LOGIN G=>'+state.linkLogin)
               AsyncStorage.setItem('login', 'google')
               NavigatorService.reset('Home',{login:'google'});
            }else if(login==='facebook'){
              //console.log('LOGIN F=>'+state.linkLogin)
               AsyncStorage.setItem('login', 'facebook')
               NavigatorService.reset('Home',{login:'facebook'})
            }

            setState(state => ({...state, loading: false }))
          }else{
            showAlertone(err_reg409)
            setState(state => ({...state, loading: false }))
          }
      }).catch(err =>{
        showAlert(err_regGagal)
        setState(state => ({...state, loading: false }))
      })

 }

  const AppleSignIn = async() =>{
    try {
        const appData = await appleAuth.performRequest({
           requestedOperation: appleAuth.Operation.LOGIN,
           // Note: it appears putting FULL_NAME first is important, see issue #293
           requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });
        //console.log('apple data ==> '+ appData);

        let firstname = appData.fullName.givenName;
        let lastname = appData.fullName.familyName;
        //rev 1
        let body = {
           appleid: appData.user,
           name: firstname+' '+lastname,
           email: appData.email,
           phone: '',
           username: appData.email,
           picture: ''
        }

        let datas = [];
          datas.push({
            id:appData.user,
            value:[{
              name: firstname+' '+lastname,
              phone:'',
              picture: '',
              email: appData.email,
            }]

          })

        cekGlogin(appData.email, body, datas, appData.user,'apple')

    } catch (error) {
       showAlertone('Filed login...')
       setState(state => ({...state, loading: false }))
    }

  }

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      NavigatorService.reset('Login')
    } catch (error) {
      console.error('Logout ',error);
      showAlertone('Error, '+ err_500V2);
    }
  };

  {/*Guest Login*/}
  const getGuest = async() =>{
    setState(state => ({...state, linkLogin: 'guest' }))
    //console.log(svr.url+'login/guest/yes/'+svr.api+'/');
    setState(state => ({...state, loading: true }))
      axios.post(svr.url+'login/guest/yes/'+svr.api+'/')
      .then(result =>{
          //console.log('GUEST'+ JSON.stringify(result.data));
          if(result.data.status==200 || result.data.status==201){
              const datas = {
                id: result.data.value[0].id,
                value: result.data.value
              }
              if(datas.value.length === 0) {
                showAlertone(err_pu_salah)
              } else {
                  //save Async Storage
                  AsyncStorage.setItem('users', JSON.stringify(datas.value))
                  AsyncStorage.setItem('uid', datas.id)

                  AsyncStorage.setItem('login', 'guest')
                  setTimeout(function () {
                    NavigatorService.reset('Home',{login:'guest'});
                  }, 2000);
             }
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==404){
            showAlertone(err_user404)
            setState(state => ({...state, loading: false }))
          }else{
            showAlertone(err_500V2)
            setState(state => ({...state, loading: false }))
          }
      })

      .catch(err =>{
        //console.log(err)
        showAlertone(err_data)
        setState(state => ({...state, loading: false }))
      })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'} />
      <ScrollView vertical={true} style={{ width:'100%'}}>
        <View style={{alignItems:'center',justifyContent: 'center',marginVertical:'15%',flex:1}}>
          <Loader loading={state.loading} />
          <Image source={allLogo.logo} style={styles.logo} />
          <Text style={styles.title}>BAQi</Text>
          <Text style={styles.desc}>{baqi_desk}</Text>
          <View style={styles.viewContent}>
            {state.updatePass==true ? (
              alert('Perubahan Kata Sandi Berhasil')
            ):null

            }
            <Text style={styles.titleForm}>Login</Text>
            <Text style={styles.descForm}>{infoLoginform}</Text>

            <View style={{height: toDp(25)}} />

            <Text style={styles.textName}>{fpengguna}</Text>
            <TextInput

              style={styles.textInput}
              placeholder={plc_nmpengguna}
              placeholderTextColor={'grey'}
              value={state.username}
              onChangeText={(text) => setState(state => ({...state, username: text })) }
            />
            <View style={{marginTop: toDp(16)}}>
              <Text style={styles.textName}>{fsandi}</Text>
              <TextInput
                style={[styles.textInput, {marginTop: toDp(8)}]}
                placeholder={plc_sandi}
                placeholderTextColor={'grey'}
                secureTextEntry={state.secureTextEntry}

                onChangeText={(text) => Shaone(text) }
              />
              <Pressable style={styles.presableShow} onPress={() => setState(state => ({...state, secureTextEntry: !state.secureTextEntry }))}>
                <Image source={state.secureTextEntry ? allLogo.icVisibilityOff : allLogo.icVisibilityOn} style={styles.icVisibility} />
              </Pressable>
            </View>
            <View style={styles.viewRow}>
              <Pressable style={styles.presableForgot}
                onPress={() => NavigatorService.navigate('ForgotPassword')}>
                <Text style={styles.textForgot}>{lupasandi}</Text>
              </Pressable>
              <Pressable style={styles.presableLogin} onPress={() => getlogin()}>
                <Text style={styles.textLogin}>{masuk}</Text>
              </Pressable>
            </View>

            <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop: toDp(30)}}>
              {/*<Pressable onPress={()=>NavigatorService.navigate('SettingLanguage')} style={{height:toDp(48),marginTop: toDp(8), justifyContent:'center', alignItems:'center'}}>
                  <View style={{backgroundColor:'#ECEAEA',paddingVertical: toDp(5),paddingHorizontal:7, borderRadius:25, flexDirection:'row', justifyContent:'space-between',justifyContent:'center', alignItems:'center'}}>
                    {lang=='id' ?
                      <>
                        <Image source={allLogo.idFlag} style={{height:20, width:20}} />
                        <Text style={{ marginLeft:toDp(8), fontWeight:'bold'}}>ID</Text>
                      </>
                    :
                      <>
                        <Image source={allLogo.enFlag} style={{height:20, width:20}} />
                        <Text style={{ marginLeft:toDp(8), fontWeight:'bold'}}>EN</Text>
                      </>
                    }

                  </View>
              </Pressable>*/}

              <View style={[styles.positionRight, {justifyContent:'center', alignItems:'center'}]}>
                <Pressable
                  onPress={() => NavigatorService.navigate('Register')}
                  style={styles.presableCreate}
                >
                  <Text style={styles.textCreate}>{buatakun}</Text>
                </Pressable>
              </View>
           </View>


          </View>
          <Text style={styles.textDont}>{masukdengan}</Text>
          <View style={styles.rowFooter}>
            {/*<Pressable style={styles.presableClick} onPress={() => googleLogin()} >
              <Image source={allLogo.icGoogle} style={styles.icon} />
            </Pressable>*/}
            {/*}<GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => googleLogin()}
              />*/}

              <Pressable
              	style={[styles.sdw,{borderRadius:5,width:toDp(48), height:toDp(48),  backgroundColor: '#FF3333',marginTop:toDp(8) }]}
              	onPress={() => getGuest()}>
                  <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1), justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                        <Icon
                          name="user-secret"
                          backgroundColor="#3b5998"
                          size={20}
                          color="#FFF"
                        >
                        </Icon>
                  </View>

              </Pressable>

              <Pressable
              	style={[styles.sdw,{borderRadius:5,width:toDp(48), height:toDp(48), backgroundColor: '#FFF',marginTop:toDp(8) }]}
              	onPress={() => googleLogin()}>
                  <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1),  justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                	   <Image source={allLogo.icGoogle} style={styles.icon} />
                  </View>

              </Pressable>

              <Pressable
              	style={[styles.sdw,{borderRadius:5,width:toDp(48), height:toDp(48),  backgroundColor: '#2A598E',marginTop:toDp(8) }]}
              	onPress={() => onFbLogin()}>
                  <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1),  justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                	   <Image source={allLogo.icFacebook} style={styles.icon} />
                  </View>

              </Pressable>

              {Platform.OS=='ios' && (
                  <Pressable
                    style={[styles.sdw,{borderRadius:5,height:toDp(48), width:toDp(48), backgroundColor: '#000',marginTop:toDp(8) }]}
                    onPress={() => alert('Comming Soon')}>
                      <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1),  justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                         <Image source={allLogo.icApple} style={styles.iconApple} />
                      </View>
                  </Pressable>
              )
              }



            {/*<Pressable style={styles.presableClick} onPress={() => onFbLogin()} >
              <Image source={allLogo.icFacebook} style={styles.icon} />
            </Pressable>*/}
          </View>
        </View>
      </ScrollView>
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
  },
  appleBtn: { height: 44, width: 200 },
  presableClick: {
    width: toDp(185),
    height: toDp(48),
    flexDirection:'row',
    justifyContent:'space-between',

    alignItems: 'center',
    borderRadius: toDp(3),
  },
  sdw:{
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  logo: {
    width: toDp(155),
    height: toDp(154),
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0
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
    marginTop: toDp(8),

  },
  positionRight: {
    alignItems: 'flex-end',
    marginTop: toDp(8)
  },
  textForgot: {
    textAlign: 'left',
    fontWeight: '500'
  },
  textDont: {
    marginTop: toDp(16),
    fontSize: toDp(12),
    color: '#000000',
  },

  textClick: {
    fontSize: toDp(14),
    fontWeight: 'bold',
    color: '#009EE2',
  },
  presableShow: {
    padding: toDp(4),
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    height:toDp(48),
    width:toDp(48),
    right: toDp(0),
    top: Platform.OS === 'ios' ? toDp(19) : toDp(23)
  },
  icVisibility: {
    width: toDp(24),
    height: toDp(24),
    tintColor: 'grey'
  },
  rowFooter: {
    marginTop: toDp(8),
    width:'65%',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems:'center',

  },
  icon: {
    width: toDp(20),
    height: toDp(20)
  },
  iconApple: {
    width: toDp(20),
    height: toDp(20),
    tintColor: '#FFF'
  },
  textName: {
    fontSize: toDp(14),
    color: '#000000',
    fontWeight: '400'
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toDp(24)
  },
  presableForgot: {
    width: toDp(130),
    height:toDp(48),
    justifyContent:'center',
    paddingVertical: toDp(4),

  },
  presableCreate: {
    width: toDp(70),
    height:toDp(48),
    justifyContent:'center',
    paddingVertical: toDp(4),

  },
  presableLogin: {
    width: toDp(130),
    height: toDp(48),
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(30),
  },
  textLogin: {
    fontSize: toDp(15),
    letterSpacing: toDp(1),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  textCreate: {
    textAlign: 'right',
    fontWeight:'500'
  },
  titleForm: {
    fontSize: toDp(25),
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
  }
});

export default Login;
