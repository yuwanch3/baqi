import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header';
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Satu sumber data untuk tab materi. Tab dirender dinamis dari data ini.
const RANKING_SUBJECTS = {
  quran: { labelKey: 'kategoriQuran', color: '#378561' },
  petro: { labelKey: 'kategoriPetro', color: '#1F618D' },
  ceor: { labelKey: 'kategoriCeor', color: '#EE6C4D' },
};

const RANKING_TABS = [
  { key: 'all', labelKey: 'rankSemua', color: '#275D46' },
  ...Object.keys(RANKING_SUBJECTS).map(key => ({
    key,
    ...RANKING_SUBJECTS[key],
  })),
];

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

const EMPTY_TAB = {
  list: [],
  my: null,
  loading: false,
  error: false,
  loaded: false,
};

const Ranking = (props) => {
  const { t } = useTranslation();
  const mounted = useRef(true);
  const [activeTab, setActiveTab] = useState('all');
  const [profileReady, setProfileReady] = useState(false);
  const [profile, setProfile] = useState({ uid: '', name: '', photo: '' });
  const [cache, setCache] = useState({});

  const current = cache[activeTab] || EMPTY_TAB;
  const scoreLabel = activeTab === 'all'
    ? t('common:totalskor')
    : t('common:skor');

  const loadTab = async (tabKey, force = false) => {
    if (!force && cache[tabKey] && cache[tabKey].loaded) return;

    setCache(previous => ({
      ...previous,
      [tabKey]: {
        ...(previous[tabKey] || EMPTY_TAB),
        loading: true,
        error: false,
      },
    }));

    const category = tabKey === 'all' ? '' : '&kategori=' + tabKey;
    const listUrl = svr.url + 'skor/?api=' + svr.api + category;
    const myUrl = svr.url + 'skor/?api=' + svr.api + '&id=' + profile.uid + category;

    try {
      const responses = await Promise.all([
        axios.get(listUrl),
        profile.uid
          ? axios.get(myUrl)
          : Promise.resolve({ data: { status: 404, value: null } }),
      ]);

      const listResponse = responses[0].data;
      const myResponse = responses[1].data;

      if (listResponse.status !== 200 && listResponse.status !== 404) {
        throw new Error('Ranking list request failed');
      }
      if (myResponse.status !== 200 && myResponse.status !== 404) {
        throw new Error('User ranking request failed');
      }

      const list = listResponse.status === 200 && Array.isArray(listResponse.value)
        ? listResponse.value
        : [];
      const my = myResponse.status === 200 && myResponse.value
        ? myResponse.value
        : null;

      if (!mounted.current) return;
      setCache(previous => ({
        ...previous,
        [tabKey]: {
          list,
          my,
          loading: false,
          error: false,
          loaded: true,
        },
      }));
    } catch (error) {
      if (!mounted.current) return;
      setCache(previous => ({
        ...previous,
        [tabKey]: {
          ...(previous[tabKey] || EMPTY_TAB),
          loading: false,
          error: true,
          loaded: false,
        },
      }));
    }
  };

  useEffect(() => {
    const params = props.navigation.state.params || {};
    AsyncStorage.getItem('users')
      .then(response => {
        let user = {};
        try {
          const users = JSON.parse(response);
          user = users && users[0] ? users[0] : {};
        } catch (error) {
          user = {};
        }

        if (!mounted.current) return;
        setProfile({
          uid: params.uid || user.id || '',
          name: user.name || '',
          photo: user.picture || '',
        });
        setProfileReady(true);
      })
      .catch(() => {
        if (!mounted.current) return;
        setProfile({ uid: params.uid || '', name: '', photo: '' });
        setProfileReady(true);
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!profileReady) return;
    loadTab(activeTab);
  }, [activeTab, profileReady]);

  const displayName = (name) => {
    if (!name) return '-';
    return name.split(' ').slice(0, 2).join(' ');
  };

  const renderRow = ({ item, index }) => {
    const position = index + 1;
    const medal = MEDALI[position];

    return (
      <View style={[
        styles.row,
        medal ? {
          borderLeftWidth: toDp(4),
          borderLeftColor: medal,
          backgroundColor: TINT[position],
        } : null,
      ]}>
        <View style={[styles.badge, { backgroundColor: medal || '#E8EDF0' }]}>
          <Text style={styles.badgeText}>{position}</Text>
        </View>
        <Image
          source={item.picture ? { uri: item.picture } : allLogo.icUsertemp}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.rowText}>
          <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.rowScore}>{scoreLabel} : {item.skor}</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (current.loading || !profileReady) {
      return (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color="#378561" />
        </View>
      );
    }

    if (current.error) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>{t('common:err_data')}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => loadTab(activeTab, true)}
          >
            <Text style={styles.retryText}>{t('common:cobalagi')}</Text>
          </Pressable>
        </View>
      );
    }

    if (current.list.length === 0) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.emptyDash}>-</Text>
          <Text style={styles.stateText}>{t('common:rankBelumAda')}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={current.list}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={renderRow}
        keyExtractor={(item, index) => item.uid || String(index)}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('common:menuTree')}
        onPress={() => props.navigation.goBack()}
      />

      <View style={styles.tabArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
        >
          {RANKING_TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[
                  styles.tab,
                  active ? { backgroundColor: tab.color, borderColor: tab.color } : null,
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
                  {t('common:' + tab.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileIdentity}>
          <Image
            source={profile.photo ? { uri: profile.photo } : require('../../Assets/img/profile.png')}
            style={styles.profileAvatar}
            resizeMode="cover"
          />
          <Text style={styles.profileName} numberOfLines={1}>
            {displayName(profile.name)}
          </Text>
        </View>

        <View style={styles.profileStats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel} numberOfLines={1}>{scoreLabel}</Text>
            <View style={styles.statValue}>
              <Text style={styles.statValueText}>{current.my ? current.my.total : '-'}</Text>
            </View>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{t('common:peringkat')}</Text>
            <View style={styles.statValue}>
              <Text style={styles.statValueText}>{current.my ? current.my.rank : '-'}</Text>
            </View>
          </View>
        </View>
      </View>

      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabArea: {
    width: '100%',
    marginTop: toDp(12),
  },
  tabContent: {
    paddingHorizontal: '5%',
    paddingVertical: toDp(4),
  },
  tab: {
    minWidth: toDp(84),
    minHeight: toDp(46),
    marginRight: toDp(8),
    paddingHorizontal: toDp(16),
    borderRadius: toDp(10),
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
  tabTextActive: {
    color: '#FFFFFF',
  },
  profileCard: {
    width: '90%',
    minHeight: toDp(132),
    marginTop: toDp(12),
    paddingHorizontal: toDp(14),
    paddingVertical: toDp(14),
    backgroundColor: '#52B788',
    borderRadius: toDp(10),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  profileIdentity: {
    width: toDp(90),
    alignItems: 'center',
    marginRight: toDp(8),
  },
  profileAvatar: {
    width: toDp(64),
    height: toDp(64),
    borderRadius: toDp(32),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  profileName: {
    width: '100%',
    marginTop: toDp(6),
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: toDp(13),
    textAlign: 'center',
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: toDp(4),
  },
  statLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: toDp(12),
  },
  statValue: {
    width: '100%',
    maxWidth: toDp(82),
    height: toDp(42),
    marginTop: toDp(8),
    borderRadius: toDp(22),
    backgroundColor: '#367D5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValueText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: toDp(16),
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
    minHeight: toDp(66),
    marginBottom: toDp(10),
    paddingHorizontal: toDp(12),
    paddingVertical: toDp(8),
    borderRadius: toDp(12),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#A3A3A3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  badge: {
    width: toDp(28),
    height: toDp(28),
    marginRight: toDp(10),
    borderRadius: toDp(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#2B2B2B',
    fontWeight: 'bold',
    fontSize: toDp(12),
  },
  avatar: {
    width: toDp(42),
    height: toDp(42),
    marginRight: toDp(14),
    borderRadius: toDp(21),
    backgroundColor: '#CCCCCC',
    overflow: 'hidden',
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    color: '#024024',
    fontWeight: 'bold',
    fontSize: toDp(14),
  },
  rowScore: {
    marginTop: toDp(2),
    color: '#024024',
    fontSize: toDp(12),
  },
  stateWrap: {
    flex: 1,
    width: '100%',
    paddingHorizontal: toDp(30),
    paddingBottom: toDp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateText: {
    color: '#4A5A54',
    fontSize: toDp(13),
    textAlign: 'center',
  },
  emptyDash: {
    marginBottom: toDp(8),
    color: '#4A5A54',
    fontSize: toDp(32),
    fontWeight: 'bold',
  },
  retryButton: {
    minWidth: toDp(120),
    minHeight: toDp(46),
    marginTop: toDp(16),
    paddingHorizontal: toDp(18),
    borderRadius: toDp(10),
    backgroundColor: '#378561',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: toDp(13),
  },
});

export default Ranking;
