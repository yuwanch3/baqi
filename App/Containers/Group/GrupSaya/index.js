import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,
  Alert,
  TextInput,
  FlatList,AsyncStorage,RefreshControl
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import { useTranslation } from 'react-i18next';
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import HeaderTransparent from '@HeaderTransparent'
//import { firebase } from '../../Configs/firebase'
import { svr } from '../../../Configs/apikey';
import axios from 'axios';

const GrupSaya = (props) => {
  const { t }   = useTranslation();
  let err_data  = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull  = t('common:dataNull');
  let err_404   = t('common:err_404');
  let err_500   = t('common:err_500');
  let batal = t('common:batal');
  let oke   = t('common:oke');
  let gsaya   = t('common:gsaya');
  let cari    =  t('common:cari');
  let err_500V2    =  t('common:err_500V2');
  let err_404V2Grup=  t('common:err_404V2Grup');
  let err_404V2 =  t('common:err_404V2');
  let informasi =  t('common:informasi');
  let kembali   =  t('common:kembali');
  let err_404V3    =  t('common:err_404V3');
  let gbergabung  =  t('common:gbergabung');

  //swipe refresh
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState({
    loading: false,
    total:0,
    arrayData:[],
    datafix:[],
    uid:'',
    thisdata:false
  })

  useEffect(() => {
    AsyncStorage.getItem('uid').then(uids =>{
      let ids = uids;
      setState(state => ({...state,
        uid: ids
      }))
    });

    loadGrup()

    const unsubscribe = props.navigation.addListener('focus', () => {
        refresh()
    });
    return unsubscribe
  },[])

  const showAlertone = (data) => {
    Alert.alert(
      ""+informasi,
      ""+data,
      [
        {
          text: kembali,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    )
  }

  const loadGrup = () =>{
    setState(state => ({...state, loading: true }))
    axios.get(svr.url+'grup/grupsaya/'+props.navigation.state.params.uid+'/'+svr.api)
    .then(result =>{

        if(result.data.status==200){
          //console.log('New  => '+ JSON.stringify(result) )
          let data = result.data.data.map(doc => {
              return {
                total: result.data.total,
                value: doc
              }
           })
          //console.log('New  ------=> '+ JSON.stringify(data))
          setState(state => ({...state, loading: false, arrayData: data, total: data[0].total}))
          setState(state => ({...state, loading: false }))
          setState(state => ({...state, datafix: data, thisdata: true }))


        }else if(result.data.status==404){
          //alert("Data tidak ditemukan!");
          setState(state => ({...state, loading: false, thisdata: false }))

        }else if(result.data.status==500){
          showAlertone(err_500);
          setState(state => ({...state, loading: false, thisdata: false }))
        }
    }).catch(err =>{
      showAlertone(err_data)
      setState(state => ({...state, loading: false, thisdata: false }))
    })
  }

  const refresh = () =>{
    setState(state => ({...state, loading: false, arrayData: [], total: 0}))
    setState(state => ({...state, datafix: [] }))

    loadGrup()
  }

  const presableMenu = (item, index, OnPress) => {
      return (
        <Pressable style={[styles.presableMenu, {backgroundColor: 'white'}]} onPress={()=>OnPress()}>
            <View style={styles.rowflatlist}>
                <View style={{justifyContent:'center'}}>
                  <Image source={allLogo.icBaqi} style={styles.logo} />
                </View>
                <View style={styles.viewText}>
                    <Text style={styles.title}>{item.value.title}</Text>
                    <Text style={styles.deskrip}>{item.value.descrip}</Text>
                </View>
            </View>
        </Pressable>
      )
  }

  const selectGroup= (id,title,desc,uid) => {
      NavigatorService.navigate('GrupDetail', {idgrup: id, judulgrup:title, deskripsi:desc, uid:uid})
  }

  const searchFilterFunction = (text) => {
    const newData = state.arrayData.filter(item => {
      const itemData = `${item.value.title.toUpperCase()}
                        ${item.value.descrip.toUpperCase()}`;

       const textData = text.toUpperCase();

       return itemData.indexOf(textData) > -1;
    });

    setState(state => ({...state, datafix: newData }))
  }

  return (
    <View style={styles.container}>
      <Loader loading={state.loading} />
      <HeaderTransparent
        title={gsaya}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={styles.textTulisan}>
            <Text style={styles.textjudul}>{state.total}</Text>
            <Text style={styles.textdesc}>{gbergabung}</Text>
        </View>
        <View style={styles.card}>
              <View style={{width: '100%', alignItems:'center',marginTop:toDp(10)}}>
                   <TextInput
                     style={styles.textInputSrc}
                     placeholder={cari}
                     placeholderTextColor={'grey'}
                     //onTouchStart={() => alert('d')}
                     onChangeText={(text) =>  searchFilterFunction(text)}
                   />
                   <View style={styles.srcShow} onPress={() => setState(state => ({...state, secureTextEntry: !state.secureTextEntry }))}>
                     <Image source={allLogo.icSearch} style={styles.icVisibilitySrc} />
                   </View>


             </View>

             {state.thisdata==true ?
             <View style={{width: '100%', borderTopRightRadius: 30,
              borderTopLeftRadius: 30, marginTop:20, marginBottom:toDp(20)}}>
                 <FlatList
                    refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={refresh}
                    />}
                    contentContainerStyle={{width:'100%',borderRadius: 30,}}
                    data={state.datafix}
                    renderItem={({item,index}) => {
                      return (
                        presableMenu(item, index, () => selectGroup(item.value.gid, item.value.title, item.value.descrip, state.uid))
                      )
                    }}
                    ListFooterComponent={() => <View style={{height: toDp(50), marginBottom:toDp(190)}} />}
                  />
             </View>
            :
            <View style={styles.vnotfound}>
                <Image source={allLogo.ic404} style={{width:toDp(200), height:toDp(200),marginTop:toDp(-50)}} />
                <View style={{marginTop:40, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize:16, fontWeight:'bold', color:'#909090' }}>
                     {err_404V2}
                  </Text>
              </View>
            </View>
            }
        </View>
      </View>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#52B788'
  },
  card: {
    height: '90%',
    width: '100%',
    backgroundColor: 'white',
    marginTop: '10%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  textjudul: {
      color: 'white',
      fontWeight:'500',
      fontSize: toDp(35),
  },
  textdesc: {
      color: 'white',
      fontSize: toDp(15),
  },
  texttombol: {
      fontSize: toDp(15),
      textAlign: 'center',
      marginTop: toDp(8),
      color: '#024024',
    //   fontWeight: 'bold'
  },
  textGrup: {
    fontSize: toDp(15),
    textAlign: 'center',
    marginTop: toDp(8),
    color: '#024024',
    fontWeight: 'bold'
  },
  textNamaGrup: {
      color: 'black'
  },
  presableMenu: {
    width: '90%',
    marginLeft: toDp(16),
    height: toDp(75),
    borderRadius: toDp(15),
    shadowColor: "#A3A3A3",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    elevation: 17,
    flexDirection: 'row',
    marginTop: toDp(16),
    padding:5,
    paddingHorizontal:15
  },
  title: {
      fontSize: toDp(15),
      color: '#024024',
      fontWeight:'500'
  },
  deskrip: {
      fontSize: toDp(12),
      color: '#024024'
  },
  rowflatlist: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  logo: {
    borderRadius: toDp(100),
    width:50,
    height:50

  },
  viewText: {
    marginLeft: toDp(20),
    justifyContent:'center',

  },
  textTulisan: {
      marginTop:25,
      width:'100%',
      alignItems: 'center',
      justifyContent: 'center'
  },
  textInputSrc: {
    width: '90%',
    height: toDp(48),
    backgroundColor: '#f4f4f4',
    paddingHorizontal: toDp(8),
    borderRadius: toDp(60),
    marginTop: toDp(8),
    paddingLeft:50
  },
  srcShow: {
    padding: toDp(4),
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    height:toDp(48),
    width:toDp(48),
    left: toDp(20),
    top: Platform.OS === 'ios' ? toDp(6) : toDp(8)
  },
  srcShowrg: {
    padding: toDp(4),
    backgroundColor: '#E8E8E8',
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    height:toDp(48),
    width:toDp(75),
    right: toDp(20),
    borderTopRightRadius:toDp(50),
    borderBottomEndRadius:toDp(50),
    top: Platform.OS === 'ios' ? toDp(6) : toDp(8)
  },
  icVisibilitySrc: {
    width: toDp(28),
    height: toDp(28),
    tintColor: 'grey'
  },
  vnotfound:{
    marginVertical: '40%',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },

});

export default GrupSaya;
