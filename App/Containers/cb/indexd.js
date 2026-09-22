import React,  { useEffect,useState }from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable, AsyncStorage,Alert,FlatList,TextInput
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';

import NavigatorService from '@NavigatorService';

const Cb = () => {
  //setState
  const [state, setState] = useState({
    loading: false,
    id:'',
    name: '',
    phone: '',
    email: '',
    arrayLevel: [],
    teks:''
  })

  let levels = [
    {
      "id": "0Mog2akqeFnnqrnaTffX",
      "value": {
        "backgroundColor": "#CBDFBD",
        "name": "Level 1",
        "final_exam_grammar": "",
        "final_exam_quran": ""
      }
    },
    {
      "id": "3beWNTLbNvxOukt68AvW",
      "value": {
        "name": "Level 2",
        "backgroundColor": "#EE6C4D",
        "final_exam_quran": "https://docs.google.com/forms/d/e/1FAIpQLSeH8_OSGTrBIdDn7oVJpaZ096eHxh6nC1dgmpG2JfVehysuqg/viewform",
        "final_exam_grammar": "https://docs.google.com/forms/d/e/1FAIpQLSdCr_hStx_E-0towbdHQfAzVZZshCUF1WUbCJOVuHY5ucTjaA/viewform"
      }
    },
    {
      "id": "TLlNaSgYzNWah0vwmqvB",
      "value": {
        "name": "Level 3",
        "final_exam_quran": "",
        "backgroundColor": "#D4E09B",
        "final_exam_grammar": ""
      }
    },
    {
      "id": "jFMt2Jnvu5sJpQW8B4Sp",
      "value": {
        "name": "Level 4",
        "final_exam_grammar": "",
        "final_exam_quran": "",
        "backgroundColor": "#CBDFBD"
      }
    },
    {
      "id": "nlchsco96gUD37eMBkIW",
      "value": {
        "final_exam_quran": "",
        "backgroundColor": "#EE6C4D",
        "final_exam_grammar": "",
        "name": "Level 5"
      }
    }
  ]

useEffect(() => {
  setState(state => ({...state, loading: false, arrayLevel: levels }))

}, [])

const login = () => {
  let data = [{
   "id":"09889787",
   "value":
      {"name":"Firman",
      "phone":"werewr",
      "email":"asdads"}

}]

AsyncStorage.setItem('users', JSON.stringify(data[0].id))
  //AsyncStorage.setItem('uid', JSON.stringify(data))
      AsyncStorage.getItem('users').then(res =>{
        let r =JSON.parse(res)
        console.log('data', r);
        setState(state => ({...state,
          name: r
        }))
        alert('arr : '+ state.name)
      }).catch(err =>{
        console.log('err', err)
        alert('err '+ err)
      })

}

const selectMateri = (level, value) => {
    if(level == 'Level 2') {
      let val = JSON.stringify(value)
      let data= JSON.parse(val)
      modalAlert(data)
    } else {
      alert('Document is not available yet')
    }
  }

const PressableMenu = (title, onPress) =>{
      return(
        <View>
        <Pressable style={styles.btn} onPress={() => onPress()}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
        </View>
      )
    }

const modalAlert = (data) => {
  Alert.alert(
    "Pilih Jenis Test",
    "Anda harus menyelesaikan semua test setelah masuk",
    [
      {
        text: "Gramar Test",
        onPress: () => {
          NavigatorService.navigate('Test', {link:data.final_exam_grammar})
          setState(state => ({...state, teks: data.final_exam_grammar }))
        }
      },
      { text: "Final Test", onPress: () => {

        NavigatorService.navigate('Test', {link:data.final_exam_quran})
        setState(state => ({...state, teks: data.final_exam_quran }))
      }}
    ]
  )
}

const validateMail = (text) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(text) === false) {
    alert("Email is Not Correct");
    setState(state => ({...state, email: text }))
    return false;
  }
  else {
    setState(state => ({...state, email: text }))
    alert("Email is Correct");
  }
}
  return(
    <View style={styles.container}>
      <View style={{width: '100%'}}>
          <FlatList
            data={state.arrayLevel}
            renderItem={({item, index}) => {
              return (
                PressableMenu(item.value.name, () => selectMateri(item.value.name, item.value))
              )
            }}
            ListFooterComponent={() => <View style={{height: 24}} />}
          />
        </View>

        <Text>{state.teks}</Text>
        <Pressable onPress={()=> logout()}><Text>POOL</Text></Pressable>
        <View style={{backgroundColor:'#CCC', width: '100%',height: 300, padding: 20}}>
              <TextInput
              style={{width: 200, height: 50, backgroundColor: '#FFF'}}
              keyboardType = 'numeric'
              ></TextInput>

              <TextInput
              style={{width: 200, height: 50, backgroundColor: '#FFF', marginTop:20, borderColor: state.email === '' ? '#000' : null}}
              onChangeText={(text) => validateMail(text)}
              value={state.email}
              ></TextInput>

              <Pressable

               onPress={()=>alert('Butto')}
               style={styles.btn}>
                <Text style={{color:'#FFF', textAlign:'center' }}>LOGIN</Text>
              </Pressable>
        </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: toDp(296),
    height: toDp(437),
    backgroundColor: '#52B788',
    borderRadius: toDp(25)
  },
  background: {
    width: toDp(296),
    height: toDp(437),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'white',
  },
  desc: {
    fontSize: toDp(18),
    fontWeight: 'bold',
    color: 'white',
  },
  buttonGet: {
    width: toDp(165),
    height: toDp(46),
    backgroundColor: '#B7E4C7',
    borderRadius: toDp(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: toDp(-23)
  },
  textGet: {
    fontSize: toDp(20),
    fontWeight: 'bold',
    color: 'black',
  },presableLogin: {
    width: toDp(100),
    height: toDp(34),
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(20),
  },
  btn:{
   width: 200,
   height: 50,
   backgroundColor: 'blue',
   padding: 15,
   marginTop:15,
   borderRadius: 50,
   alignContent:'center',
   alignItems:'center'
 },
});

export default Cb;
