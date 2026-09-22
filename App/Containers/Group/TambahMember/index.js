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
import Modal from "react-native-modal";
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import HeaderTransparent from '@HeaderTransparent'
//import { firebase } from '../../Configs/firebase'
import { svr } from '../../../Configs/apikey';
import axios from 'axios';
import { sha1 } from 'react-native-sha1';
import { useTranslation } from 'react-i18next';

const TambahMember = (props) => {
  const { t }   = useTranslation();
  let err_data  = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull  = t('common:dataNull');
  let err_404   = t('common:err_404');
  let err_500   = t('common:err_500');
  let batal = t('common:batal');
  let gabung = t('common:gabung');
  let oke   = t('common:oke');
  let tambah   = t('common:tambah');
  let cari    =  t('common:cari');
  let txt_konfirmagt =  t('common:txt_konfirmagt');
  let txt_btambahkan   =  t('common:txt_btambahkan');
  let err_500V2     =  t('common:err_500V2');
  let grup_409join  =  t('common:grup_409join');
  let err_404V3Grup =  t('common:err_404V3Grup');
  let err_404V2 =  t('common:err_404V2');
  let informasi =  t('common:informasi');
  let kembali   =  t('common:kembali');
  let err_404V3    =  t('common:err_404V3');
  let mg_menusatu =  t('common:mg_menusatu');
  let plc_amnamapg =  t('common:mg_menusatu');


  //swipe refresh
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState({
    loading: false,
    total:0,
    arrayData:[],
    datafix:[],
    uid:'',
    gid:'',
    thisdata:false,
    newKey:'',
    password:''
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

  const getUsersall = (key) =>{

    setState(state => ({...state, loading: true }))
    axios.get(svr.url+'users/search/'+key+'/'+svr.api)
    .then(result =>{
        if(result.data.status==200){
          //console.log('----------------New search => '+ JSON.stringify(result.data.value.id))
          let data = result.data.value.map(doc => {
              return {
                id: doc.id,
                value: doc
              }
           })
          //console.log('New search => '+ JSON.stringify(data) )
          setState(state => ({...state, loading: false, arrayData: data, total: data[0].total}))
          setState(state => ({...state, loading: false }))
          setState(state => ({...state, datafix: data, thisdata:true }))

        }else if(result.data.status==404){
          // asfaalert("Data tidak ditemukan!");
          setState(state => ({...state, loading: false,thisdata:false}))
        }else if(result.data.status==500){
          showAlertone(err_500);
          setState(state => ({...state, loading: false }))
        }
    }).catch(err =>{
      //alert('Tidak dapat memuat data!'+err)
      setState(state => ({...state, loading: false, thisdata:false   }))
    })
  }

  const presableMenu = (item, index, OnPress) => {
      return (
        <Pressable style={[styles.presableMenu, {backgroundColor: 'white'}]} onPress={()=>OnPress()}>
            <View style={styles.rowflatlist}>
                <View style={{justifyContent:'center'}}>
                  <Image source={allLogo.picture} style={styles.logo} />
                </View>
                <View style={styles.viewText}>
                    <Text style={styles.title}>{item.value.name}</Text>
                    <Text style={styles.deskrip}>{item.value.email}</Text>
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

  const addToGrup= (uid, idgrup)=>{
    const data = {
      uid: uid,
      gid: idgrup,
    }
    console.log('------------------------------->0'+ JSON.stringify(data));
    setState(state => ({...state, loading: true }))
      axios.post(svr.url+'grup/addmember/'+state.uid+'/'+svr.api+'/', data)
      .then(result =>{
        //console.log('--------> '+ JSON.stringify(result));
          if(result.data.status==201){
            setState(state => ({...state, loading: false }))
            showAlert(txt_btambahkan)
          }else if(result.data.status==500){
            showAlertone(err_500V2)
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==404){
            showAlertone(err_404V3Grup)
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==409){
            showAlertone(grup_409join)
            setState(state => ({...state, loading: false }))
          }
      }).catch(err =>{
        //console.log(err)
        showAlertone(err_data)
        setState(state => ({...state, loading: false }))
      })
  }

  const selectjoinGrup= (uid) => {
    Alert.alert(
      ""+mg_menusatu,
      ""+txt_konfirmagt,
      [
        {
          text: batal,
          onPress: () => console.log("cancle"),
          style: "cancel"
        },
        {
          text: tambah,
          onPress: () => {addToGrup(uid, props.navigation.state.params.idgrup)},

        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Loader loading={state.loading} />
      <HeaderTransparent
        title={mg_menusatu}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={styles.textTulisan}>
            <View style={{width: '100%', alignItems:'center',marginTop:toDp(10)}}>
                 <TextInput
                   value={state.newKey}
                   style={styles.textInputSrc}
                   placeholder={plc_amnamapg}
                   placeholderTextColor={'grey'}
                   //onTouchStart={() => alert('d')}
                   onChangeText={(text) =>  setState(state => ({...state, newKey: text }))}
                 />
                 <View style={styles.srcShow} onPress={() => setState(state => ({...state, secureTextEntry: !state.secureTextEntry }))}>
                   <Image source={allLogo.icSearch} style={styles.icVisibilitySrc} />
                 </View>

                 <Pressable style={[styles.srcShowrg,{backgroundColor: state.newKey!='' ? '#757975': '#E8E8E8'}]} onPress={() =>getUsersall(state.newKey)
                 }>
                   <Text style={{color: state.newKey!='' ? '#FFF':'#898989'}}>{cari}</Text>
                 </Pressable>
           </View>
        </View>
        <View style={styles.card}>
            {state.thisdata==true ?

             <View style={{width: '100%', borderTopRightRadius: 30,
              borderTopLeftRadius: 30, marginTop:20, marginBottom:toDp(20)}}>
                 <FlatList

                    contentContainerStyle={{width:'100%',borderRadius: 30,}}
                    data={state.datafix}
                    renderItem={({item,index}) => {
                      return (
                        presableMenu(item, index, () => selectjoinGrup(item.id))
                      )
                    }}
                    ListFooterComponent={() => <View style={{height: toDp(50), marginBottom:toDp(120)}} />}
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
    marginTop: '8%',
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
    height:50,
    backgroundColor:'#ccc'
  },
  viewText: {
    marginLeft: toDp(20),
    justifyContent:'center',

  },
  textTulisan: {
      marginTop:toDp(-10),
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
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    height:toDp(48),
    width:toDp(75),
    right: toDp(16),
    borderTopRightRadius:toDp(50),
    borderBottomEndRadius:toDp(50),
    top: Platform.OS === 'ios' ? toDp(6) : toDp(8)
  },
  icVisibilitySrc: {
    width: toDp(28),
    height: toDp(28),
    tintColor: 'grey'
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
    vnotfound:{
      marginVertical: '40%',
      justifyContent:'center',
      alignContent:'center',
      alignItems:'center'
    },
});

export default TambahMember;
