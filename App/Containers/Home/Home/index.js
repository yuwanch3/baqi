import React, { useEffect,useState }  from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,
  AsyncStorage, ScrollView
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import NavigatorService from '@NavigatorService'
import { useTranslation } from 'react-i18next';

const Home = (props) => {
  const { t } = useTranslation();
  const[state, setState] = useState({
    uid:'',
  });

  useEffect(()=> {
    AsyncStorage.getItem('uid').then(uids =>{
      let ids = uids;
      setState(state => ({...state,
        uid: ids
      }))
    });
  }, [])

  const openLinks = (type, uid, value) => {
    if(type === 'UnderstandQuran') {
      NavigatorService.navigate('UnderstandQuran')
    } else if(type === 'Petrofisika'){
      NavigatorService.navigate('Petrofisika')
    } else if(type === 'HomeExam'){
      NavigatorService.navigate('HomeExam')
    } else if(type === 'Rangking'){
      NavigatorService.navigate('Rangking', {uid:uid})
    } else if(type === 'Group'){
      NavigatorService.navigate('Group', {uid:uid})
    }
  }

  return(
    <View style={styles.container}>
       <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
              <Pressable style={[styles.menu, {backgroundColor: '#7BA95C', alignItems:'center'}]} onPress={() => openLinks('UnderstandQuran','','')}>
                <Image source={allLogo.menu1} style={{width:toDp(55), height:toDp(55)}}/>
                <View style={styles.mnrow}>
                  <Text style={styles.titlemn}>{t('common:menuOne')}</Text>
                  <Text style={styles.titledt}>{t('common:deskMenu1')}</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.menu, {backgroundColor: '#1F618D', alignItems:'center'}]} onPress={() => openLinks('Petrofisika','','')}>
                <Image source={allLogo.icLevel} style={{width:toDp(50), height:toDp(55)}}/>
                <View style={styles.mnrow}>
                  <Text style={styles.titlemn}>{t('common:menuPetro')}</Text>
                  <Text style={styles.titledt}>{t('common:deskMenuPetro')}</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.menu, {backgroundColor: '#EE6C4D', alignItems:'center'}]} onPress={() => openLinks('HomeExam','','')}>
                <Image source={allLogo.menu2}  style={{width:toDp(55), height:toDp(55)}}/>
                <View style={styles.mnrow}>
                  <Text style={styles.titlemn}>{t('common:menuTwo')}</Text>
                  <Text style={styles.titledt}>{t('common:deskMenu2')}</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.menu, {backgroundColor: '#00AF90', alignItems:'center'}]} onPress={() => openLinks('Rangking', state.uid,'')}>
                <Image source={allLogo.menu3}  style={{width:toDp(46), height:toDp(60)}}/>
                <View style={styles.mnrow}>
                  <Text style={styles.titlemn}>{t('common:menuTree')}</Text>
                  <Text style={styles.titledt}>{t('common:deskMenu3')}</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.menu, {backgroundColor: '#9700AF', alignItems:'center'}]} onPress={() => openLinks('Group', state.uid,'')}>
                <Image source={allLogo.icGroup}  style={{width:toDp(50), height:toDp(45)}}/>
                <View style={styles.mnrow}>
                  <Text style={styles.titlemn}>{t('common:menuFour')}</Text>
                  <Text style={styles.titledt}>{t('common:deskMenu4')}</Text>
                </View>
              </Pressable>
          </View>
        </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title:{
    fontSize: toDp(23),
    fontWeight: 'bold',
    color: '#FFF',
    width: toDp(199)
  },
  headerIn:{
    justifyContent: 'center',
    position: 'absolute',
    left: toDp(-70),
    height: toDp(140),
  },
  card:{
    flex: 1,
    alignItems: 'center',
    marginTop:toDp(30)
  },
  titlemn:{
    fontSize: toDp(20),
    fontWeight: 'bold',
    color: '#FFF',
    width: toDp(199)
  },
  titledt:{
    fontSize: toDp(14),
    color: '#FFF',
  },
  mnrow:{
    justifyContent: 'center',
  },
  menu:{
    width: toDp(296),
    height: toDp(88),
    borderRadius: toDp(15),
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

});

export default Home;
