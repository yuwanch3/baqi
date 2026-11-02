import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Loader from '@Loader';
import NavigatorService from '@NavigatorService';
import { svr } from '../../../Configs/apikey';

const KelolaAnggota = (props) => {
  const { t } = useTranslation();
  const params = props.navigation.state.params || {};
  const isTransfer = params.mode === 'transfer';
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getMembers();
  }, []);

  const showMessage = (message) => {
    Alert.alert(t('common:informasi'), message, [{text: t('common:oke')}]);
  };

  const getMembers = () => {
    setLoading(true);
    axios.get(svr.url+'grup/current/'+params.idgrup+'/'+svr.api)
      .then(result => {
        setLoading(false);
        if(result.data.status === 200){
          const data = Array.isArray(result.data.datas) ? result.data.datas : [];
          setMembers(data.filter(item => item.gm_uid !== result.data.owner));
        }else{
          showMessage(t('common:err_data'));
        }
      })
      .catch(() => {
        setLoading(false);
        showMessage(t('common:err_500V2'));
      });
  };

  const toggleMember = (uid) => {
    if(isTransfer){
      setSelected([uid]);
      return;
    }
    setSelected(current => current.indexOf(uid) >= 0
      ? current.filter(item => item !== uid)
      : current.concat(uid)
    );
  };

  const executeAction = () => {
    if(selected.length === 0){
      showMessage(t('common:g_pilihAnggota'));
      return;
    }

    Alert.alert(
      t('common:konfirmasi'),
      isTransfer ? t('common:g_konfirmasiTransfer') : t('common:g_konfirmasiHapusAnggota'),
      [
        {text: t('common:batal'), style: 'cancel'},
        {text: t('common:yakin'), onPress: submitAction},
      ]
    );
  };

  const submitAction = () => {
    setLoading(true);
    const endpoint = isTransfer ? 'leave' : 'removemembers';
    const payload = isTransfer
      ? {uid: params.uid, new_owner: selected[0]}
      : {owner: params.owner, members: selected};

    axios.post(svr.url+'grup/'+endpoint+'/'+params.idgrup+'/'+svr.api, payload)
      .then(result => {
        setLoading(false);
        if(result.data.status === 200){
          if(isTransfer){
            NavigatorService.navigate('GrupSaya', {uid: params.uid});
          }else{
            Alert.alert(t('common:berhasil'), t('common:g_hapusAnggotaBerhasil'), [{
              text: t('common:oke'),
              onPress: () => props.navigation.goBack(),
            }]);
          }
        }else if(result.data.status === 403){
          showMessage(t('common:g_adminOnly'));
        }else{
          showMessage(t('common:err_data'));
        }
      })
      .catch(() => {
        setLoading(false);
        showMessage(t('common:err_500V2'));
      });
  };

  const renderMember = ({item}) => {
    const isSelected = selected.indexOf(item.gm_uid) >= 0;
    return (
      <TouchableOpacity style={styles.memberCard} onPress={() => toggleMember(item.gm_uid)}>
        <Image
          source={item.picture ? {uri: item.picture} : allLogo.icUsertemp}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, isSelected && styles.selectedName]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.memberSince}>{item.created}</Text>
        </View>
        <Icon
          name={isTransfer
            ? (isSelected ? 'radio-button-checked' : 'radio-button-unchecked')
            : (isSelected ? 'check-circle' : 'radio-button-unchecked')}
          size={toDp(28)}
          color={isSelected ? '#C62828' : '#A3A3A3'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
          <Image source={allLogo.icArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isTransfer ? t('common:g_pilihAdminBaru') : t('common:mg_kelolaAnggota')}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          {isTransfer ? t('common:g_transferPetunjuk') : t('common:g_hapusPetunjuk')}
        </Text>
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={item => item.gm_uid}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('common:err_404V2')}</Text>}
        />
        <TouchableOpacity
          disabled={selected.length === 0}
          style={[styles.actionButton, selected.length === 0 && styles.actionDisabled]}
          onPress={executeAction}
        >
          <Text style={styles.actionText}>
            {isTransfer ? t('common:g_jadikanAdmin') : t('common:g_hapusTerpilih')}
          </Text>
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
  headerTitle: {color: 'white', fontSize: toDp(20), marginLeft: toDp(8), flexShrink: 1},
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: toDp(25),
    borderTopRightRadius: toDp(25),
    paddingTop: toDp(20),
  },
  description: {
    color: '#024024',
    fontSize: toDp(14),
    paddingHorizontal: toDp(24),
    marginBottom: toDp(8),
  },
  listContent: {paddingHorizontal: toDp(16), paddingBottom: toDp(100)},
  memberCard: {
    minHeight: toDp(70),
    backgroundColor: 'white',
    borderRadius: toDp(15),
    marginTop: toDp(12),
    paddingHorizontal: toDp(15),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#A3A3A3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: toDp(4),
  },
  avatar: {
    width: toDp(45),
    height: toDp(45),
    borderRadius: toDp(45),
    backgroundColor: '#ccc',
  },
  memberInfo: {flex: 1, marginHorizontal: toDp(14)},
  memberName: {fontSize: toDp(15), fontWeight: 'bold', color: '#024024'},
  selectedName: {color: '#C62828', textDecorationLine: 'line-through'},
  memberSince: {fontSize: toDp(12), color: '#024024', marginTop: toDp(3)},
  emptyText: {textAlign: 'center', color: '#909090', marginTop: toDp(80)},
  actionButton: {
    position: 'absolute',
    left: toDp(24),
    right: toDp(24),
    bottom: toDp(24),
    height: toDp(50),
    borderRadius: toDp(60),
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDisabled: {backgroundColor: '#D7A1A1'},
  actionText: {color: 'white', fontWeight: 'bold'},
});

export default KelolaAnggota;
