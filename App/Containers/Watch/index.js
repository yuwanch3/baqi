import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable, ScrollView
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import NavigatorService from '@NavigatorService'
import YoutubePlayer from "react-native-youtube-iframe";
import { useTranslation } from 'react-i18next';
import translate from 'translate-google-api';

const Watch = (props) => {
  const { t }   = useTranslation();
  let lang =  t('common:lang');
  let baca =  t('common:baca');
  let ujian =  t('common:ujian');
  const [langTo,setTo]=useState('');
  const [nowlang,setNow]=useState('');

  useEffect(()=>{
    if(lang=='en'){
      setTo('en')
      setNow('id')
      console.log('s-->' +langTo +'|'+nowlang);
    }
  },[])

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
      <Header
        title={props.navigation.state.params.value.information}
        onPress={() => props.navigation.goBack()}
      />
      <YoutubePlayer
        width={'100%'}
        height={toDp(300)}
        play={true}
        videoId={props.navigation.state.params.link.split(".be/")[1]}
      />

      <ScrollView style={styles.scrollView}>
        <Text style={styles.desc}>
          {lang=='id' &&
                props.navigation.state.params.value.description
          }
          {lang=='en' &&
              trans(props.navigation.state.params.value.description, nowlang, langTo)
          }



        </Text>
        <View style={styles.viewButton}>
          {lang=="id" ?
              <Pressable
                onPress={() => NavigatorService.navigate('Read', {link: props.navigation.state.params.value.doc, value: props.navigation.state.params.value})}
                style={[styles.presableButton, {backgroundColor: '#7BA95C'}]}
              >
                <Text style={styles.text}>{baca}</Text>
              </Pressable>
          :
              <Pressable
                onPress={() => NavigatorService.navigate('Read', {link: props.navigation.state.params.value.doc_en, value: props.navigation.state.params.value})}
                style={[styles.presableButton, {backgroundColor: '#7BA95C'}]}
              >
                <Text style={styles.text}>{baca}</Text>
              </Pressable>

          }

              <Pressable
                onPress={() => NavigatorService.navigate('Exam', {value: props.navigation.state.params.val, uid:props.navigation.state.params.uid , title:props.navigation.state.params.value.information})}
                style={[styles.presableButton, {backgroundColor: '#EE6C4D'}]}>
                <Text style={styles.text}>{ujian}</Text>
              </Pressable>
        </View>
        <View style={{height: toDp(60)}} />
      </ScrollView>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'black',
  },
  scrollView: {
    marginTop: toDp(-80)
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

export default Watch;
