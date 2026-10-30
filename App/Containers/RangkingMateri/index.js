import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  AsyncStorage,
  FlatList,
  ActivityIndicator
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header';
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const KATEGORI = [
  { key: 'quran', labelKey: 'kategoriQuran', color: '#378561' },
  { key: 'petro', labelKey: 'kategoriPetro', color: '#1F618D' },
  { key: 'ceor',  labelKey: 'kategoriCeor',  color: '#EE6C4D' },
];

// Warna pembeda 3 besar: emas, silver, perunggu
const MEDALI = {
  1: '#D4A017',
  2: '#AEB8C2',
  3: '#B87333',
};

const TINT = {
  1: '#FFF8E5',
  2: '#F2F5F7',
  3: '#FAF1EA',
};

const RangkingMateri = (props) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('quran');
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [list, setList] = useState([]);
  const [my, setMy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const paramUid = props.navigation.state.params ? props.navigation.state.params.uid : '';
    AsyncStorage.getItem('users').then(response => {
      let users = {};
      try {
        users = JSON.parse(response)[0] || {};
      } catch (e) {
        users = {};
      }
      setUid(paramUid || users.id || '');
      setName(users.name || '');
      setPhoto(users.picture || '');
    }).catch(() => {
      setUid(paramUid || '');
    });
  }, []);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    setLoading(true);
    setError(false);
    setMy(null);
    axios.get(svr.url + 'skor/?api=' + svr.api + '&kategori=' + tab)
      .then(resList => {
        if (!alive) return;
        return axios.get(svr.url + 'skor/?api=' + svr.api + '&id=' + uid + '&kategori=' + tab)
          .then(resMy => ({ resList, resMy }))
          .catch(() => ({ resList, resMy: null }));
      })
      .then(result => {
        if (!alive || !result) return;
        const dataList = result.resList.data;
        let rows = [];
        if (dataList.status === 200 && Array.isArray(dataList.value)) {
          rows = dataList.value;
        }
        let me = null;
        if (result.resMy && result.resMy.data.status === 200 && result.resMy.data.value) {
          me = result.resMy.data.value;
        }
        setList(rows);
        setMy(me);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setList([]);
        setMy(null);
        setError(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tab, uid]);

  const displayName = (nama) => {
    if (!nama) return '';
    return nama.split(' ').slice(0, 2).join(' ');
  };

  const renderRow = (item, index) => {
    const pos = index + 1;
    const medal = MEDALI[pos];
    return (
      <View style={[
        styles.row,
        medal ? { borderLeftWidth: toDp(4), borderLeftColor: medal, backgroundColor: TINT[pos] } : null
      ]}>
        <View style={[styles.badge, { backgroundColor: medal || '#E8EDF0' }]}>
          <Text style={[styles.badgeText, { color: medal ? '#2B2B2B' : '#024024' }]}>{pos}</Text>
        </View>
        <Image
          source={item.picture ? { uri: item.picture } : allLogo.icUsertemp}
          style={styles.avatar}
        />
        <View style={styles.rowText}>
          <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.rowScore}>{t('common:totalskor')} : {item.skor}</Text>
        </View>
      </View>
    );
  };

  const renderKonten = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#378561" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{t('common:err_data')}</Text>
        </View>
      );
    }
    if (list.length === 0) {
      return (
        <View style={styles.center}>
          <Image source={allLogo.ic404} style={styles.emptyImage} />
          <Text style={styles.emptyText}>{t('common:rankBelumAda')}</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={list}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => renderRow(item, index)}
        keyExtractor={(item, index) => item.uid || String(index)}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('common:rankMateri')}
        onPress={() => props.navigation.goBack()}
      />

      <View style={styles.tabWrap}>
        {KATEGORI.map(kat => {
          const active = tab === kat.key;
          return (
            <Pressable
              key={kat.key}
              style={[styles.tab, active ? { backgroundColor: kat.color, borderColor: kat.color } : null]}
              onPress={() => setTab(kat.key)}
            >
              <Text style={[styles.tabText, active ? { color: '#FFFFFF' } : null]}>
                {t('common:' + kat.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.viewHeader}>
        <View style={styles.viewHd}>
          <View style={styles.viewPhotoName}>
            <Image
              source={photo ? { uri: photo } : require('../../Assets/img/profile.png')}
              style={styles.imgProfile}
            />
            <View style={styles.nameWrap}>
              <Text style={styles.textName} numberOfLines={1}>{displayName(name)}</Text>
            </View>
          </View>

          <View style={styles.viewScore}>
            <Text style={styles.textName}>{t('common:skor')}</Text>
            <View style={styles.viewValueScore}>
              <Text style={styles.textNameVal}>{my ? my.total : 0}</Text>
            </View>
          </View>
          <View style={{ width: toDp(16) }} />
          <View style={styles.viewScore}>
            <Text style={styles.textName}>{t('common:peringkat')}</Text>
            <View style={styles.viewValueScore}>
              <Text style={styles.textNameVal}>{my ? my.rank : '-'}</Text>
            </View>
          </View>
        </View>
      </View>

      {renderKonten()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tabWrap: {
    width: '90%',
    flexDirection: 'row',
    marginTop: toDp(18),
  },
  tab: {
    flex: 1,
    height: toDp(38),
    marginHorizontal: toDp(4),
    borderRadius: toDp(8),
    borderWidth: 1,
    borderColor: '#DDE5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: toDp(12),
    fontWeight: 'bold',
    color: '#4A5A54',
  },
  viewHeader: {
    width: '90%',
    height: toDp(140),
    marginTop: toDp(16),
    backgroundColor: '#52B788',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    borderRadius: toDp(8),
    justifyContent: 'center',
  },
  viewHd: {
    marginTop: toDp(20),
    flexDirection: 'row',
  },
  viewPhotoName: {
    width: toDp(96),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  nameWrap: {
    width: toDp(96),
    alignItems: 'center',
  },
  imgProfile: {
    width: toDp(70),
    height: toDp(70),
    borderRadius: toDp(40),
    marginRight: toDp(15),
    backgroundColor: '#FFF'
  },
  textName: {
    marginTop: toDp(4),
    color: 'white',
    fontWeight: 'bold',
    fontSize: toDp(14)
  },
  textNameVal: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: toDp(16)
  },
  viewValueScore: {
    width: toDp(82),
    height: toDp(42),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#367D5C',
    borderRadius: toDp(25),
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: toDp(8)
  },
  viewScore: {
    marginTop: toDp(10),
    alignItems: 'center'
  },
  list: {
    flex: 1,
    width: '100%',
    marginTop: toDp(12),
  },
  listContent: {
    alignItems: 'center',
    paddingBottom: toDp(30),
  },
  row: {
    width: '90%',
    minHeight: toDp(64),
    paddingHorizontal: toDp(12),
    paddingVertical: toDp(8),
    backgroundColor: 'white',
    marginBottom: toDp(10),
    borderRadius: toDp(12),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#A3A3A3",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  badge: {
    width: toDp(28),
    height: toDp(28),
    borderRadius: toDp(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: toDp(10),
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: toDp(12),
  },
  avatar: {
    height: toDp(40),
    width: toDp(40),
    borderRadius: toDp(20),
    backgroundColor: '#ccc',
    marginRight: toDp(12),
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontWeight: 'bold',
    fontSize: toDp(14),
    color: '#024024'
  },
  rowScore: {
    fontSize: toDp(12),
    color: '#024024'
  },
  center: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: toDp(30),
    paddingBottom: toDp(60),
  },
  emptyImage: {
    width: toDp(140),
    height: toDp(140),
  },
  emptyText: {
    marginTop: toDp(12),
    fontSize: toDp(13),
    textAlign: 'center',
    color: '#4A5A54',
  },
});

export default RangkingMateri;
