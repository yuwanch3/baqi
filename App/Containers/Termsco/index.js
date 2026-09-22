import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import NavigatorService from '@NavigatorService'
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';


const Terms = () => {
  const { t }   = useTranslation();
  let snk =  t('common:snk');
  const [state, setState] = useState({
    content: 'home', // home, user, setting
    linkLogin: ''
  })


  return(
    <View style={styles.container}>
        <View style={styles.header}>
          <ImageBackground source={allLogo.HomeHeader} resizeMode="cover" style={styles.background}>
            <View style={styles.headerIn}>
              <Text style={styles.title}>{snk}</Text>
            </View>
          </ImageBackground>

        </View>

        <View style={styles.content}>
        <WebView
          source={{uri: 'https://baqi.jannahku.com/baqi/privacy-policy.html'}}
        />
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
    marginBottom: toDp(30)
  },
  content:{
    flex:1,

    width:'100%',
    backgroundColor:'cyan'
  },
  title:{
    fontSize: toDp(20),
    fontWeight: 'bold',
    color: '#FFF',
    width: toDp(199)
  },
  background: {
    width: '100%',
    height: toDp(163),
    borderBottomRightRadius: toDp(24),
    position:'absolute',
    resizeMode:'cover'
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

export default Terms;
