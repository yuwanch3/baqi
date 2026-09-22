import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,AsyncStorage,BackHandler,Alert
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import NavigatorService from '@NavigatorService'
import '../../Translate/IMLocalize';
import Home from './Home'
import Prosses from './Prosses'
import User from './Profile'
import { useTranslation } from 'react-i18next';

const Homepage = (props) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    content: 'home', // home, user, setting
    linkLogin: '',
    uid:''
  })

  useEffect(()=> {
    AsyncStorage.getItem('uid').then(uids =>{
      let ids = uids;
      setState(state => ({...state,
        uid: ids
      }))
    });
  }, [])

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert("Hold on!", "Tutup aplikasi?", [
  //       {
  //         text: "Batal",
  //         onPress: () => null,
  //         style: "cancel"
  //       },
  //       { text: "Keluar", onPress: () => BackHandler.exitApp() }
  //     ]);
  //     return true;
  //   };
  //
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );
  //
  //   return () => backHandler.remove();
  // }, []);

  return(
    <View style={styles.container}>
    <StatusBar barStyle="light-content" translucent={false} />
        {
          state.content == 'home' || state.content == 'user'?
          <>
              <View style={styles.header}>
                <ImageBackground source={allLogo.HomeHeader} resizeMode="cover" style={styles.background}>
                      <View style={styles.headerIn}>
                        <Text style={styles.title}>{t('common:judulApp')}</Text>
                      </View>
                </ImageBackground>
                <View style={{position:'absolute', left:toDp(30), bottom:toDp(30), width:110}}>
                  <Pressable onPress={()=>NavigatorService.navigate('SettingLanguage')} style={{backgroundColor:'red',padding:4, borderRadius:6, justifyContent:'center', alignItems:'center'}}>
                     <Text style={{fontSize:toDp(13),color:'#FFF',fontWeight:'bold'}}>{ t('common:gantiBahasa')}</Text>
                  </Pressable>
                </View>
              </View>

          </>
          :
            <></>
        }


        <View style={styles.content}>
        {
          state.content == 'home' ?
            <Home />

          : state.content == 'user' ?
            <User />
          :

            <Prosses />
        }
      </View>

        <View style={styles.footer}>
            <Pressable style={[styles.presable,  {backgroundColor: state.content === 'home' ? '#378561' : '#52B788'}]} onPress={() => setState(state => ({...state, content: 'home' }))}>
              <Image source={allLogo.icHome} style={styles.icon} />
              <Text style={{color:'#fff', fontSize:toDp(11),marginTop:toDp(3)}}>{t('common:deskBeranda')}</Text>
            </Pressable>

            <Pressable style={[styles.presable,  {backgroundColor: state.content === 'user' ? '#378561' : '#52B788'}]} onPress={() => setState(state => ({...state, content: 'user' }))}>
              <Image source={allLogo.icUser} style={styles.icon} />
              <Text style={{color:'#fff', fontSize:toDp(11),marginTop:toDp(3)}}>{t('common:deskProfil')}</Text>
            </Pressable>

            <Pressable style={[styles.presable,  {backgroundColor: state.content === 'setting' ? '#378561' : '#52B788'}]} onPress={() => setState(state => ({...state, content: 'setting' }))}>
              <Image source={allLogo.lcSetting} style={styles.icon} />
              <Text style={{color:'#fff', fontSize:toDp(11),marginTop:toDp(3)}}>{t('common:deskProses')}</Text>
            </Pressable>

        </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header:{
    width: '100%',
    height: toDp(163),
    backgroundColor: '#52B788',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: toDp(0)
  },
  content: {
    flex: 1,
  },
  icon:{
    width:toDp(30),
    height:toDp(30),
  },
  title:{
    fontSize: toDp(23),
    fontWeight: 'bold',
    color: '#FFF',
    width:toDp(229)
  },
  background: {
    width: '100%',
    height: toDp(163),
    borderBottomRightRadius: toDp(24),
    position:'absolute',
    resizeMode:'cover',

  },
  headerIn:{
    justifyContent: 'center',
    position: 'absolute',
    left: toDp(30),
    height: toDp(140),

  },
  card:{
    flex: 1,
    alignItems: 'center',
  },
  titlemn:{
    fontSize: toDp(20),
    fontWeight: 'bold',
    color: '#FFF',
    width: toDp(199)
  },
  titledt:{
    fontSize: toDp(12),
    color: '#FFF',
  },
  mnrow:{
    justifyContent: 'center',
  },
  menu:{
    width: toDp(296),
    height: toDp(88),
    borderRadius: toDp(25),
    padding: toDp(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: toDp(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footer:{
    width: '100%',
    height: toDp(75),
    flexDirection: 'row',
    borderTopLeftRadius: toDp(26),
    borderTopRightRadius: toDp(26),
    backgroundColor: '#52B788',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  presable: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 }

});

export default Homepage;
