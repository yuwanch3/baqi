import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable, ScrollView, AsyncStorage
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import NavigatorService from '@NavigatorService'
import YoutubePlayer from "react-native-youtube-iframe";
import { useTranslation } from 'react-i18next';
import translate from 'translate-google-api';
import getYoutubeId from '@YoutubeId';
import VideoLanguageSwitch from '@VideoLanguageSwitch';

const pickVideoLanguage = (preferred, hasIndonesian, hasEnglish) => {
  if (preferred === 'id' && hasIndonesian) {
    return 'id';
  }
  if (preferred === 'en' && hasEnglish) {
    return 'en';
  }
  if (hasIndonesian) {
    return 'id';
  }
  if (hasEnglish) {
    return 'en';
  }
  return '';
};

const Watch = (props) => {
  const { t }   = useTranslation();
  let lang =  t('common:lang');
  let baca =  t('common:baca');
  let ujian =  t('common:ujian');
  const [langTo,setTo]=useState('');
  const [nowlang,setNow]=useState('');

  const params = props.navigation.state.params || {};
  const material = params.value || {};
  const indonesianUrl = material.watch_id;
  const englishUrl = params.link || material.watch;
  const hasIndonesian = Boolean(getYoutubeId(indonesianUrl));
  const hasEnglish = Boolean(getYoutubeId(englishUrl));
  const hasVideo = hasIndonesian || hasEnglish;

  const [videoLanguage, setVideoLanguage] = useState(
    pickVideoLanguage(lang, hasIndonesian, hasEnglish)
  );

  useEffect(()=>{
    if(lang=='en'){
      setTo('en')
      setNow('id')
      console.log('s-->' +langTo +'|'+nowlang);
    }
  },[])

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem('video-language')
      .then((saved) => {
        if (active) {
          setVideoLanguage(pickVideoLanguage(saved || lang, hasIndonesian, hasEnglish));
        }
      })
      .catch(() => {
        if (active) {
          setVideoLanguage(pickVideoLanguage(lang, hasIndonesian, hasEnglish));
        }
      });
    return () => {
      active = false;
    };
  }, [lang, hasIndonesian, hasEnglish]);

  const changeVideoLanguage = (next) => {
    if (next === 'id' && !hasIndonesian) {
      return;
    }
    if (next === 'en' && !hasEnglish) {
      return;
    }
    setVideoLanguage(next);
    AsyncStorage.setItem('video-language', next);
  };

  const videoId = videoLanguage === 'id'
    ? getYoutubeId(indonesianUrl)
    : getYoutubeId(englishUrl);

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
        title={material.information}
        onPress={() => props.navigation.goBack()}
      />
      {hasVideo ? (
        <YoutubePlayer
          key={videoId}
          width={'100%'}
          height={toDp(300)}
          play={true}
          videoId={videoId}
        />
      ) : (
        <View style={styles.videoUnavailable}>
          <Text style={styles.videoUnavailableText}>{t('common:videoTidakTersedia')}</Text>
        </View>
      )}

      <ScrollView
        style={[styles.scrollView, !hasVideo ? styles.scrollViewNoVideo : null]}
        contentContainerStyle={hasVideo ? styles.scrollContent : styles.scrollContentNoVideo}
      >
        {hasVideo && (
          <VideoLanguageSwitch
            value={videoLanguage}
            available={{ id: hasIndonesian, en: hasEnglish }}
            onChange={changeVideoLanguage}
          />
        )}
        <Text style={styles.desc}>
          {lang=='id' &&
                material.description
          }
          {lang=='en' &&
              trans(material.description, nowlang, langTo)
          }



        </Text>
        <View style={styles.viewButton}>
          {lang=="id" ?
              <Pressable
                onPress={() => NavigatorService.navigate('Read', {link: material.doc, value: material})}
                style={[styles.presableButton, {backgroundColor: '#7BA95C'}]}
              >
                <Text style={styles.text}>{baca}</Text>
              </Pressable>
          :
              <Pressable
                onPress={() => NavigatorService.navigate('Read', {link: material.doc_en, value: material})}
                style={[styles.presableButton, {backgroundColor: '#7BA95C'}]}
              >
                <Text style={styles.text}>{baca}</Text>
              </Pressable>

          }

              <Pressable
                onPress={() => NavigatorService.navigate('Exam', {value: params.val, uid:params.uid , title:material.information})}
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
  scrollViewNoVideo: {
    marginTop: 0
  },
  scrollContent: {
    paddingTop: toDp(12)
  },
  scrollContentNoVideo: {
    paddingTop: toDp(16)
  },
  videoUnavailable: {
    width: '100%',
    height: toDp(300),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9ECEF',
  },
  videoUnavailableText: {
    color: '#666',
    fontSize: toDp(14),
  },
  desc: {
    fontSize: toDp(14),
    color: 'black',
    marginHorizontal: toDp(16),
    marginTop: toDp(10),
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
