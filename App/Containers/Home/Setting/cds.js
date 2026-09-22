import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable, TextInput, ScrollView, AsyncStorage
} from "react-native";
import { firebase } from '../../../Configs/firebase'
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Loader from '@Loader'

const Setting = () => {
  //setState
  const [state, setState] = useState({
    loading: false,
    id:'',
    name: '',
    phone: '',
    email: ''
  })

  //get data
  useEffect(() => {
    //Get data pengguna
    AsyncStorage.getItem('users').then(response =>{
      console.log('response', response);
      let users =JSON.parse(response)
      setState(state => ({...state,
        name: users?.name,
        phone: users?.phone,
        email: users?.email
      }))
    }).catch(err =>{
      console.log('err', err)
    })
    //---------------------------------------------
    //Get id pengguna
    AsyncStorage.getItem('uid').then(uids =>{
      let ids =JSON.parse(uids)
      setState(state => ({...state,
        id: ids
      }))

    }).catch(err =>{
      console.log('err', err)
    })
    alert(state.id)
  }, [])

  //Lets update
  const update = () => {
    let body = {
     name: state.name,
     email: state.email,
     phone: state.phone,
   }

    setState(state => ({...state, loading: true }))
    firebase.firestore().collection('users')
    .doc(state.id)
    .update(body)
    .then((docRef) => {
      console.log('docRef', docRef);
      setState(state => ({...state, loading: false }))

    }).catch((error) => {
      console.log("Error adding document: ", error);
      setState(state => ({...state, loading: false }))
      alert('Error ' + error)
    })

  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Loader loading={state.loading} />
          <Image style={styles.imgProf} source={allLogo.Profile}/>

        <View style={styles.card}>
            <View style={styles.vimput}>
              <Text>Name</Text>
              <TextInput style={styles.input} value={state.name} placeholder={'Winda Nurhasanah'}
              onChangeText={(name) => setState(state => ({...state, name }))}/>
            </View>

            <View style={styles.vimput}>
              <Text>Phone</Text>
              <TextInput style={styles.input} value={state.phone}  placeholder={'089686723'}
              onChangeText={(phone) => setState(state => ({...state, phone }))}/>
            </View>

            <View style={styles.vimput}>
              <Text>Email</Text>
              <TextInput style={styles.input} value={state.email}  placeholder={'Email@domain.com'}
              onChangeText={(email) => setState(state => ({...state, email }))}/>
            </View>

            <View style={styles.vimput}>
              <Pressable style={styles.presableSave} onPress={()=> update()}>
                <Text style={{color:'#FFF'}}>Simpan</Text>
              </Pressable>
            </View>
        </View>
      </View>
    </ScrollView>
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
    alignItems: 'center',
    width: toDp(300),
    padding: toDp(8)
  },
  vimput:{
    marginTop: toDp(13),
    width: '100%',
  },
  input:{
    width: '100%',
    height: toDp(55),
    backgroundColor: '#F2F3F3',
    paddingHorizontal: toDp(18),
    borderRadius: toDp(4),
    marginTop: toDp(8),
  },
  presableSave: {
    width: '100%',
    height: toDp(55),
    marginTop: toDp(16),
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(4),
  }
});

export default Setting;
