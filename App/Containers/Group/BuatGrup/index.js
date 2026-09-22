import React, { useRef,useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  Pressable,
  Platform,
  ScrollView,Button,
  TouchableOpacity,AsyncStorage, Alert
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
//import { firebase } from '../../Configs/firebase'
import Loader from '@Loader'
import NavigatorService from '@NavigatorService'
import { svr } from '../../../Configs/apikey';
import axios from 'axios';
import HeaderTransparent from '@HeaderTransparent'
import Toast from 'react-native-toast-message';
import { sha1 } from 'react-native-sha1';
import { useTranslation } from 'react-i18next';
const BuatGrup = (props) => {
  const { t } = useTranslation();
  let err_data  = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull  = t('common:dataNull');
  let err_404   = t('common:err_404');
  let err_500   = t('common:err_500');
  let bg_judul = t('common:bg_judul');
  let bg_fnama = t('common:bg_fnama');
  let bg_fdesk = t('common:bg_fdesk');
  let bg_fpass = t('common:bg_fpass');
  let gbuat = t('common:gbuat');
  let plc_gnama  = t('common:plc_gnama');
  let plc_gdesk  = t('common:plc_gdesk');
  let plc_gsandi = t('common:plc_gsandi');
  let err_sandi  = t('common:err_sandi');
  let err_grpJudul= t('common:err_grpJudul');
  let err_grpDesk= t('common:err_grpDesk');
  let err_grpSandi= t('common:err_grpSandi');
  let berhasil = t('common:berhasil');
  let g_suksesbuat = t('common:g_suksesbuat');
  let informasi =  t('common:informasi');
  let kembali   =  t('common:kembali');


    const [isDisable, setDisable] = useState(true)
    const [state, setState] = useState({
      judul:'',
      deskrip:'',
      password:'',
      uid:'',
      valPass:false,
      secureTextEntry: true,
    })

    useEffect(() => {
      AsyncStorage.getItem('uid').then(uids =>{
        let ids = uids;
        setState(state => ({...state,
          uid: ids
        }))
      });

    },[])

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

    const ToasSuccess = () =>{
       Toast.show({
         type: 'success',
         visibilityTime: 6000,
         position:'bottom',
         bottomOffset:10 ,
         text1: berhasil,
         text2: g_suksesbuat
      });
    }

    const createGrup = () =>{
      const data = {
        judul_grup: state.judul,
        desc_grup: state.deskrip,
        pass_grup: state.password,
        owner: state.uid
      }

      setState(state => ({...state, loading: true }))
        axios.post(svr.url+'grup/'+svr.api+'/', data)
        .then(result =>{
          console.log('--------> '+ JSON.stringify(result.data));
            if(result.data.status==201){
                const datas = {
                  id: result.data.idg,
                }
                ToasSuccess()
               if(datas.id.length > 0) {
                   //to group saya
                   //console.log('--------> '+ datas.id.length);
                   setTimeout(function () {
                      NavigatorService.navigate('GrupSaya', {uid:state.uid})
                   },5000)
               }
              setState(state => ({...state, loading: false }))
            }else if(result.data.status==500){
              showAlertone(err_duplikatDesk)
              setState(state => ({...state, loading: false }))

            }else if(result.data.status==405){

              showAlertone(err_grpMax)
              setState(state => ({...state, loading: false }))
            }
        }).catch(err =>{
          //console.log(err)
          showAlertone(err_data)
          setState(state => ({...state, loading: false }))
        })
    }

    const passlength = (pass) =>{
      const psw = pass;
      if(psw.length >= 6 ){
        setState(state => ({...state, valPass: false }));
        Shaone(pass);

          setDisable(false)

      }else{
        setState(state => ({...state, valPass: true }))
        setDisable(true)
      }
    }

    const Shaone = (pass) =>{
      sha1(pass).then( hash => {
        setState(state => ({...state, password: hash }));
      })
    }

    const validata = () =>{
      if(state.judul.trim()==''){
        showAlert(err_grpJudul)
        return;
      }
      if(state.deskrip.trim()==''){
        showAlert(err_grpDesk)
        return;
      }
      if(state.password.trim()==''){
        showAlert(err_grpSandi)
        return;
      }
      createGrup()
    }

    const showAlert = (data) => {
      Alert.alert(
        ""+informasi,
        "Perhatian, "+data,
        [
          {
            text: "Oke",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      )
    }

    return(
    <View style={styles.container}>
        {/* <Loader loading={state.loading} /> */}
        <HeaderTransparent
        title={'Grup'}
        onPress={() => props.navigation.goBack()}
        />

        <ScrollView vertical={true}>
            <View style={styles.viewContent}>
                <Text style={styles.titleForm}>{bg_judul}</Text>

                <View style={{height: toDp(16)}} />

                <View style={{marginTop: toDp(0)}}>
                  <Text style={[styles.textName, {marginTop: toDp(16)}]}>{bg_fnama}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={plc_gnama}
                    placeholderTextColor={'grey'}
                    value={state.judul}
                    onChangeText={(judul) => setState(state => ({...state, judul }))}
                  />
                </View>
                <View style={{marginTop: toDp(0)}}>
                    <Text style={[styles.textName, {marginTop: toDp(16)}]}>{bg_fdesk}</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={plc_gdesk}
                      placeholderTextColor={'grey'}
                      value={state.deskrip}
                      onChangeText={(deskrip) =>  setState(state => ({...state, deskrip }))}
                    />
                </View>

                <View style={{marginTop: toDp(0)}}>
                    <Text style={[styles.textName, {marginTop: toDp(16)}]}>{bg_fpass}</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={plc_gsandi}
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
                    <View style={{marginTop:20, alignItems:'flex-end', width:'100%', justifyContent:'center'}}>
                        <TouchableOpacity disabled={isDisable} style={[styles.buttoSubmit, { backgroundColor: isDisable==true ?  '#9FCCBA' : '#2D6A4F'} ]}
                                   onPress={() => validata()}>
                          <Text style={{color:'#fff'}}>{gbuat}</Text>
                        </TouchableOpacity>
                    </View>

            </View>
        </ScrollView>
        <Toast/>
    </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor: 'white',
    },
    viewContent: {
        zIndex: 2,
        width: '100%',
        height: 'auto',
        backgroundColor: '#FFF',
        borderBottomLeftRadius: toDp(24),
        borderBottomRightRadius: toDp(24),
        padding: toDp(25),

      },
      logo: {
        width: toDp(155),
        height: toDp(154),
        position: 'absolute',
        zIndex: 1,
        bottom: 10,
        left: 0,

      },
      titleForm: {
        fontSize: toDp(27),
        fontWeight: 'bold',
        color: '#024024',
        marginTop: toDp(0)
      },
      textInput: {
        width: '100%',
        height: toDp(48),
        backgroundColor: '#f4f4f4',
        paddingHorizontal: toDp(8),
        borderRadius: toDp(4),
        marginTop: toDp(8)
      },
      buttoSubmit: {
        width: '50%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: toDp(60),
        right:0
      },
      textbutton: {
          fontWeight: 'bold',
          color: 'white'
      },
      errorMessage:{
        marginTop:toDp(3),
        color: '#780000',
        fontSize: 13,
        left:0,
        position: 'relative',

      },
      presableShow: {
        padding: toDp(4),
        position: 'absolute',
        justifyContent:'center',
        alignItems:'center',
        height:toDp(48),
        width:toDp(48),
        right: toDp(0),
        top: Platform.OS === 'ios' ? toDp(36) : toDp(40)
      },
      icVisibility: {
        width: toDp(24),
        height: toDp(24),
        tintColor: 'grey'
      },
});

export default BuatGrup;
