import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    ScrollView,
    FlatList,
    Alert,Dimensions,TouchableWithoutFeedback,
    Modal,AsyncStorage,RefreshControl,TouchableOpacity
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import NavigatorService from '@NavigatorService';
import Loader from '@Loader';
import HeaderDetail from '../../../Components/HeaderGrupDetail';
import { TextInput } from "react-native-gesture-handler";
import { svr } from '../../../Configs/apikey';
import axios from 'axios';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
let { width, height } = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const GrupDetail = (props,{navigation}) => {
    const { t }   = useTranslation();
    let err_data  = t('common:err_data');
    let err_trima = t('common:err_trima');
    let dataNull  = t('common:dataNull');
    let err_404   = t('common:err_404');
    let err_500   = t('common:err_500');
    let batal = t('common:batal');
    let txt_konfimadmout = t('common:txt_konfimadmout');
    let oke   = t('common:oke');
    let gdetail   = t('common:gdetail');
    let peringkat    =  t('common:peringkat');
    let anggota   =  t('common:anggota');
    let err_500V2    =  t('common:err_500V2');
    let mg_judul=  t('common:mg_judul');
    let mg_menusatu =  t('common:mg_menusatu');
    let informasi =  t('common:informasi');
    let kembali   =  t('common:kembali');
    let err_404V3    =  t('common:err_404V3');
    let konfirmasi   =  t('common:konfirmasi');
    let txt_konfimgout=  t('common:txt_konfimgout');
    let yakin       =  t('common:yakin');
    let err_403Grup =  t('common:err_403Grup');
    let g_mbrkeluar =  t('common:g_mbrkeluar');


    //swipe refresh
    const [refreshing, setRefreshing] = useState(false);
    const [state, setState] = useState({
        loading: false,
        id: '',
        judulGrup: '',
        descGrup: '',
        anggota: '',
        rank: '',
        photo: '',
        arrayAnggota: [],
        total:0,
        currentRank:'',
        visible:false
    })
    const [isModalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {

      AsyncStorage.getItem('uid').then(uids =>{
        let ids = uids;
        setState(state => ({...state,
          id: ids
        }))
      });
      getMember()

    },[])


    const showAlert = (data) => {
      Alert.alert(
        ""+informasi,
        ""+data,
        [
          {
            text: oke,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      )
    }

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

    const getMember = () =>{
      //setState(state => ({...state, loading: true }))
      axios.get(svr.url+'grup/current/'+props.navigation.state.params.idgrup+'/'+svr.api)
      .then(result =>{

          if(result.data.status==200){
           console.log('New  => '+ JSON.stringify(result.data))
            let data = result.data.datas.map(doc => {
                return {
                  owner: result.data.owner,
                  total: result.data.total_member,
                  member: doc
                }
             })
             setRefreshing(false);
            //console.log('New  =============> '+ JSON.stringify(data) )

            setState(state => ({...state, loading: false,
                                          arrayAnggota: data,
                                          total: result.data.total_member
            }))
            getCurrentRank();
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==500){
            showAlertone(err_500);
            setState(state => ({...state, loading: false }))
          }
          //setState(state => ({...state, loading: false }))
      }).catch(err =>{
        showAlertone(err_data)
        setState(state => ({...state, loading: false }))
      })
    }

    const outMember = (uid) =>{
      console.log('----->---------> '+uid);
      //setState(state => ({...state, loading: true }))
      axios.delete(svr.url+'grup/delete/'+uid+'/'+props.navigation.state.params.idgrup+'/'+svr.api)
      .then(result =>{
          //console.log('----->---------> '+JSON.stringify(result));
          if(result.data.status==200){
            showAlert(g_mbrkeluar);
            //setState(state => ({...state, loading: false }))
            refresh();

          }else if(result.data.status==500){
            showAlertone(err_500);
            //setState(state => ({...state, loading: false }))
          }//setState(state => ({...state, loading: false }))
          //setState(state => ({...state, loading: false }))
      }).catch(err =>{
          showAlertone(err_500V2)
          //setState(state => ({...state, loading: false }))
      })
    }

    //If admin out from grup
    const delFromGroup = (uid) =>{
      setState(state => ({...state, loading: true }))
      axios.delete(svr.url+'grup/adminout/'+uid+'/'+props.navigation.state.params.idgrup+'/'+svr.api)
      .then(result =>{
          console.log('----->---------> '+JSON.stringify(result.data));
          if(result.data.status==200){
            //showAlert("Berhasil keluar");
            setState(state => ({...state, loading: false }))
            //props.navigation.goBack()
            NavigatorService.navigate('GrupSaya', {uid:state.id})
          }else if(result.data.status==403){
            showAlertone(err_403Grup);
            setState(state => ({...state, loading: false }))
          }else if(result.data.status==500){
            showAlertone(err_500);
            setState(state => ({...state, loading: false }))
          }

          //setState(state => ({...state, loading: false }))
      }).catch(err =>{
          showAlertone(err_500V2)
          setState(state => ({...state, loading: false }))
      })
    }

    //get current user rank
    const getCurrentRank = () =>{
      let uid = props.navigation.state.params.uid;
      setState(state => ({...state, loading: true }))
      axios.get(svr.url+'grup/rank/currentrank/'+uid+'/'+props.navigation.state.params.idgrup+'/'+svr.api)
      .then(result =>{
          console.log('---res--->'+JSON.stringify(result));
          if(result.data.status==200){
            //set state rank
            setState(state => ({...state, currentRank: result.data.value.rank }))
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==500){
            setState(state => ({...state, currentRank: '-' }))
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==404){
            setState(state => ({...state, currentRank: '-' }))
            setState(state => ({...state, loading: false }))
          }
          //setState(state => ({...state, loading: false }))
      }).catch(err =>{
          setState(state => ({...state, currentRank: '-' }))
          setState(state => ({...state, loading: false }))
      })
    }

    const remove = (uid) => {
        Alert.alert(
            ""+konfirmasi,
            ""+txt_konfimgout,
            [
                {
                    text: batal,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: yakin,
                    onPress: () => {outMember(uid)},

                }
            ]
        )
    }

    const remove_group = (uid) => {
        Alert.alert(
            ""+konfirmasi,
            ""+txt_konfimadmout,
            [
                {
                    text: batal,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: yakin,
                    onPress: () => {delFromGroup(uid)},

                }
            ]
        )
    }

    const chekAllert = (uid, owner) =>{
      if(uid===owner){
        remove_group(uid)
      }else{
        remove(uid)
      }
    }

    const listAnggota = (uid, name, create, picture, owner) => {
        return (
            <View style={{alignItems: 'center' }}>
                <View style={styles.viewListAnggota}>
                        <View style={{justifyContent: 'center', alignItems: 'center', width:'20%',}}>
                            <Image source={{uri: picture=='' ? allLogo.icUsertmp : picture}} style={styles.fotoAnggota} />
                        </View>
                        {state.id === owner ?
                        <View style={[styles.viewText,{width: state.id===owner ? '55%' : '73%',}]}>
                            <Text style={styles.titles}>{name}</Text>
                            <Text style={styles.deskrip}>{create}</Text>
                        </View>
                        :
                        <View style={[styles.viewText,{width: uid===owner ? '57%' : '76%'}]}>
                            <Text style={styles.titles}>{name}</Text>
                            <Text style={styles.deskrip}>{create}</Text>
                        </View>
                        }
                {state.id === owner ?

                    <Pressable style={styles.btnRemove} onPress={() => chekAllert(uid,owner)}>
                        <Image source={allLogo.signOut} style={styles.icRemove} />
                    </Pressable>
                  : uid === owner ?
                      <View style={styles.txtowner}>
                          <Text style={{fontSize:toDp(12), color:'#ccc'}}>Admin</Text>
                      </View>
                  : null

                }


                </View>
            </View>
        )
    }

    const refresh = () =>{
      setState(state => ({...state, loading: false, arrayData: [], total: 0}))
      setState(state => ({...state, datafix: [] }))

      getMember()
    }

    const toggleMenu = () => {
       setModalVisible(!isModalVisible);
    };

    const carimember=()=>{
      toggleMenu();
      NavigatorService.navigate('TambahMember',{idgrup: props.navigation.state.params.idgrup});
    }

    const CustomNav = (title) => {
      return(
      <View style={styles.header}>
        <LinearGradient
          colors={['#52B788', '#52B788']}
          //colors={['white', 'white']}
          style={[styles.linearHeader, {justifyContent: 'space-between'}]}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={styles.touchHeader} onPress={()=>props.navigation.goBack()}>
              <Image source={allLogo.icArrow} style={styles.icBack} />
            </TouchableOpacity>
            <Text style={[styles.title, {fontSize: title.length >= 28 ? toDp(14) : toDp(20) }]}>{title}</Text>
          </View>
          <TouchableWithoutFeedback
              style={[styles.touchHeader, {marginRight: toDp(8)}]}
              onPress={()=>toggleMenu()}>
              <Icon name="menu" size={30} color="#FFF" style={[styles.icBack,{top:toDp(-4), right:toDp(10)}]}/>

          </TouchableWithoutFeedback >
        </LinearGradient>
      </View>
    )
    };

    const menus = ()=>{
       return(
        <View
         style={{backgroundColor:'white', width:'45%', position:'absolute',zIndex:999, flexDirection:'column', right:'5%',top:'6%', borderRadius:toDp(5)}}>
              <MenuItem disabled>{mg_judul}p</MenuItem>
              <MenuDivider />
              <MenuItem onPress={()=> carimember()}>
                {mg_menusatu}
              </MenuItem>
        </View>
       )
    }

    return (
        <View style={styles.container}>
            <Loader loading={state.loading} />
            {CustomNav(gdetail)}
            {isModalVisible==1 &&
              menus()
            }

            <View style={{ alignItems: 'center', marginTop: toDp(10),marginBottom:20}}>
                <View style={{justifyContent:'center'}}>
                  <Image source={allLogo.icBaqi} style={styles.logo} />
                </View>
                <Text style={styles.jdlGrup}>{props.navigation.state.params.judulgrup}</Text>
                <Text style={styles.descGrup}>{props.navigation.state.params.deskripsi}</Text>

            </View>

            <View style={styles.viewContent}>
                <View style={styles.viewRankAnggota}>
                    <View style={styles.viewRank}>
                        <Text style={styles.txtRank}>{state.currentRank}</Text>
                        <Text style={styles.txtRank}>{peringkat}</Text>
                    </View>
                    <View style={{ height: toDp(35), width: toDp(1), backgroundColor: '#438364' }} />
                    <View style={styles.viewRank}>
                        <Text style={styles.txtRank}>{state.total}</Text>
                        <Text style={styles.txtRank}>{anggota}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.content}>

                <View style={{ width: '100%', marginTop: toDp(40), height:'100%'}}>
                    <FlatList
                        refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={refresh}
                        />}
                        data={state.arrayAnggota}
                        renderItem={({ item, index }) => {
                            return (
                                listAnggota(item.member.gm_uid, item.member.name, item.member.created, item.member.picture, item.owner)
                            )
                        }}
                        keyExtractor={item => item.id}
                        ListFooterComponent={() => <View style={{ height: toDp(50), marginBottom:toDp(190) }} />}
                    />
                </View>


            </View>


        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#52B889'
    },
    content: {
        width: '100%',
        marginBottom: 90,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopRightRadius: toDp(25),
        borderTopLeftRadius: toDp(25),
        marginTop: 10
    },
    viewCenterAbsolute: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    viewContent: {
        backgroundColor: 'white',
        width: '70%',
        height: 60,
        zIndex: 1,
        borderRadius: 10,
        shadowColor: "#A3A3A3",
        shadowOffset: {
        	width: 0,
        	height: 0,
        },
        elevation: 17,
        marginBottom:-40
    },
    viewRankAnggota: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: toDp(10)
    },
    txtRank: {
        fontSize: toDp(16),
        color: '#024024',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    jdlGrup: {
        fontSize: toDp(25),
        fontWeight: 'bold',
        color: 'white',
        // margin: toDp(3)
    },
    descGrup: {
        fontSize: toDp(15),
        color: 'white',
        margin: toDp(3)
    },
    logo: {
        width: toDp(80),
        height: toDp(80),
        resizeMode: 'contain'
    },
    viewListAnggota: {
        width: '90%',
        paddingHorizontal:15,
        height: toDp(70),
        backgroundColor: 'white',
        margin: toDp(6),
        borderRadius: toDp(15),
        justifyContent: 'space-between',
        flexDirection: 'row',
        shadowColor: "#A3A3A3",
        shadowOffset: {
        	width: 0,
        	height: 0,
        },
        elevation: 17,

    },
    titles: {
        fontWeight: 'bold',
        fontSize: toDp(15),
        color: '#024024'
    },
    deskrip: {
        fontSize: toDp(12),
        color: '#024024'
    },
    viewText: {
        justifyContent: 'center',
        right: toDp(20),
        left:toDp(-8),
        // marginTop: toDp(6),
        // marginLeft: toDp(10),
    },
    fotoAnggota: {
        height: 45,
        width: 45,
        borderRadius: 60,
        backgroundColor:'#ccc'
    },
    btnRemove: {
        justifyContent: 'center',
        alignItems: 'center',
        width:'15%'
    },
    txtowner: {
        justifyContent: 'center',
        alignItems: 'center',
        width:'15%',

    },
    icRemove: {
        width: toDp(22),
        height: toDp(18)
    },


    header: {
      width,
      //height: 'auto',
      backgroundColor: '#52B788',
    },
    linearHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: toDp(8),
      height: (height / 12) + (Platform.OS === 'android' ? toDp(0) : toDp(20)) ,
      paddingTop: Platform.OS === 'android' ? toDp(0) : toDp(20)
    },
    touchHeader: {
      padding: toDp(4),
    },
    icBack: {
      marginHorizontal: toDp(8),
      width: toDp(24),
      height: toDp(24),
      resizeMode: 'contain',
      tintColor: 'white'
    },
    title: {
      color: 'white',
      fontSize: toDp(20),
      marginLeft: toDp(8),

    },
})

export default GrupDetail;
