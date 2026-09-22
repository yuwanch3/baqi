import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,
  Dimensions
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';

const Download = (props) => {
  const { t }   = useTranslation();
  let txt_loader  = t('common:txt_loader');
  let terimakasih = t('common:terimakasih');
  return (
    <View style={styles.container}>
      <Header
        title={props.navigation.state.params.value.information}
        onPress={() => props.navigation.goBack()}
      />
      <View style={{zIndex:3, width:'100%', justifyContent:'center', alignItems:'center',position:'relative', marginTop:'70%'}}>
        <Text style={{fontSize:23, fontWeight:'bold'}}>{txt_loader}</Text>
        <Text>{terimakasih}</Text>

      </View>
      <WebView
        source={{uri: props.navigation.state.params.link}}
      />

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'black',
  },
  pdf: {
    zIndex:1,
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  }
});

export default Download;
