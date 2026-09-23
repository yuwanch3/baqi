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

const Petrofisika = (props) => {
  const { t } = useTranslation();
  let judul_petro = t('common:judulPetro');
  let menuPetroPetro = t('common:menuPetroPetro');
  let deskMenuPetroPetro = t('common:deskMenuPetroPetro');
  let menuPetroCEOR = t('common:menuPetroCEOR');
  let deskMenuPetroCEOR = t('common:deskMenuPetroCEOR');

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
      <Header
        title={judul_petro}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        {presableMenu(
          menuPetroPetro,
          deskMenuPetroPetro,
          allLogo.icPetroDetail,
          '#7BA95C',
          'petrofisika',
          menuPetroPetro
        )}
        {presableMenu(
          menuPetroCEOR,
          deskMenuPetroCEOR,
          allLogo.icCEOR,
          '#1F618D',
          'ceor',
          menuPetroCEOR
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

export default Petrofisika;