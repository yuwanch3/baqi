import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  Image,
  Dimensions
} from 'react-native'
import { useTranslation } from 'react-i18next';
import { allLogo } from '@Assets'
import { toDp } from '@percentageToDP'

let { width, height } = Dimensions.get('window')
const Loader = props => {
  const { t } = useTranslation();
  let txt_loader = t('common:txt_loader');
  const {
    loading,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {/*<Image source={allLogo.loading} style={styles.loading} />*/}
          <ActivityIndicator size="large" color="#FFF" />
          <Text allowFontScaling={false} style={styles.text}>{txt_loader}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000060'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#222222',
    width: toDp(148),
    height: toDp(148),
    borderRadius: toDp(16),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowColor: '#000000',
  },
  loading: {
    width: toDp(100),
    height: toDp(100)
  },
  text: {
    fontSize: toDp(16),
    color: 'white',
  }
});

export default Loader;
