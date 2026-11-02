import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { sha1 } from 'react-native-sha1';
import { useTranslation } from 'react-i18next';
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Loader from '@Loader';
import { svr } from '../../../Configs/apikey';

const EditGrup = (props) => {
  const { t } = useTranslation();
  const params = props.navigation.state.params || {};
  const isPassword = params.mode === 'password';
  const [value, setValue] = useState(isPassword ? '' : (params.currentName || ''));
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const showMessage = (message, onPress) => {
    Alert.alert(t('common:informasi'), message, [{
      text: t('common:oke'),
      onPress: onPress || (() => {}),
    }]);
  };

  const submitValue = (payload, endpoint) => {
    setLoading(true);
    axios.post(svr.url+'grup/'+endpoint+'/'+params.idgrup+'/'+svr.api, payload)
      .then(result => {
        setLoading(false);
        if(result.data.status === 200){
          showMessage(
            isPassword ? t('common:g_passwordBerhasil') : t('common:g_namaBerhasil'),
            () => props.navigation.goBack()
          );
        }else if(result.data.status === 403){
          showMessage(t('common:g_adminOnly'));
        }else{
          showMessage(t('common:err_update'));
        }
      })
      .catch(() => {
        setLoading(false);
        showMessage(t('common:err_500V2'));
      });
  };

  const save = () => {
    const cleanValue = value.trim();
    if(!cleanValue){
      showMessage(isPassword ? t('common:err_grpSandi') : t('common:err_grpJudul'));
      return;
    }
    if(isPassword && cleanValue.length < 6){
      showMessage(t('common:err_sandi'));
      return;
    }

    if(isPassword){
      sha1(cleanValue).then(hash => {
        submitValue({owner: params.owner, pass_grup: hash}, 'updatepass');
      }).catch(() => {
        showMessage(t('common:err_500V2'));
      });
    }else{
      submitValue({owner: params.owner, judul_grup: cleanValue}, 'updatename');
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
          <Image source={allLogo.icArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isPassword ? t('common:mg_gantiPassword') : t('common:mg_gantiNama')}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {isPassword ? t('common:g_passwordBaru') : t('common:g_namaBaru')}
        </Text>
        <Text style={styles.description}>
          {isPassword ? t('common:g_passwordPetunjuk') : t('common:g_namaPetunjuk')}
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={isPassword ? t('common:plc_gsandi') : t('common:plc_gnama')}
            placeholderTextColor="grey"
            secureTextEntry={isPassword && secure}
            maxLength={55}
          />
          {isPassword ?
            <Pressable style={styles.visibilityButton} onPress={() => setSecure(!secure)}>
              <Image
                source={secure ? allLogo.icVisibilityOff : allLogo.icVisibilityOn}
                style={styles.visibilityIcon}
              />
            </Pressable>
          : null}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveText}>{t('common:simpan')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#52B788'},
  header: {
    height: toDp(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: toDp(8),
  },
  backButton: {padding: toDp(8)},
  backIcon: {
    width: toDp(24),
    height: toDp(24),
    resizeMode: 'contain',
    tintColor: 'white',
  },
  headerTitle: {color: 'white', fontSize: toDp(20), marginLeft: toDp(8)},
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: toDp(25),
    borderTopRightRadius: toDp(25),
    padding: toDp(25),
  },
  title: {fontSize: toDp(25), fontWeight: 'bold', color: '#024024'},
  description: {fontSize: toDp(14), color: '#666', marginTop: toDp(8)},
  inputWrapper: {marginTop: toDp(24)},
  input: {
    width: '100%',
    height: toDp(48),
    backgroundColor: '#f4f4f4',
    paddingHorizontal: toDp(12),
    paddingRight: toDp(52),
    borderRadius: toDp(4),
    color: '#024024',
  },
  visibilityButton: {
    position: 'absolute',
    right: 0,
    width: toDp(48),
    height: toDp(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityIcon: {width: toDp(24), height: toDp(24), tintColor: 'grey'},
  saveButton: {
    alignSelf: 'flex-end',
    width: '50%',
    height: toDp(50),
    marginTop: toDp(24),
    borderRadius: toDp(60),
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {color: 'white', fontWeight: 'bold'},
});

export default EditGrup;
