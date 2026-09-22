import React from 'react';
import { View,StyleSheet, StatusBar} from 'react-native';
import Selector from '@LanguageSelector';
import Header from '@Header'
import { useTranslation } from 'react-i18next';

const SettingLanguage = (props) => {
  const { t } = useTranslation();
  return (

    <View style={styles.container}>
    <StatusBar translucent={false} />
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title={t('common:pilihBahasa')}
        onPress={() => props.navigation.goBack()}
      />
      <Selector title={t('common:pilihBahasa')} />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})

export default SettingLanguage;
