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
  ScrollView,
  Alert,
  TouchableOpacity,AsyncStorage
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
//import { firebase } from '../../Configs/firebase'
import Loader from '@Loader'
import NavigatorService from '@NavigatorService'
import { sha1 } from 'react-native-sha1';
import { svr } from '../../Configs/apikey';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin,
  GoogleSigninButton,
  statusCodes, } from '@react-native-google-signin/google-signin';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const Register = (props) => {
  const { t }   = useTranslation();
  let lang =  t('common:lang');
  let informasi =  t('common:informasi');
  let batal      =  t('common:batal');
  let oke        =  t('common:oke');
  let fnama        =  t('common:fnama');
  let fnohp        =  t('common:fnohp');
  let femail       =  t('common:femail');
  let fpengguna    = t('common:fpengguna');
  let fsandi       = t('common:fsandi');
  let lupasandi    = t('common:lupasandi');
  let buatakun     = t('common:buatakun');
  let masuk        = t('common:masuk');
  let daftardengan  = t('common:daftardengan');
  let btnRfb        = t('common:btnRfb');
  let btnRgoogle    = t('common:btnRgoogle');
  let plc_nmpengguna = t('common:plc_nmpengguna');
  let plc_sandi      = t('common:plc_sandi');
  let plc_nama        = t('common:plc_nama');
  let plc_sandiv2     = t('common:plc_sandiv2');
  let plc_nmpenggunav2= t('common:plc_nmpenggunav2');
  let plc_email       = t('common:plc_email');
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
  let err_sandi       = t('common:err_sandi');
  let tnc             = t('common:tnc');
  let inf_emailValid  = t('common:inf_emailValid');
  let daftar          = t('common:daftar');
  let atau            = t('common:atau');
  let err_namaNull    = t('common:err_namaNull');
  let err_hpNull      = t('common:err_hpNull');
  let err_emailNull   = t('common:err_emailNull');
  let err_unameNull   = t('common:err_unameNull');
  let err_pswNull     = t('common:err_pswNull');
  let inf_regsukses   = t('common:inf_regsukses');
  let gueslogin       = t('common:gueslogin');

  const [state, setState] = useState({
    loading: false,
    secureTextEntry: true,
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    picture: '',
    encpass:'',
    valName:false,
    valMail:false,
    valPass:false,
    userfbInfo:[],
    linkLogin:'',
    GUser:[],
  })
  const [isSelected, setSelection] = useState(false)
  const [isDisable, setDisable] = useState(true)
  const [llogin, setLogin] = useState('');

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

  const validateMail = (text) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setState(state => ({...state, valMail: true }))
      setState(state => ({...state, email: text }))

      return false;
    }
    else {
      setState(state => ({...state, email: text }))
      setState(state => ({...state, valMail: false }))

    }
  }

  const ToasSuccess = () =>{
     Toast.show({
       type: 'success',
       visibilityTime: 6000,
       position:'bottom',
       bottomOffset:10 ,
       text1: daftar,
       text2: inf_regsukses+' 👋'
    });
  }

  const RegisterUser = async (value) => {
    const body = {
     name: state.name,
     email: state.email,
     phone: state.phone,
     username: state.username,
     password: state.password
   }

   setState(state => ({...state, loading: true }))
   axios.post(svr.url+'users/'+svr.api+'/',body)
   .then(result =>{
       if(result.data.status==201){
         console.log('Register : '+ JSON.stringify(result))
         setState(state => ({...state, loading: false }))
         ToasSuccess();
         setTimeout(function () {
           NavigatorService.reset('Login');
         },5000)
       }else{
         showAlertone(err_reg409)
         setState(state => ({...state, loading: false }))
       }
   }).catch(err =>{
     showAlertone(err_regGagal)
     setState(state => ({...state, loading: false }))
   })
  }

  const passlength = (pass) =>{
    const psw = pass;

    if(psw.length >= 6 ){
      setState(state => ({...state, valPass: false }));
      Shaone(pass);

    }else{
      setState(state => ({...state, valPass: true }))

    }
  }

  const Shaone = (pass) =>{
    sha1(pass).then( hash => {
      setState(state => ({...state, password: hash }));
    })
  }

  const toggleAgree = (val) => {
    setSelection(val)
    if(isSelected==true){
      setDisable(true)
    }else{
      setDisable(false)
    }
  }

  const validateInput = () =>{
      if(state.name.trim()==''){
        showAlert(err_namaNull)
        return;
      }
      if(state.email.trim()==''){
        showAlert(err_emailNull)
        return;
      }

      if(state.username.trim()==''){
        showAlert(err_unameNull)
        return;
      }
      if(state.password.trim()==''){
        showAlert(err_pswNull)
        return;
      }

      RegisterUser()
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
            picture:newdata.user.photo,
            email:newdata.user.email
          }]

        })
        //console.log('user log : '+ JSON.stringify(datas))
        //console.log('user body : '+ JSON.stringify(body))
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
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        showAlertone(err_proseson)
        //console.log("user info 3",error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        showAlert(err_playservice)
      } else {
        showAlertone(err_prosesoff)
        // some other error happened
        //console.log("user info 5",error)
      }
    }
  };

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

      const data = {email: email}
      setState(state => ({...state, loading: true }))
        axios.post(svr.url+'login/'+svr.api+'/', data)
        .then(result =>{
            if(result.data.status==200){
                const datas = {
                  id: result.data.value[0].id,
                  value: result.data.value
                }

                if(datas.value.length === 0) {
                   RegisterUserm(body,id,dataus, login);
                } else {
                  //save Async Storage

                  console.log('datas regestred ------------>'+JSON.stringify(datas));
                  AsyncStorage.setItem('users', JSON.stringify(datas.value))
                  AsyncStorage.setItem('uid', datas.id)
                  if(login=='google'){
                     AsyncStorage.setItem('login', 'google')
                     setTimeout(function () {
                       NavigatorService.reset('Home',{login:'google'});
                     }, 2000);

                  }else{
                     AsyncStorage.setItem('login', 'facebook')
                     setTimeout(function () {
                       NavigatorService.reset('Home',{login:'facebook'})
                     }, 2000);
                  }

               }
                setState(state => ({...state, loading: false }))

            }else if(result.data.status==404){
              setState(state => ({...state, loading: false }))
              RegisterUserm(body,id,dataus,login);
            }else if(result.data.status==500){
              showAlertone(err_data)
              setState(state => ({...state, loading: false }))
            }
        }).catch(err =>{
          //console.log(err)
          showAlertone(err_konek)
          setState(state => ({...state, loading: false }))
        })
}

  const RegisterUserm = (body,id,datas,login) => {
      setState(state => ({...state, loading: true }))
      axios.post(svr.url+'users/'+svr.api+'/',body)
      .then(result =>{
        console.log('STS=========> : '+ JSON.stringify(datas))
          if(result.data.status==201){
            console.log('Register =========> : '+ JSON.stringify(datas))
            AsyncStorage.setItem('users', JSON.stringify(datas[0].value))
            AsyncStorage.setItem('uid', JSON.stringify(datas[0].id))
            if(login==='google'){
              //console.log('LOGIN G=>'+state.linkLogin)
               AsyncStorage.setItem('login', 'google')
               NavigatorService.reset('Home',{login:'google'});
            }else{
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

  {/*Guest Login*/}
  const getGuest = async() =>{
    setState(state => ({...state, linkLogin: 'guest' }))
    console.log(svr.url+'login/guest/yes/'+svr.api+'/');
    setState(state => ({...state, loading: true }))
      axios.post(svr.url+'login/guest/yes/'+svr.api+'/')
      .then(result =>{
          console.log('GUEST'+ JSON.stringify(result.data));
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
    <View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Loader loading={state.loading} />
              <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'} />
            <Image source={allLogo.logo} style={styles.logo} />
            <View style={styles.viewContent}>

              <Text style={styles.titleForm}>{buatakun}</Text>

              <View style={{height: toDp(0)}} />

              <Text style={[styles.textName, {marginTop: toDp(16)}]}>{fnama}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={plc_nama}
                placeholderTextColor={'grey'}
                value={state.name}
                onChangeText={(name) => setState(state => ({...state, name }))}
              />

              <Text style={[styles.textName, {marginTop: toDp(16)}]}>{femail}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={plc_email}
                placeholderTextColor={'grey'}
                value={state.email}
                onChangeText={(email) =>  validateMail(email)}
              />
              { state.valMail === true ? (
               <Text style={styles.errorMessage}>
                 * {inf_emailValid}
               </Text>
              ) : null  }

              <Text style={[styles.textName, {marginTop: toDp(16)}]}>{fnohp}</Text>
              <TextInput
                style={styles.textInput}
                keyboardType = 'numeric'
                placeholder={'08XXXXX'}
                placeholderTextColor={'grey'}
                value={state.phone}
                onChangeText={(phone) => setState(state => ({...state, phone }))}
              />

              <Text style={[styles.textName, {marginTop: toDp(16)}]}>{fpengguna}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={plc_nmpenggunav2}
                placeholderTextColor={'grey'}
                value={state.username}
                onChangeText={(username) => setState(state => ({...state, username }))}
              />

              <View style={{marginTop: toDp(16)}}>
                <Text style={styles.textName}>{fsandi}</Text>
                <TextInput
                  style={[styles.textInput, {marginTop: toDp(8)}]}
                  placeholder={plc_sandiv2}
                  placeholderTextColor={'grey'}
                  secureTextEntry={state.secureTextEntry}
                  onChangeText={(password) => passlength(password)}
                />
                <Pressable style={styles.presableShow} onPress={() => setState(state => ({...state, secureTextEntry: !state.secureTextEntry })) }>
                  <Image source={state.secureTextEntry ? allLogo.icVisibilityOff : allLogo.icVisibilityOn} style={styles.icVisibility} />
                </Pressable>

                { state.valPass === true ? (
                 <Text style={styles.errorMessage}>
                   * {err_sandi}
                 </Text>
                ) : null  }

              </View>
              <View style={{flexDirection:'row', alignItems:'center', marginTop:5}}>
                   <CheckBox
                      value={isSelected}
                      onValueChange={(val) => toggleAgree(val)}
                      style={styles.checkbox}
                      tintColor={'green'}
                      onCheckColor={'red'}
                      onFillColor={'yellow'}
                      onTintColor={'#80F4E8'}
                    />
                   <Pressable style={{padding:5, marginLeft:toDp(-10),height:toDp(48),justifyContent:'center'}} onPress={()=> NavigatorService.navigate('Terms')}>
                      <Text style={{fontSize:11}}>{tnc}</Text>
                   </Pressable>
              </View>

              <View style={styles.viewRow}>
                <Pressable
                  onPress={() => ToasSuccess() }
                  style={styles.presableForgot}
                >
                  <Text style={styles.textForgot}>{masuk}</Text>
                </Pressable>
                <TouchableOpacity disabled={isDisable} style={[styles.presableLogin, { backgroundColor: isDisable==true ?  '#9FCCBA' : '#2D6A4F'} ]}
                           onPress={() => validateInput()}>
                  <Text style={styles.textLogin}>{daftar}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.textDont}>{atau} {daftardengan}</Text>
            <View style={styles.rowFooter}>
                  <Pressable
                    style={[styles.sdw,{borderRadius:5,width:toDp(48), height:toDp(48), flexDirection: 'row', backgroundColor: '#FF3333',marginTop:toDp(8) }]}
                    onPress={() => getGuest()}>
                      <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1), justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                            <Icon
                              name="user-secret"
                              backgroundColor="#3b5998"
                              size={20}
                              color="#fff"
                            >
                            </Icon>
                      </View>

                  </Pressable>

                  <Pressable
                    style={[styles.sdw,{borderRadius:5,width:toDp(48), height:toDp(48), backgroundColor: '#fff',marginTop:toDp(8) }]}
                    onPress={() => googleLogin()}>
                      <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1), backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                         <Image source={allLogo.icGoogle} style={styles.icon} />
                      </View>

                  </Pressable>

                  <Pressable
                    style={[styles.sdw,{borderRadius:5,height:toDp(48), width:toDp(48), backgroundColor: '#2A598E',marginTop:toDp(8) }]}
                    onPress={() => onFbLogin()}>
                      <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1),  justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                         <Image source={allLogo.icFacebook} style={styles.icon} />
                      </View>
                  </Pressable>

                  {Platform.OS=='ios' ?
                      <Pressable
                        style={[styles.sdw,{borderRadius:5,height:toDp(48), width:toDp(48), backgroundColor: '#000',marginTop:toDp(8) }]}
                        onPress={() => alert('commingsoon')}>
                          <View style={{ width: toDp(46), height: toDp(46), left: toDp(1),top:toDp(1),  justifyContent: 'center', alignItems: 'center', borderRadius: toDp(3) }}>
                             <Image source={allLogo.icApple} style={styles.iconApple} />
                          </View>
                      </Pressable>
                    :<View></View>
                  }


            </View>


          </View>
        </ScrollView>
      <Toast />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: '20%'
  },
  checkbox: {
    alignSelf: "center",
    width:toDp(48),
    height:toDp(48),
    justifyContent:'center'
  },
  scrollView: {
    height : '100%',
    bottom: 0,
    backgroundColor: '#FFF'
  },
  logo: {
    width: toDp(155),
    height: toDp(154),
    position: 'absolute',
    zIndex: 1,
    bottom: 10,
    left: 0,

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
  viewContent: {
    zIndex: 2,
    width: '100%',
    height: 'auto',
    backgroundColor: '#52B788',
    borderBottomLeftRadius: toDp(24),
    borderBottomRightRadius: toDp(24),
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
  textForgot: {
    textAlign: 'left'
  },
  textDont: {
    marginTop: toDp(16),
    fontSize: toDp(12),
    color: '#000000',
  },
  presableClick: {
    width: toDp(185),
    height: toDp(48),
    flexDirection:'row',
    justifyContent:'space-between',

    alignItems: 'center',
    borderRadius: toDp(3),
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
    fontSize: toDp(12),
    color: '#000000',
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toDp(5)
  },
  presableForgot: {
    width: toDp(130),
    height:toDp(48),
    justifyContent:'center',
    paddingVertical: toDp(4),
  },
  presableLogin: {
    width: toDp(130),
    height: toDp(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(30),
  },
  textLogin: {
    fontSize: toDp(13),
    letterSpacing: toDp(1),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  textCreate: {
    textAlign: 'right'
  },
  titleForm: {
    fontSize: toDp(27),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: toDp(34)
  },
  descForm: {
    fontSize: toDp(12),
    color: '#000000',
    textAlign: 'center',
    marginTop: toDp(14)
  },
  errorMessage:{
    marginTop:toDp(3),
    color: '#780000',
    fontSize: 13,
    left:0,
    position: 'relative',

  }
});

export default Register;
