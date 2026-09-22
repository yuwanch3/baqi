import React, {useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable, AsyncStorage
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import { useTranslation } from 'react-i18next';
import NavigatorService from '@NavigatorService';
import { svr } from '../../Configs/apikey';
import axios from 'axios';


const SplashScreen = () => {
  const { t }   = useTranslation();
  let lang =  t('common:lang');
  let baqi_desk= t('common:baqi_desk');
  useEffect(() => {
      getStatus()
  }, []);

  const getStatus = () =>{
    let data = {
      api: svr.api
    }

    axios.post(svr.url+'splash/'+svr.api+'/', data)
    .then(result =>{
      console.log('--------->'+ JSON.stringify(result.data));
        if(result.data.status==200){
          if(result.data.value=='Maintenance'){
            NavigatorService.reset('Maintenance')
          }else{
            setTimer()
          }

        }else if(result.data.status==405){
          alert('Something is wrong, please update app')

        }else{
          setTimer()
        }
    })

    .catch(err =>{
      //console.log(err)
      alert('Something is wrong, please update app')
    })
  }

  const setTimer=()=>{
    setTimeout(function(){
      AsyncStorage.getItem('users').then(response => {
        console.log('response', response);
        //cek data null / tidak
        if(response == null) {
          NavigatorService.reset('Login')
        } else {
          NavigatorService.reset('Home')
        }
      }).catch(err => {
        console.log('err', err)
      })
    }, 1000);
  }


  return(
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'} />
      <View style={styles.content}>
        <ImageBackground source={allLogo.background} resizeMode="cover" style={styles.background}>
          <Text style={styles.title}>BAQI</Text>
          <Text style={styles.desc}>{baqi_desk}</Text>
          <Pressable
            style={styles.buttonGet}>
            <Text style={styles.textGet}>Get Ready</Text>
          </Pressable>
        </ImageBackground>
      </View>
    </View>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: toDp(296),
    height: toDp(437),
    backgroundColor: '#52B788',
    borderRadius: toDp(25)
  },
  background: {
    width: toDp(296),
    height: toDp(437),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'white',
  },
  desc: {
    fontSize: toDp(18),
    fontWeight: 'bold',
    color: 'white',
  },
  buttonGet: {
    width: toDp(165),
    height: toDp(48),
    backgroundColor: '#B7E4C7',
    borderRadius: toDp(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: toDp(-23)
  },
  textGet: {
    fontSize: toDp(20),
    fontWeight: 'bold',
    color: 'black',
  }
});

export default SplashScreen;
