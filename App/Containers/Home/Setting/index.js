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
  Platform,
  Alert,
} from "react-native";
//import { firebase } from '../../../Configs/firebase'
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Loader from '@Loader'
import { svr } from '../../../Configs/apikey';
import axios from 'axios';
import Modal from 'react-native-modal'
const { width, height } = Dimensions.get('window')
import ImagePicker from 'react-native-image-crop-picker'
import NavigatorService from '@NavigatorService';
import Toast from 'react-native-toast-message';
const Setting = () => {
  //setState
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
    login:''
  })

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
      //console.log('response =>'+ response);
      let data    = JSON.parse(response);
      const datas = JSON.stringify(data[0]);
      let users   = JSON.parse(datas);
      setState(state => ({...state,
        name: users?.name,
        phone: users?.phone,
        email: users?.email,
        photo: users?.picture
      }))
      //console.log(response)

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
    if(state.name!='' && state.phone!='' && state.email!=''){
      setState(state => ({...state, valName:false }))
      setState(state => ({...state, valMail:false }))
      setState(state => ({...state, valPhone:false }))
    }
  }, [])

  //Lets update


  const validate = ()=>{
    if(state.name === ''){
      setState(state => ({...state, valName:true }))
      return
    }else{
      setState(state => ({...state, valName:false }))
    }

    if(state.email === '' ){
      setState(state => ({...state, valMail:true }))
      return
    }else{
      setState(state => ({...state, valMail:false }))
    }

    if(state.phone===''){
      setState(state => ({...state, valPhone:true }))
      return
    }else{
      setState(state => ({...state, valPhone:false }))
    }

    if(state.name!='' && state.phone!='' && state.email!=''){
      update()
    }

  }

  const update = () => {
       let body = {
         name: state.name,
         email: state.email,
         phone: state.phone,
       }
       setState(state => ({...state, loading: true }))
       axios.post(svr.url+'users/'+state.id+'/'+svr.api+'/',body)
       .then(result =>{
           if(result.data.status==200){
             console.log('This Update =>', result);
             setState(state => ({...state, loading: false }))
             ToasSuccess();
             refresh()
           }else if(result.data.status==500){
             console.log("Failed updating data!");
             setState(state => ({...state, loading: false }))
             alert('Gagal Update, Terjadi kesalahan pada server!')
           }
       }).catch(err =>{
         alert('Gagal Update, coba lagi nanti')
         setState(state => ({...state, loading: false }))
       })
  }

  const refresh = async() => {
    setState(state => ({...state, loading: true }))
    axios.get(svr.url+'users/'+state.id+'/'+svr.api)
    .then(result =>{
        if(result.data.status==200){
          console.log('This refresh =>', result.data.value);
          let datas = result.data.value;
          //save Async Storage
          try {
             AsyncStorage.setItem('users', JSON.stringify(datas))
          } catch (e) {
              alert('Error : Tidak ada data')
          }
          //setUser(datas)
          getData()
          setState(state => ({...state, loading: false }))
        }else if(result.data.status==404){
          alert("Pengguna tidak ditemukan!");
          setState(state => ({...state, loading: false }))
        }else if(result.data.status==500){
          alert("Terjadi kesalahan pada server!");
          setState(state => ({...state, loading: false }))
        }
    }).catch(err =>{
      alert('Gagal memuat data!')
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
        alert('Gagal, data tidak ditemukan ')
    }
  }

  const validateMail = (text) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setState(state => ({...state, valMail: true }))
      setState(state => ({...state, email: text }))
      return false;
    }
    else {
      setState(state => ({...state, email: text }))
      setState(state => ({...state, valMail: false }))
    }
  }

  const ToasSuccess = () =>{
     Toast.show({
       type: 'success',
       visibilityTime: 6000,
       position:'bottom',
       bottomOffset:10 ,
       text1: 'Update Profil',
       text2: 'Profil Berhasil di update 👋'
    });
  }

  const camera = () => {
    ImagePicker.openCamera(state.options).then(response => {
      upImageToServer(response)
    }).catch(err => {
      console.log(err)
      if(err == 'Error: Required permission missing' || err == 'User did not grant camera permission.') {
        Alert.alert(
          'Pengaturan',
          'Akses ambil foto belum diaktifkan.\nBerikan akses untuk memulai mengambil gambar. Aktifkan akses ambil foto dari Pengaturan.',
          [
            {text: 'Nanti Saja', onPress: () => console.log('Cancel')},
            {text: 'Aktifkan', onPress: () => {
              Linking.openSettings();
            }},
          ],
          {cancelable: false},
        );
      }
    })
  }

  const gallery = () => {
    ImagePicker.openPicker(state.options).then(response => {
    //  processUpload(response)
      upImageToServer(response)
    }).catch(err => {
      console.log(err)
      if(err == 'Error: Required permission missing' || err == 'Error: Cannot access images. Please allow access if you want to be able to select images.') {
        Alert.alert(
          'Pengaturan',
          'Akses pilih foto belum diaktifkan.\nBerikan akses untuk memulai mengambil gambar. Aktifkan akses pilih foto dari Pengaturan.',
          [
            {text: 'Nanti Saja', onPress: () => console.log('Cancel')},
            {text: 'Aktifkan', onPress: () => {
              Linking.openSettings();
            }},
          ],
          {cancelable: false},
        );
      }
    })
  }

  const randomString = (len, charSet) => {
    charSet = charSet || 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  }

  // const processUpload = (response) => {
  //   if(response.didCancel) {
  //   } else {
  //     console.log('response.path', response.path);
  //     const reference = storage().ref(randomString(8)+'.jpg')
  //     reference.putFile(response.path).then(response => {
  //       console.log('response', response)
  //       let picture = 'https://firebasestorage.googleapis.com/v0/b/'+response.metadata.bucket+'/o/'+(Platform.OS === 'android' ? response.metadata.fullPath : response.metadata.name)+'?alt=media'
  //       console.log('picture', picture);
  //       setState(state => ({...state, modalVisible: false, photo: picture}))
  //
  //       upFoto(picture)
  //       //alert(JSON.stringify(picture))
  //     }).catch(error => {
  //       console.log('error', error)
  //       setState(state => ({...state, modalVisible: false}))
  //       //alert(JSON.stringify(error))
  //     })
  //   }
  // }

  const upImageToServer=(imagePath) => {
    const imageDta = new FormData();
    imageDta.append("picture", {
      uri: imagePath.path,
      name: 'image.jpg',
      type: 'image/jpg'
    })
    //console.log('THIS => '+ JSON.stringify(imageDta));
    fetch(svr.url+'users/'+state.id+'/'+svr.api+'/',
      {
        headers:{
          'Accept':'application/json',
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: imageDta
      }
    ).then(response => response.json())
     .then(response => {
        console.log(response)
        if(response.status==200){
          refresh()
        }
    }).catch(err =>{
      console.log(err)
      alert('Gagal menerima data dari server!')
      setState(state => ({...state, loading: false }))
    })
  }

  const renderModal = () => {
    return (
      <Modal
        onBackdropPress={() => setState(state => ({...state, modalVisible: false})) }
        isVisible={state.modalVisible}
        style={styles.bottomModal}>

        <View style={styles.viewRootModal}>
          <View style={[styles.modalBox, {backgroundColor: '#FFFFFF', height: toDp(192)}]}>
            <View style={styles.viewModalTitle}>
              <TouchableOpacity style={styles.touchSilang} onPress={() => setState(state => ({...state, modalVisible: false})) }>
                <Image source={allLogo.icSilang} style={styles.icSilang} />
              </TouchableOpacity>
              <Text style={[styles.textTitleModal, {color: '#363636'}]}>{'Ubah Foto Profil'}</Text>
              <View style={styles.touchSilang} />
            </View>

            <View style={{marginTop: toDp(24), marginLeft: toDp(16)}}>

              <View style={styles.viewButton}>
                <Pressable
                  onPress={() => camera() }
                  style={[styles.presableButton, {backgroundColor: '#7BA95C'}]}
                >
                  <Text style={styles.text}>Kamera</Text>
                </Pressable>
                <Pressable
                  onPress={() => gallery() }
                  style={[styles.presableButton, {backgroundColor: '#EE6C4D'}]}>
                  <Text style={styles.text}>Galeri</Text>
                </Pressable>
              </View>

            </View>

          </View>
        </View>
      </Modal>
    )
  }

  const toUppercase = (str) =>{
    return str.replace(
      /\w\S*/g,
      function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  return (
    <View>
        <ScrollView style={styles.scrollView}>
          {renderModal()}
          <View style={styles.container}>
            <Loader loading={state.loading} />
            <Pressable onPress={() => setState(state => ({...state, modalVisible: true}))} style={{marginTop:toDp(20)}}>
              <Image source={allLogo.icEdit}  style={styles.icEdit} / >
              <Image
                source={state.photo
              ? {uri: state.photo}
              : require('../../../Assets/img/profile.png')}
                style={styles.imgProfile} />
            </Pressable>

            <View style={styles.card}>
                <View style={styles.vimput}>
                  <Text>Nama </Text>
                  <TextInput style={styles.input} value={state.name} placeholder={'Nama Lengkap'}
                  onChangeText={(name) => setState(state => ({...state, name }))}/>
                </View>

                { state.valName === true ? (
                 <Text style={styles.errorMessage}>
                   * Nama tidak boleh kosong!
                 </Text>
                ) : null  }

                <View style={styles.vimput}>
                  <Text>Nomor Hp</Text>
                  <TextInput style={styles.input} value={state.phone}  placeholder={'08XXXXXX'} keyboardType = 'numeric'
                  onChangeText={(phone) => setState(state => ({...state, phone }))}/>
                </View>

                { state.valPhone === true ? (
                 <Text style={styles.errorMessage}>
                   * Nomor Hp tidak boleh kosong!
                 </Text>
                ) : null  }

                <View style={styles.vimput}>
                  <Text>Email</Text>
                  <TextInput style={styles.input} value={state.email}  placeholder={'email@domain.com'}
                  onChangeText={(email) => validateMail(email)}/>
                </View>

                { state.valMail === true ? (
                 <Text style={styles.errorMessage}>
                   * Email tidak boleh kosong!
                 </Text>
                ) : null  }

                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:toDp(15), marginLeft:toDp(2)}}>
                    {state.login==='google' || state.login==='facebook'?
                      <View>
                        <Text style={{fontSize:toDp(12)}}>
                            Kamu Masuk Dengan
                        </Text>
                        <Text style={{fontWeight:'bold'}}>
                            {toUppercase(state.login)}
                        </Text>
                      </View>
                    :
                        <Pressable onPress={()=> NavigatorService.navigate('UbahPassword')}>
                          <Text>
                              Ubah Kata Sandi?
                          </Text>
                        </Pressable>

                   }


                      <Pressable style={styles.presableSave} onPress={()=>    validate()}>
                        <Text style={{color:'#FFF'}}>Simpan</Text>
                      </Pressable>

                </View>
            </View>
          </View>
        </ScrollView>
    <Toast/>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    width:toDp(100),
    height:toDp(100),
    borderRadius: toDp(60)
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
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  viewRootModal: {
    width,
    position: 'absolute',
    bottom: 0
  },
  modalBox: {
    width,
    height: toDp(165),
    backgroundColor: '#111111',
    borderTopLeftRadius: toDp(16),
    borderTopRightRadius: toDp(16)
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewModalTitle: {
    marginTop: toDp(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: toDp(16)
  },
  touchSilang: {
    padding: toDp(4),
  },
  icSilang: {
    width: toDp(24),
    height: toDp(24),
  },
  textTitleModal: {
    fontSize: toDp(16),
    color: '#363636',
    fontWeight: 'bold'
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
});

export default Setting;
