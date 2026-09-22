import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,Alert,BackHandler
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import NavigatorService from '@NavigatorService'
import YoutubePlayer from "react-native-youtube-iframe";
import { useTranslation } from 'react-i18next';
import translate from 'translate-google-api';

const Maintenance = (props) => {
  const { t }   = useTranslation();
  let lang =  t('common:lang');
  let keluar =  t('common:keluar');
  let exit =  t('common:exit');
  let konfirmasi =  t('common:konfirmasi');
  const [langTo,setTo]=useState('');
  const [nowlang,setNow]=useState('');

  useEffect(()=>{
    const backAction = () => {
        Alert.alert(konfirmasi, exit,[
          { text: keluar, onPress: () => Exits() }
        ]);
        return true;

    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  },[])

  const Exits = () =>{
    BackHandler.exitApp();
  }
  const trans = (val, from, to)=>{
     let data=''
    const [r, setR]=useState('');
    translate(val, {from: from, to: to})
    .then(res => {
           setR(res)
           data = r
    })
    return r
  }
  return (
    <View style={styles.container}>

      <View style={{
            justifyContent:'center',
            alignItems:'center', flex:1
      }}>
        <Image source={allLogo.udc} style={styles.imgUdc} />

      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'black',
  },
  imgUdc: {
    marginTop: toDp(-30),
    justifyContent:'center',
    alignItems:'center',
    width:toDp(280),
    height: toDp(280)
  },
  desc: {
    fontSize: toDp(14),
    color: 'black',
    marginHorizontal: toDp(16),
  },
  viewButton: {
    marginTop: toDp(16),
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  presableButton: {
    width: toDp(100),
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
    fontSize: toDp(20),
    fontWeight: 'bold',
    color: 'white',
  }

});

export default Maintenance;
