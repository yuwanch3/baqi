import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import { useTranslation } from 'react-i18next';
import NavigatorService from '@NavigatorService'
import Header from '@Header'

const Petrofisika = (props) => {
  const { t } = useTranslation();
  let judul_petro = t('common:judulPetro');
  let menuPetroPetro = t('common:menuPetroPetro');
  let deskMenuPetroPetro = t('common:deskMenuPetroPetro');
  let menuPetroCEOR = t('common:menuPetroCEOR');
  let deskMenuPetroCEOR = t('common:deskMenuPetroCEOR');
  let menuPetroMNK = t('common:menuPetroMNK');
  let deskMenuPetroMNK = t('common:deskMenuPetroMNK');
  let menuPetroAcidizing = t('common:menuPetroAcidizing');
  let deskMenuPetroAcidizing = t('common:deskMenuPetroAcidizing');

  const goTo = (materi, title) => {
    NavigatorService.navigate('PetroLevel', { title: title, materi: materi })
  }

  const presableMenu = (label, deskripsi, icon, warna, materi, title) => {
    return (
      <Pressable style={[styles.menu, {backgroundColor: warna, alignItems:'center'}]} onPress={() => goTo(materi, title)}>
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
        title={judul_petro}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {presableMenu(
          menuPetroPetro,
          deskMenuPetroPetro,
          allLogo.icPetroDetail,
          '#1F618D',
          'petrofisika',
          menuPetroPetro
        )}
        {presableMenu(
          menuPetroCEOR,
          deskMenuPetroCEOR,
          allLogo.icCEOR,
          '#00AF90',
          'ceor',
          menuPetroCEOR
        )}
        {presableMenu(
          menuPetroMNK,
          deskMenuPetroMNK,
          allLogo.icMigasNonKonvensional,
          '#9A6700',
          'mnk',
          menuPetroMNK
        )}
        {presableMenu(
          menuPetroAcidizing,
          deskMenuPetroAcidizing,
          allLogo.icUjiSumurPengasaman,
          '#7C3AED',
          'acidizing',
          menuPetroAcidizing
        )}
      </ScrollView>
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
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: toDp(30),
    paddingBottom: toDp(24),
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
    width: '100%'
  },
  titledt:{
    fontSize: toDp(14),
    color: '#FFF',
  },
  mnrow:{
    flex: 1,
    marginLeft: toDp(14),
    justifyContent: 'center',
  },
  menu:{
    width: '90%',
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

export default Petrofisika;
