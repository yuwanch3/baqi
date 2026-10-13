import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import { useTranslation } from 'react-i18next';
import NavigatorService from '@NavigatorService'
import Header from '@Header'

const ExamMenu = (props) => {
  const { t } = useTranslation();
  let judul = t('common:menuTwo');
  let menuQuran = t('common:menuOne');
  let deskQuran = t('common:deskMenu1');
  let menuPetro = t('common:menuPetroPetro');
  let deskPetro = t('common:deskMenuPetroPetro');
  let menuCeo = t('common:menuPetroCEOR');
  let deskCeo = t('common:deskMenuPetroCEOR');

  const presableMenu = (label, deskripsi, icon, warna, onPress) => {
    return (
      <Pressable style={[styles.menu, {backgroundColor: warna, alignItems:'center'}]} onPress={() => onPress()}>
        <Image source={icon} style={{width:toDp(55), height:toDp(55)}}/>
        <View style={styles.mnrow}>
          <Text style={styles.titlemn}>{label}</Text>
          <Text style={styles.titledt}>{deskripsi}</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewCenterAbsolute}>
        <Image source={allLogo.logo} style={styles.logo} />
      </View>
      <Header
        title={judul}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        {presableMenu(
          menuQuran,
          deskQuran,
          allLogo.menu1,
          '#7BA95C',
          () => NavigatorService.navigate('HomeExam')
        )}
        {presableMenu(
          menuPetro,
          deskPetro,
          allLogo.icPetroDetail,
          '#1F618D',
          () => NavigatorService.navigate('ExamPetro', { title: menuPetro, materi: 'petrofisika' })
        )}
        {presableMenu(
          menuCeo,
          deskCeo,
          allLogo.icCEOR,
          '#00AF90',
          () => NavigatorService.navigate('ExamPetro', { title: menuCeo, materi: 'ceor' })
        )}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    marginTop: toDp(30)
  },
  viewCenterAbsolute: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  logo: {
    width: toDp(256),
    height: toDp(270),
    resizeMode: 'contain'
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
    minHeight: toDp(88),
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

export default ExamMenu;
