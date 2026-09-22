import React,  { useEffect,useState }from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,Button,
  Pressable, AsyncStorage,Alert,FlatList,TextInput
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import NavigatorService from '@NavigatorService';
import translate from 'translate-google-api';

const Cb = () => {
  const [state, setState]=useState({
    id:'aku pergi sebentar',
    rank:'',
    skor:'',
    name:'',
    picture:'',
    lang:'id',
    langTo:'en'
  })
  const [Rs, setR]=useState('')
  const id = 'USR00000000000000001';
  const get=()=>{
     axios.get(svr.url+'skor/'+id)
    .then(response => {
      if(response.status==200){

        setState(state => ({...state,
          id:response.data.value.uid,
          rank:response.data.value.rank,
          skor:response.data.value.total,
          name:response.data.value.name

        }))

      }else{
        alert('gagal')
      }
    }
    )
    .catch(err => console.log(err));
  }
  const get_skor = async (event) =>{
    try{
      const response = await axios.get('https://baqi.invitebyme.com/skor/USR00000000000000001');
      if(response.status==200){
        setState(state => ({...state,
          id:response.data.value.uid,
          rank:response.data.value.rank,
          skor:response.data.value.total,
          name:response.data.value.name

        }))

      }else{
        alert('gagal')
      }
    }catch (e){
      alert('Erros: '+e)
    }
  }
  useEffect(()=>{

  },[])
  const trans = (val, lang, langTo)=>{
     let data=''
    const [r, setR]=useState('');
    translate(val, {from: lang, to: langTo})
    .then(res => {
           setR(res)
           data = r
    })
    return r
  }

  return (
    <View style={styles.container}>
      <Header
        title={'Ranking'}
        onPress={() => props.navigation.goBack()}
      />
      <Text>
      {trans('aku pada mu', 'id', 'en')}
      </Text>
    </View>
  )
}

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
    justifyContent: 'center',
  },
  imgProfile: {
    width: toDp(70),
    height: toDp(70),
    borderRadius: toDp(40),
    marginRight: toDp(15)
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(16),
    marginTop: toDp(16)
  },
  viewImage: {
    width: '100%',
    height: '100%',
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
  },
  viewDetail: {
    position: 'absolute',
    bottom: toDp(16),
    left: toDp(16),
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
  }
});

export default Cb;
