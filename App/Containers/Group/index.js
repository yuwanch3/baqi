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
  FlatList,
  TextInput,AsyncStorage,RefreshControl
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Modal from "react-native-modal";
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import HeaderTransparent from '@HeaderTransparent'
//import { firebase } from '../../Configs/firebase'
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import { sha1 } from 'react-native-sha1';
import { useTranslation } from 'react-i18next';

const Group = (props) => {
  const { t }   = useTranslation();
  let err_data  = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull  = t('common:dataNull');
  let err_404   = t('common:err_404');
  let err_500   = t('common:err_500');
  let batal = t('common:batal');
  let oke   = t('common:oke');
  let g_judul   = t('common:g_judul');
  let g_deskrip = t('common:g_deskrip');
  let gsaya   = t('common:gsaya');
  let gbuat   = t('common:gbuat');
  let lainnya = t('common:lainnya');
  let cari    =  t('common:cari');
  let err_500V2    =  t('common:err_500V2');
  let err_404V2Grup=  t('common:err_404V2Grup');
  let grup_409join =  t('common:grup_409join');
  let grup_201join =  t('common:grup_201join');
  let informasi =  t('common:informasi');
  let gabung    =  t('common:gabung');
  let kembali   =  t('common:kembali');
  let gpop_judul =  t('common:gpop_judul');
  let gpass_desk  =  t('common:gpass_desk');
  let err_404V3    =  t('common:err_404V3');
  let plc_popSandi  =  t('common:plc_popSandi');
  let youareGuest   =  t('common:guestAlert');

  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState({
    loading: false,
    uid:'',
    gid:'',
    arrayData:[],
    total:0,
    password:'',
    datafix:[],
    key:'',
    thisdata:false,
    login:''
  })
  const[modalData,setModalData]=useState([]);

  const toggleModal = () => {
     setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    AsyncStorage.getItem('uid').then(uids =>{
      let ids = uids;
      setState(state => ({...state,
        uid: ids
      }))
    });

    AsyncStorage.getItem('login').then(response =>{
      //console.log('login :', response);
      setState(state => ({...state, login: response}))
    }).catch(err =>{
      console.log('err', err)
    })

    loadGlobalGrup()
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

  const loadGlobalGrup = () => {
      setState(state => ({...state, loading: true }))
      axios.get(svr.url+'grup/global/'+props.navigation.state.params.uid+'/'+svr.api)
      .then(result =>{

          if(result.data.status==200){
          //  console.log('New  => '+ JSON.stringify(result) )
            let data = result.data.data.map(doc => {
                return {
                  total: result.data.total,
                  value: doc
                }
             })
            console.log('New  => '+ JSON.stringify(data))
            setState(state => ({...state, loading: false, arrayData: data, total: data[0].total}))
            setState(state => ({...state, loading: false }))
             setState(state => ({...state, datafix: data }))
              setState(state => ({...state, thisdata: true }))
          }else if(result.data.status==404){
            //alert("Data tidak ditemukan!");
            setState(state => ({...state, loading: false, thisdata: false  }))

          }else if(result.data.status==500){
            showAlertone(err_500);
            setState(state => ({...state, loading: false, thisdata: false  }))

          }
      }).catch(err =>{
        showAlertone(err_data)
        setState(state => ({...state, loading: false }))
      })
  }

  const presableMenu = (item,index, OnPress) => {
      return (
        <Pressable style={[styles.presableMenu, {backgroundColor: 'white'}]} onPress={()=>OnPress()}>
            <View style={styles.rowflatlist}>
                <View style={{justifyContent:'center'}}>
                <Image source={allLogo.icBaqi} style={styles.logo} />
                </View>
                <View style={styles.viewText}>
                    <Text style={styles.title}>{item.value.judul_grup}</Text>
                    <Text style={styles.deskrip}>{item.value.desc_grup}</Text>
                </View>
            </View>
        </Pressable>
      )
  }

  const selectjoinGrup= (array) => {
    if(state.login=='guest'){
        showAlertone(youareGuest)
    }else{
        setModalVisible(true)
        let val  = JSON.stringify(array)
        let data = JSON.parse(val)
        setModalData(data)
        setState(state => ({...state, gid: data.id }))
        //NavigatorService.navigate('GrupDetail', {idgrup: id})
    }
  }

  const Shaone = (pass) =>{
    sha1(pass).then( hash => {
      setState(state => ({...state, password: hash }));
    })

  }

  const showAlert = (data) => {
    Alert.alert(
      ""+informasi,
      ""+data,
      [
        {
          text: oke,
          onPress: () => {toggleModal()},
          style: "cancel"
        }
      ]
    )
  }

  const JoinGroup= ()=>{
    const data = {
      uid: state.uid,
      gid: state.gid,
      password: state.password
    }
    console.log(JSON.stringify(data));
    setState(state => ({...state, loading: true }))
      axios.post(svr.url+'grup/join/'+state.uid+'/'+svr.api+'/', data)
      .then(result =>{
        console.log('--------> '+ JSON.stringify(result));
          if(result.data.status==201){
            setState(state => ({...state, loading: false }))
            showAlert(grup_201join)
          }else if(result.data.status==500){
            showAlert(err_500V2)
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==404){
            showAlert(err_404V2Grup)
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==409){
            showAlert(grup_409join)
            setState(state => ({...state, loading: false }))
          }
      }).catch(err =>{
        //console.log(err)
        showAlert(err_data)
        setState(state => ({...state, loading: false }))
      })
  }

  const searchFilterFunction = (text) => {
    const newData = state.arrayData.filter(item => {
      const itemData = `${item.value.judul_grup.toUpperCase()}
      ${item.value.desc_grup.toUpperCase()}`;

       const textData = text.toUpperCase();

       return itemData.indexOf(textData) > -1;
    });
      setState(state => ({...state, key: text }))
    setState(state => ({...state, datafix: newData }))
  }

  const refresh = () =>{
    setState(state => ({...state, loading: false, arrayData: [], total: 0}))
    setState(state => ({...state, datafix: [] }))

    loadGlobalGrup()
  }

  const myGroupAct = (data) =>{
    if(state.login=='guest'){
      showAlertone(youareGuest)
    }else{
      if(data=='mygroup'){
       NavigatorService.navigate('GrupSaya', {uid:state.uid})
     }else if(data=='create'){
       NavigatorService.navigate('BuatGrup', {uid:state.uid})
     }
   }
  }

  return (
    <View style={styles.container}>
      <HeaderTransparent
        title={'Group'}
        onPress={() => props.navigation.goBack()}
      />
      <Loader loading={state.loading} />
      <View style={styles.content}>
        <View style={{marginTop:'10%', flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
          <View style={styles.textTulisan}>
              <Text style={styles.textjudul}>{g_judul}</Text>
              <Text style={styles.textdesc}>{state.total} {g_deskrip}</Text>
          </View>
          <View style={styles.rowbutton}>
              <Pressable style={styles.presableMygrup}  onPress={() => myGroupAct('mygroup') }>
                  <Text style={styles.texttombol}>{gsaya}</Text>
              </Pressable>
              <Pressable style={styles.presableBuat} onPress={() =>  myGroupAct('create') }>
                  <Text style={styles.textGrup}>{gbuat}</Text>
              </Pressable>
          </View>
        </View>

        <View style={styles.card}>
           <View style={{width: '100%', alignItems:'center',marginTop:toDp(10)}}>
                <TextInput
                  style={styles.textInputSrc}
                  placeholder={cari}
                  placeholderTextColor={'grey'}
                  //onTouchStart={() => alert('d')}
                //   value={state.email}
                  onChangeText={(text) =>  searchFilterFunction(text)}
                />
                <View style={styles.srcShow} onPress={() => setState(state => ({...state, secureTextEntry: !state.secureTextEntry }))}>
                  <Image source={allLogo.icSearch} style={styles.icVisibilitySrc} />
                </View>

                <Pressable style={[styles.srcShowrg,{backgroundColor: state.key!='' ? '#52B788': '#E8E8E8'}]} onPress={() =>
                    state.key!='' ? NavigatorService.navigate('Searchgrup',{key:state.key}) : ''
                }>
                  <Text style={{color: state.key!='' ? '#FFF':'#898989'}}>{lainnya}</Text>
                </Pressable>
           </View>
          {state.thisdata==true ?
            <View style={{width: '100%', borderTopRightRadius: 30,
              borderTopLeftRadius: 30,marginTop:20,marginBottom:20}}>
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
                        presableMenu(item,index, () => selectjoinGrup(item.value))
                      )
                    }}
                    ListFooterComponent={() => <View style={{height: toDp(250)}} />}
                  />
            </View>
            :
            <View style={styles.vnotfound}>
                <Image source={allLogo.ic404} style={{width:toDp(200), height:toDp(200),marginTop:toDp(-50)}} />
                <View style={{marginTop:40, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize:16, fontWeight:'bold', color:'#909090' }}>
                     {err_404V3}...
                  </Text>
              </View>
            </View>
          }
        </View>
      </View>
        <Modal
          style={styles.modal} isVisible={isModalVisible}>
          <View style={styles.ViewModal}>
              <Pressable style={styles.modalClose} onPress={()=> toggleModal()}>
                <Image source={allLogo.icSilang} style={{height:toDp(20),width:toDp(20)}}/>
              </Pressable>
              <View style={{padding:toDp(20)}}>
                <Text style={{fontSize:toDp(20), fontWeight:'bold'}}>{gpop_judul}</Text>
                <Text style={{fontSize:toDp(10), }}>{gpass_desk}</Text>
                <View style={{marginTop: toDp(10)}}>
                  <TextInput
                    style={[styles.textInput, {marginTop: toDp(8)}]}
                    placeholder={plc_popSandi}
                    placeholderTextColor={'grey'}
                    secureTextEntry={state.secureTextEntry}
                    onChangeText={(text) => Shaone(text) }

                  />
                  <Pressable style={styles.presableShow} onPress={() => setState(state => ({...state, secureTextEntry: !state.secureTextEntry }))}>
                    <Image source={state.secureTextEntry ? allLogo.icVisibilityOff : allLogo.icVisibilityOn} style={styles.icVisibility} />
                  </Pressable>

                </View>
              </View>
              <View style={styles.modalFooter}>
                <Pressable style={[styles.pressMbtn, {borderRightWidth:1, borderRightColor:'#ccc',backgroundColor:'red'}]} onPress={()=> toggleModal() }>
                    <Text style={{fontWeight:'bold', color:'#FFF', fontSize:toDp(15)}}>{batal}</Text>
                </Pressable>
                <Pressable style={[styles.pressMbtn,{backgroundColor:'#2D6A4F'}]} onPress={()=> JoinGroup() }>
                    <Text style={{fontWeight:'bold', color:'#FFF', fontSize:toDp(15)}}>{gabung}</Text>
                </Pressable>
              </View>
          </View>
        </Modal>
        {/*end modal*/}
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
      fontSize: toDp(20),
  },
  textdesc: {
      color: 'white',
  },
  presableBuat: {
    height: toDp(40),
    width: toDp(90),
    backgroundColor: 'white',
    borderRadius: toDp(8),
    alignItems:'center',
    justifyContent:'center'
  },
  presableMygrup: {
    height: toDp(40),
    width: toDp(90),
    backgroundColor: '#1A6E47',
    justifyContent:'center',
    marginRight:8,
    borderRadius: toDp(8),
  },
  rowbutton: {
      flexDirection: 'row',
      marginTop: toDp(0),
      justifyContent:'space-around'
  },
  rowtombol: {
    flexDirection: 'row',
  },
  texttombol: {
      fontSize: toDp(14),
      textAlign: 'center',
      color: '#FFF',
    //   fontWeight: 'bold'
  },
  textGrup: {
    fontSize: toDp(14),
    textAlign: 'center',
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
      fontWeight:'500',
      color: '#024024'
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  modal:{
    marginVertical:'50%',
    minHeight: toDp(210),
    maxHeight: toDp(210),
  },
  ViewModal:{
    flex: 1,
    width:'100%',
    backgroundColor:'#FFF',
    height:toDp(200),
    borderRadius:toDp(10),
  },
  modalClose:{
    height:toDp(20),
    width:toDp(20),
    position:'absolute',
    right:toDp(20), marginTop:toDp(20),
    zIndex:2,
  },
  modalFooter:{
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'#fff',
    maxHeight:toDp(60),
    width:'100%',
    padding: 20,
    borderBottomEndRadius:toDp(10),
    borderBottomStartRadius:toDp(10)
  },
  pressMbtn:{
    height:toDp(48), alignItems:'center',
    justifyContent:'center', width:'45%', borderRadius: 8
  },
  textInput: {
    width: '100%',
    height: toDp(48),
    backgroundColor: '#E1E1E1',
    paddingHorizontal: toDp(8),
    borderRadius: toDp(4),
    marginTop: toDp(8)
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
  presableShow: {
    padding: toDp(4),
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    height:toDp(48),
    width:toDp(48),
    right: toDp(0),
    top: Platform.OS === 'ios' ? toDp(6) : toDp(10)
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
  icVisibility: {
    width: toDp(24),
    height: toDp(24),
    tintColor: 'grey'
  },
  icVisibilitySrc: {
    width: toDp(28),
    height: toDp(28),
    tintColor: 'grey'
  },
  srcShowrg: {
    padding: toDp(4),
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
  vnotfound:{
    marginVertical: '40%',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },
});
export default Group;
