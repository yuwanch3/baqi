import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable, TextInput, ScrollView, AsyncStorage,TouchableOpacity,Dimensions,
  Linking,
  Platform,ActivityIndicator,
  Alert, Animated, BackHandler
} from "react-native";
//import { firebase } from '../../../Configs/firebase'
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Loader from '@Loader'
import { svr } from '../../../Configs/apikey';
import axios from 'axios';
import Header from '@Header'
import Modal from 'react-native-modal'
const { width, height } = Dimensions.get('window')
import ImagePicker from 'react-native-image-crop-picker'
import NavigatorService from '@NavigatorService';
import Svg, { G, Circle } from "react-native-svg";
var deviceWidth = Dimensions.get('window').width;
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

const Prosses = (props) => {
  //setState
  const { t } = useTranslation();
  let halo = t('common:halo');
  let keseluruhan = t('common:keseluruhan');
  let semangat = t('common:semangat');
  let err_data = t('common:err_data');
  let err_trima = t('common:err_trima');
  let dataNull = t('common:dataNull');
  let err_404 = t('common:err_404');
  let err_500 = t('common:err_500');
  let st_kerjakan = t('common:st_kerjakan');
  let st_buatkamu = t('common:st_buatkamu');
  let st_notif_prgs = t('common:st_notif_prgs');
  let nobaner = t('common:nobaner');

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedInput = Animated.createAnimatedComponent(TextInput);

  const [percentage, setPercentage] = useState(0);
  const radius     = 40;
  const strokeWidth= 10;
  const duration = 500;
  const color = '#FFF';
  const delay = 40;
  const textColor = '';
  const [max, setMax] = useState(0);

  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const cirleRef = React.useRef();
  const inputRef = React.useRef();
  const halfCircle = radius+ strokeWidth;
  const circleCircumference = 2* Math.PI * radius;
  const animation = (toValue) => {
      return Animated.timing(animatedValue, {
        toValue,
        duration,
        delay,
        useNativeDriver: true,
      }).start()
  }

  const [userss, setUser] = useState({})
  const [state, setState] = useState({
    loading: false,
    id:'',
    name: '',
    phone: '',
    email: '',
    updated:false,
    photo:'',
    valName:false,
    valMail:false,
    valPhone:false,
    modalVisible: false,
    options: {
      width: 750,
      height: 750,
      cropping: true,
    },
    login:'',
    lastestData:[],
    banner: [],
    inload: true,
    inbmsg: false
  })
  const [uid, setUid] = useState('');

  //get data
  useEffect(() => {

    AsyncStorage.getItem('login').then(response =>{
      console.log('login :', response);
      setState(state => ({...state, login: response}))
    }).catch(err =>{
      console.log('err', err)
    })
    //Get data pengguna
    AsyncStorage.getItem('users').then(response => {
      let data    = JSON.parse(response);
      const datas = JSON.stringify(data[0]);
      let users   = JSON.parse(datas);
      setState(state => ({...state,
        name: users?.name,
        phone: users?.phone,
        email: users?.email,
        photo: users?.picture
      }))
    }).catch(err => {
      console.log('err', err)
    })
    //Get id pengguna
    AsyncStorage.getItem('uid').then(uids =>{
      let ids =uids;
      setState(state => ({...state,
        id: ids
      }))
    }).catch(err =>{
      console.log('err', err)
    })

    getBanner().then(result =>{
       setState(state => ({...state, banner: result }))
       setState(state => ({...state, inload: false, inbmsg: false }))
    }, error1 => {
        setState(state => ({...state, banner: [] }))
        setState(state => ({ ...state, inload: error1, inbmsg: true  }))
    })

    return()=>{
      AsyncStorage.getItem('uid').then(uids =>{
        let ids =uids;
          getKalkulasi(ids)
          getLastest(ids)
      })
    }
  },[state.id])

  useEffect(()=>{
        AsyncStorage.getItem('percent').then(data =>{
          let news = JSON.parse(data);
          let maxs    = news.total;
          let percent = news.done;
            animation(percent)
            animatedValue.addListener((v) =>{
              if(cirleRef?.current){
                const maxPerc = (100 * v.value) / maxs;
                const strokeDashoffset = circleCircumference - (circleCircumference*maxPerc) / 100;

                cirleRef.current.setNativeProps({
                  strokeDashoffset,
                });
              }

              if(inputRef?.current){
                const maxtes = ((percent/maxs)*100);

                inputRef.current.setNativeProps({
                  text : `${Math.round(maxtes)}`+'%',
                });
              }
            })
        })
      return () =>{
         animatedValue.removeAllListeners();
      }
  },[max])

  const getKalkulasi = (id) => {
    setState(state => ({...state, loading: true }))
    axios.get(svr.url+'progress/'+id+'/'+svr.api)
    .then(result =>{
        if(result.data.status==200){

          let datas = {
             total : result.data.value.total,
             done : result.data.value.done
          }
          setMax(datas.total)
          AsyncStorage.setItem('percent', JSON.stringify(datas));
          setState(state => ({...state, loading: false }))
          getLastest()
        }else if(result.data.status==500){
          alert(err_500);
          setState(state => ({...state, loading: false }))
        }else if(result.data.status==404){

          setState(state => ({...state, loading: false }))
        }
    }).catch(err =>{
      alert(err_data)
      setState(state => ({...state, loading: false }))
    })
  }

  const getData = () =>{
    try {
        AsyncStorage.getItem('users').then(response =>{
          console.log('response', response);
          let data    = JSON.parse(response);
          const datas = JSON.stringify(data[0]);
          let users   = JSON.parse(datas);
          setState(state => ({...state,
            name: users?.name,
            phone: users?.phone,
            email: users?.email,
            photo:users?.picture
          }))
        }).catch(err =>{
          console.log('Error', err)
        })
    } catch (e) {
        alert(err_data)
    }
  }

  const getLastest = (id) =>{
    axios.get(svr.url+'lastest/indi/'+id+'/'+svr.api)
    .then(result =>{
        if(result.data.status==200){
          let data = result.data.value.map(doc => {
              return {
                id: doc.id,
                value: doc
              }
           })
          setState(state => ({...state, lastestData: data }))
          setState(state => ({...state, loading: false }))
        }else if(result.data.status==404){

          setState(state => ({...state, loading: false }))
        }else if(result.data.status==500){
          alert(err_500);
          setState(state => ({...state, loading: false }))
        }
    }).catch(err =>{
      alert(dataNull)
      setState(state => ({...state, loading: false }))
    })
  }

  const generateBackgroundColor = (index) => {
    if(index % 3 == 0) {
      return '#A2D2D9'
    } else if(index % 3 == 1) {
      return '#FFE89F'
    } else if(index % 3 == 2) {
      return '#A7BD3C'
    } else {
      return '#E8F0FD'
    }
  }

  const toUppercase = (str) =>{
    return str.replace(
      /\w\S*/g,
      function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  const subStr= (data)=>{
    let text   = data;
    let result ='';
    let newtext='';
    if(text.length > 20){
       result = text.substring(0, 22);
       newtext = result+'...';

    }else{
      newtext = text;
    }
    return newtext;
  }

  const CardLastest = (item, index) =>{
    var per = 0;
    var max = 0;
    const progress=new Animated.Value(0);

    if(item.value.current==0 && item.value.total==0){
       per = 0;
       max = 100;
    }else{

       per = (item.value.current/item.value.total)*100;
       max = (item.value.total/item.value.total)*100;
    }
    const toVal = Math.round(per);

    const progressAnim = progress.interpolate({
        inputRange: [0, max],
        outputRange: ['0%','100%']
    })

    Animated.timing(progress, {
        toValue: toVal,
        duration: 1000,
        useNativeDriver: false
    }).start();

    return(

        <View key={index} style={[styles.manyCard, {backgroundColor: generateBackgroundColor(index)}]}>
            <View style={{minHeight:toDp(120), justifyContent:'center',}}>
                <Text style={{fontSize:toDp(15), color:'#0D4534', fontWeight:'bold'}}>{subStr(item.value.information)}</Text>
                <View style={{marginTop:toDp(7)}}>
                    <View key={index} style={{
                        width: '100%',
                        height: toDp(20),
                        borderRadius: toDp(20),
                        backgroundColor: '#00000020',

                    }}>
                        <Animated.View
                            key={index}
                            style={[{
                            height: toDp(20),
                            borderRadius: toDp(20),
                            backgroundColor: '#FF9900'
                        },{
                            width: progressAnim
                        }]}>

                        </Animated.View>

                    </View>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', marginTop:toDp(8)}}>
                  <View style={{width:'50%'}}>
                      <Text
                        style={{fontSize:toDp(14), color:'#0D4534', fontWeight:'bold'}}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {subStr(item.value.lname)}
                      </Text>
                      <Text
                        style={{fontSize:toDp(12), color:'#0D4534', fontWeight:'bold'}}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.value.name==item.value.lname ? item.value.excerpt : item.value.name}
                      </Text>
                  </View>
                  <View style={{width:'50%', alignItems:'flex-end'}}>
                      <Text style={{fontSize:toDp(25), color:'#0D4534', fontWeight:'bold'}}>{Math.round(per)}%</Text>
                  </View>
                </View>
            </View>
        </View>

    )

  }

  const getBanner = () =>{
    return new Promise((resolve, reject) => {
          axios.get(svr.url+'banner/'+svr.api)
          .then(result =>{
              if(result.data.status==200){
                resolve(result.data.baner)
              }else{
                reject(false)
              }

          }).catch(err =>{
            reject(false)
          })
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
          <Loader loading={state.loading} />

          <View style={{flexDirection:'row',width:'100%', marginTop:toDp(40),paddingLeft:toDp(30), paddingRight:toDp(30)}}>
              <View style={{width:'20%'}}>
                  <Image
                    source={state.photo
                  ? {uri: state.photo}
                  : require('../../../Assets/img/profile.png')}
                    style={styles.imgProf} />
              </View>
              <View style={{width:'80%', paddingLeft:toDp(10)}}>
                  <Text style={{fontSize:toDp(25), fontWeight:'bold'}}>{halo}</Text>
                  <Text style={{fontSize:toDp(15),color:'#5C5C5C'}}>{state.name}</Text>
              </View>
          </View>

          <View style={styles.cardWrapper}>

                <View style={styles.cardChart}>
                    <ImageBackground source={allLogo.bgprocess} resizeMode="cover" style={styles.background}>
                    </ImageBackground>
                    <View style={{height:toDp(120), justifyContent:'center', width:'50%'}}>
                        <Text style={{fontSize:toDp(20), color:'#FFF', fontWeight:'bold'}}>{keseluruhan}</Text>
                        <Text style={{fontSize:toDp(13), color:'#FFF', }}>{semangat}</Text>
                    </View>

                    <View style={{height:toDp(120), justifyContent:'center',width:'40%', alignItems:'center'}}>
                          <View style={styles.graphWrapper}>
                              <Svg height="150" width="150" viewBox="0 0 180 180">
                                    <G rotation={-90} originX="90" originY="90">
                                       <Circle
                                          cx='50%'
                                          cy='50%'
                                          stroke={color}
                                          strokeWidth={strokeWidth}
                                          fill='transparent'
                                          strokeOpacity={0.6}
                                          r={radius}
                                          />

                                          <AnimatedCircle
                                             ref = {cirleRef}
                                             cx='50%'
                                             cy='50%'
                                             stroke={'#FFE925'}
                                             strokeWidth={strokeWidth}
                                             fill='transparent'
                                             r={radius}
                                             strokeDasharray={circleCircumference}
                                             strokeDashoffset={circleCircumference}
                                             strokeLinecap='round'
                                          />
                                    </G>
                              </Svg>
                              <TextInput
                                  ref={inputRef}
                                  underlineColorAndroid={'transparent'}
                                  editable={false}
                                  defaultValue='0'
                                  style={[
                                    StyleSheet.absoluteFillObject,
                                    {fontSize:radius/2, color: '#FFE925'},
                                    {fontWeight:'900', textAlign:'center'}
                                  ]}
                              />
                          </View>
                    </View>

                </View>

          </View>

          <View>
              <View style={{marginTop:toDp(15), backgroundColor:'#FFF', width:'100%', paddingLeft:toDp(30), paddingRight:toDp(30)}}>
                  <View style={{marginTop:toDp(20), marginBottom:toDp(15)}}>
                      <Text style={{fontSize:toDp(18), fontWeight:'bold', color:'#5C5C5C'}}>{st_kerjakan}</Text>
                  </View>
              </View>

              <View style={{minHeight:toDp(135)}}>
                  {state.lastestData.length>0 ?
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                                  >
                          <View style={{flexDirection:'row', backgroundColor:'#FFF',  marginLeft:toDp(20), marginRight:toDp(20)}}>
                            {
                              state.lastestData.map((item, index)=>{
                                  return(
                                     CardLastest(item, index)
                                  )
                              })
                            }

                          </View>
                        </ScrollView>

                      :
                      <View style={{height:toDp(120),
                                    width:'100%',
                                    borderRadius:toDp(15),
                                    paddingHorizontal:toDp(30),
                                    paddingLeft:toDp(28),
                                    paddingRight:toDp(28),
                                    justifyContent:'center',
                                    alignItems:'center'
                                  }}>
                                  <View style={{height:toDp(120),
                                                width:'100%',
                                                backgroundColor:'#E7E7E7',
                                                borderRadius:toDp(15),
                                                justifyContent:'center',
                                                alignItems:'center'
                                              }}>
                                  <Text style={{fontSize: toDp(14), color:'#848484'}}>{st_notif_prgs}</Text>
                                  </View>
                      </View>
                  }


              </View>
          </View>

          <View>

              <View style={{marginTop:toDp(0), backgroundColor:'#FFF', width:'100%', paddingLeft:toDp(30), paddingRight:toDp(30)}}>
                  <View style={{marginTop:toDp(15), marginBottom:toDp(15)}}>
                      <Text style={{fontSize:toDp(18), fontWeight:'bold', color:'#5C5C5C'}}>{st_buatkamu}</Text>
                  </View>
              </View>
              <View style={{height:toDp(120), justifyContent:'center', alignItems:'center'}}>
              {
                state.inbmsg==true?

                    <Text style={{fontSize: toDp(14), color:'#848484'}}>{nobaner}</Text>

                :
                  <></>
              }

                  {
                    state.inload==true ?
                      <ActivityIndicator size="large" color="#05B628" />
                    :<>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                            <View style={{flexDirection:'row', marginLeft:toDp(20), marginRight:toDp(20)}}>
                               {
                                 state.banner.map(doc => {
                                     return (
                                       <>
                                          <Image source={{uri: doc.image}} style={{height:toDp(110),width: toDp(300), resizeMode:'stretch', marginLeft:toDp(10), marginRight:toDp(10)}}/>
                                       </>
                                     )
                                  })
                               }

                            </View>
                          </ScrollView>
                      </>
                  }



              </View>


          </View>


     </ScrollView>
   </View>
  )
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor:'#FFFFFF'

  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'black',
  },
  card:{
    flex: 1,
    width: toDp(300),
    padding: toDp(8)
  },
  cardWrapper:{
    marginTop:toDp(30), backgroundColor:'#FFF', width:'100%', height:toDp(120),paddingLeft:toDp(30), paddingRight:toDp(30),
  },
  cardChart:{
    flexDirection:'row', backgroundColor:'#52B788', justifyContent:'space-between', height:toDp(120),
    borderRadius:toDp(15),
    paddingHorizontal:toDp(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  manyCard:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:toDp(223),
    minHeight: toDp(120),
    borderRadius:toDp(15),
    paddingHorizontal:toDp(30),
    paddingVertical: toDp(12),
    marginLeft:toDp(8),
    marginRight:toDp(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  background: {
    borderTopLeftRadius: toDp(15),
    width: toDp(300),
    marginLeft:0,
    marginTop:0,
    height: toDp(120),
    position:'absolute',
    resizeMode:'cover',
  },
  vimput:{
    marginTop: toDp(1),
    marginBottom:toDp(12),
    width: '100%',
  },
  vimputbtn:{
    marginTop: toDp(1),
    marginBottom:toDp(12),
    backgroundColor:'cyan'
  },
  input:{
    width: '100%',
    height: toDp(55),
    backgroundColor: '#F2F3F3',
    paddingHorizontal: toDp(18),
    borderRadius: toDp(4),
    marginTop: toDp(4),
  },
  presableSave: {
    width: '40%',
    height: toDp(40),
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(25),
  },
  imgProf:{
    width:toDp(50),
    height:toDp(50),
    borderRadius: toDp(60),

  },
  errorMessage:{
    color: 'red',
    fontSize: 12,
    left:0,
    position: 'relative',
  },
  imgProfile: {
    marginTop:toDp(0),
    width: toDp(110),
    height: toDp(110),
    borderRadius: toDp(70),
    marginBottom:toDp(12),
    zIndex: 1
  },
  icEdit:{
    marginTop:toDp(75),
    width:toDp(40),
    height:toDp(40),
    position: 'absolute',
    right: toDp(0),zIndex: 5
  },
  mbb:{
    marginBottom:toDp(20)
  },

  viewButton: {
    marginTop: toDp(16),
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  text: {
    fontSize: toDp(16),
    fontWeight: 'bold',
    color: 'white',
  },
  presableButton: {
    width: 'auto',
    paddingHorizontal: toDp(16),
    height: toDp(39),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(25),
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  graphWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 24,
  },
});

export default Prosses;