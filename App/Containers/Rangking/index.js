import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  ToastAndroid,FlatList,Alert
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient'
//import { firebase } from '../../Configs/firebase'
import NavigatorService from '@NavigatorService'
import Loader from '@Loader'
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import Modals from "react-native-modal";
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window')
const Ranking = (props) => {
  const { t } = useTranslation();
  let informasi = t('common:informasi');
  let batal = t('common:batal');
  let oke = t('common:oke');
  let err_data = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull = t('common:dataNull');
  let err_404 = t('common:err_404');
  let err_500 = t('common:err_500');
  let skor  = t('common:skor');
  let peringkat = t('common:peringkat');
  let totalskor = t('common:totalskor');
  let kembali  = t('common:kembali');
  let err_404V3 = t('common:err_404V3');
  let err_noskor = t('common:err_noskor');
  let youareGuest = t('common:guestAlert');
  const [darray, setDarray] = useState('');
  const [total, setTotal] = useState(0);
  const [rank, setRank] = useState(0);
  const [datas, setData] = useState([]);
  //const [dataSort, setSort] = useState([]);
  const [uids, setUids] = useState('');
  const [dd, setdd] = useState(0);
  const [ids, setIds]=useState([]);
  const [allus, setAllusers] = useState([]);
  const [carouseldata, setCarousel] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [is404, set404] = useState(false);
  
  const [state, setState] = useState({
    uid:'',
    name: '',
    photo:'',
    picture: '',
    activeIndex: 0,
    arrayFriends: [],
    arrayUsers: [],
    loading: false,
    totalScore:0,
    allScore:[],
    dataSort:[],
    dataCount:[],
    rank:0,
    login:''
  })
  const toggleModal = () => {
     setModalVisible(!isModalVisible);
  };
  const BackScreen=()=>{
    toggleModal();
  }
  const BackGo=()=>{
    props.navigation.goBack();
  }
  const toggle404 = () => {
     set404(!is404);
  };
  useEffect(() => {
      AsyncStorage.getItem('users').then(response =>{
        //console.log('response', response);
        let data    = JSON.parse(response);
        const datas = JSON.stringify(data[0]);
        let users   = JSON.parse(datas);
        setState(state => ({...state,
          uid: users?.id,
          name: users?.name,
          photo: users?.picture
        }))
        //setState(state => ({...state, uid: props.navigation.state.params.uid }));
      }).catch(err =>{
        console.log('err', err)
      })

      AsyncStorage.getItem('login').then(response =>{
        //console.log('login :', response);
        setState(state => ({...state, login: response}))
      }).catch(err =>{
        console.log('err', err)
      })

    getScore();
    return ()=>{
      getAllScore();
    };
  }, [state.uid])


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
  {/*Mengambil curent score  1*/}

  const getScore = async (event) =>{
    const id = props.navigation.state.params.uid;
    console.log(id);
    try{
      const res = await axios.get(svr.url+'skor/'+id+'/'+svr.api)
      if(res.data.status==200){
        if(res.data.value =='' || res.data.value==null){
          toggleModal();
        }else{
          setState(state => ({...state,
            rank       :res.data.value.rank,
            totalScore :res.data.value.total,
            name       :res.data.value.name,
            uid        :res.data.value.uid
          }))
        }
      }else if(res.status==500){
        showAlert(err_500)
      }
    }catch (e){
      showAlert(err_data)
    }
  }

  const getAllScore = async (event) =>{
    try{
      const response = await axios.get(svr.url+'skor/'+svr.api)
      if(response.status==200){
        let allUsers = response.data.value.map(doc => {
          return {
            id: doc.uid,
            value: doc
          }
        })
        setAllusers(allUsers)
        setCarousel(true)
        console.log('This All :'+ JSON.stringify(allUsers))

      }else if(res.status==500){
        showAlert(err_500)
      }
    }catch (e){
      toggle404()
      // alert('Opps, data belum tersedia')
    }
  }

  const renderItemExpore = (item, index) => {
    //console.log('item', item);
    return (
      <View style={styles.viewRenderExplore}>
        <View style={styles.viewImage}>
          <LinearGradient colors={['#3A3A3A33', 'transparent']} style={styles.gradientTop} />
          <Image source={{uri: item.item.value.picture}} style={styles.imageProfile} />
          <LinearGradient colors={['transparent', '#3A3A3ACC']} style={styles.gradientBottom} />
        </View>

        <View style={styles.viewImageContent}>
          <TouchableOpacity style={styles.touchSilangExplore} onPress={() => alert('In Progress')}>
            <Image source={allLogo.icResidentSilang} style={styles.icResidentSilang} />
          </TouchableOpacity>
          <View style={styles.viewDetail}>
            <Text style={styles.textNameExplore}>{item.item.value.name}</Text>
            <Text style={styles.textWork}>{totalskor} : {item.item.value.skor}</Text>
            <Text style={styles.textDistance}>{item.item.value.email}</Text>
          </View>
        </View>

      </View>
    )
  }

  const carousels=()=>{
    if(allus.length>0){
      return(
        <View>
        <Carousel
          layout={"default"}
          data={allus}
          sliderWidth={width}
          itemWidth={toDp(350)}
          renderItem={(item, index) => renderItemExpore(item, index)}
          onSnapToItem = { index => setState(state => ({...state, activeIndex: index})) }
        />
        </View>
      )
    }else{
      <View><Text style={{marginTop:200}}>Filled loading data...</Text></View>
    }
  }

  const rankList = () =>{
    if(allus.length>0){
    return(
    <View style={{marginBottom:50, flex:1}}>
      <FlatList
          data={allus}
          renderItem={({ item, index }) => {
              return (
                  listAnggota(item, index)
              )
          }}
          keyExtractor={item => item.id}
          ListFooterComponent={() => <View style={{ height: toDp(0), marginBottom:toDp(190)}} />}
      />
    </View>
    )
    }else{
      <View><Text style={{marginTop:200}}>{dataNull}...</Text></View>
    }
  }

  const displayName = (name) =>{
      	let count = '';
        let nama  = '';
        count = name.split(' ');
        nama  = count.slice(0, 2).join(' ');
        return nama
  }

  const listAnggota = (item, index) => {
      return (
          <View style={{alignItems: 'center' }}>
              <View style={styles.viewListAnggota}>
                      <View style={{justifyContent: 'center', alignItems: 'center', width:'20%'}}>
                          <Image source={{uri: item.value.picture=='' ? allLogo.icUsertmp :  item.value.picture}} style={styles.fotoAnggota} />
                      </View>

                      <View style={[styles.viewText,{width:'75%'}]}>
                          <Text style={styles.title}>{item.value.name}</Text>
                          <Text style={styles.deskrip}>{totalskor} : {item.value.skor}</Text>
                      </View>
              </View>
          </View>
      )
  }

  return (
    <View style={styles.container}>
      <Header
        title={'Ranking'}
        onPress={() => props.navigation.goBack()}
      />
      <Loader loading={state.loading} />

      <View style={styles.viewHeader}>
        <View style={styles.viewHd}>
          <View style={styles.viewPhotoName}>
            <Image
              source={state.photo
            ? {uri: state.photo}                      // Use object with 'uri'
            : require('../../Assets/img/profile.png')}
              style={styles.imgProfile} />
            <View style={{justifyContent:'flex-start', marginLeft:toDp(-12)}}>
              <Text style={styles.textName}>{displayName(state.name)}</Text>
            </View>
          </View>

          <View style={styles.viewScore}>
            <Text style={styles.textName}>{skor}</Text>
            <View style={styles.viewValueScore}>
              <Text style={styles.textNameVal}>{state.totalScore}</Text>
            </View>
          </View>
              <View style={{width: toDp(16)}} />
          <View style={styles.viewScore}>
            <Text style={styles.textName}>{peringkat}</Text>
            <View style={styles.viewValueScore}>
              <Text style={styles.textNameVal}>{state.rank}</Text>
            </View>
          </View>
        </View>
      </View>
      {/*<View style={{marginTop:200}}><ActivityIndicator size="small" color="#0000ff" /></View>*/}

      {carouseldata===true ?
        <View>
           {rankList()}
        </View>
        :

        <View style={styles.vnotfound} >
            <Image source={allLogo.ic404} style={{width:toDp(200), height:toDp(200)}} />
            <View style={{marginTop:40}}>
              <Text style={{fontSize:14, fontWeight:'bold'}}>
                {err_404V3}.
              </Text>

              <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={styles.btnBack} onPress={()=>BackGo()}>
                      <Text style={styles.txtBack}>{kembali}</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>

     }

      {/*modal*/}
      <Modals style={styles.modal} isVisible={isModalVisible}>
        <View style={styles.ViewModal}>

            <View style={{padding:toDp(20)}}>
              <Text style={{fontSize:toDp(20), fontWeight:'bold'}}>{informasi}</Text>
              <View style={{marginTop: toDp(16)}}>
                <Text style={{fontSize:toDp(16)}}>{state.login=='guest' ? youareGuest : err_noskor }.</Text>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.pressMbtn} onPress={()=> BackScreen() }>
                  <Text style={{fontWeight:'bold'}}>{oke}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modals>
      {/*end modal*/}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  viewHeader: {
    width: '90%',
    height: toDp(140),
    marginTop: toDp(20),
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
    //alignItems: 'center'
  },
  viewHd:{
    marginTop: toDp(20),
    flexDirection: 'row',
  },
  viewPhotoName: {
    alignItems: 'center',
    alignContent:'center',
    justifyContent: 'center',
  },
  imgProfile: {
    width: toDp(70),
    height: toDp(70),
    borderRadius: toDp(40),
    marginRight: toDp(15),
    backgroundColor:'#FFF'
  },
  textName: {
    marginTop: toDp(4),
    color: 'white',
    fontWeight: 'bold',
    fontSize: toDp(14)
  },
  textNameVal:{
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
  viewRenderExplore: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderRadius: toDp(16),
    marginTop: toDp(16)
  },
  viewImage: {
    width: '100%',
    height: '65%',
    position: 'absolute',
  },
  viewImageContent: {

    width: '100%',
    height: '100%',
    zIndex: 2
  },
  imageProfile: {
    width: toDp(350),
    height: '100%',
    borderRadius: toDp(16),
    position: 'absolute',
    resizeMode: 'contain'
  },
  gradientTop: {
    width: '100%',
    height: toDp(141),
    borderTopLeftRadius: toDp(16),
    borderTopRightRadius: toDp(16),
    zIndex: 1,
  },
  gradientBottom: {
    width: '100%',
    height: toDp(141),
    borderBottomLeftRadius: toDp(16),
    borderBottomRightRadius: toDp(16),
    position: 'absolute',
    bottom: 0
  },
  icResidentSilang: {
    width: toDp(28),
    height: toDp(28),
  },
  touchSilangExplore: {

    padding: toDp(4),
    position: 'absolute',
    right: toDp(16),
    top: toDp(16),
    zIndex:5
  },
  viewDetail: {
    marginTop: toDp(18),
    marginBottom:toDp(-18),
    position:'absolute',
    width:'100%',
    bottom:250,
    padding: toDp(20),
    zIndex: 2
  },
  textNameExplore: {
    fontSize: toDp(24),
    color: '#FFFFFF',
  },
  textWork: {
    marginTop: toDp(4),
    fontSize: toDp(14),
    color: '#FFFFFF',
  },
  textDistance: {
    marginTop: toDp(4),
    fontSize: toDp(14),
    color: '#FFFFFF',
  },
  modal:{
    marginVertical:'64%',
    maxHeight: toDp(200),
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
    flexDirection:'row',
    backgroundColor:'#f3f3f3',
    maxHeight:toDp(60),
    bottom:0,
    position:'absolute',
    width:'100%',
    right:toDp(0),
    borderBottomEndRadius:toDp(10),
    borderBottomStartRadius:toDp(10)
  },
  pressMbtn:{
    height:toDp(60), alignItems:'center',
    justifyContent:'center', flex:1
  },
  vnotfound:{
    marginVertical: '20%',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },
  btnBack:{
    color:'#fff',
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
    padding:toDp(12),
    borderRadius:toDp(10),
    marginTop: toDp(30),
    width: toDp(200)
  },
  txtBack:{
    alignItems:'center',
    color:'#fff',
    fontSize:toDp(16),
    fontWeight:'bold'
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
  fotoAnggota: {
      height: 45,
      width: 45,
      borderRadius: 60,
      backgroundColor:'#ccc'
  },
  viewText: {
      justifyContent: 'center',
      right: toDp(20),
      left:toDp(-8),
      // marginTop: toDp(6),
      // marginLeft: toDp(10),
  },
  title: {
      fontWeight: 'bold',
      fontSize: toDp(15),
      color: '#024024'
  },
  deskrip: {
      fontSize: toDp(12),
      color: '#024024'
  },
});

export default Ranking;
