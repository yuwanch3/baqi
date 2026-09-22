import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Dimensions,
  FlatList,
  TouchableOpacity
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import  Header  from '@Header'
import Modal from "react-native-modal";
import { Card } from "react-native-paper";
import NavigatorService from '@NavigatorService'
import { TextInput } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('window')

const Cb = (props) => {
  const [src, setSrc]=useState(null);

  // const [modalVisible, setModalVisible] = useState(false);

   /*modal*/
   const [isModalVisible, setModalVisible] = useState(false);
   const [modalData, setModaldata] = useState({});
   const [shouldShow, setShouldShow] = useState(false);
   /**/
   const [state, setState] = useState({
     loading: false,
     uid:'',
     DATA: [],
   })
   const DATA = [
     {
       id: '1',
       nama: 'Vatmawati',
       bintang: 'bintang5',
       like: '5',
       komentar: 'Pengiriman sangat cepat, produk masih aman, pembukusan sangat rapih',
       image: 'https://img-9gag-fun.9cache.com/photo/a4QjKv6_700bwp.webp'
     },
     {
       id: '2',
       nama: 'Tiefani Permata',
       bintang: 'bintang5',
       like: '15',
       komentar: 'Pengiriman sangat cepat, produk masih aman, pembukusan sangat rapih',
       image: 'https://img-9gag-fun.9cache.com/photo/a4QjKv6_700bwp.webp'
     },
     {
       id: '3',
       nama: 'Aay Humairoh',
       bintang: 'bintang5',
       like: '20',
       komentar: 'Pengiriman sangat cepat, produk masih aman, pembukusan sangat rapih',
       image: 'https://img-9gag-fun.9cache.com/photo/a4QjKv6_700bwp.webp'
     },
     {
         id: '4',
         nama: 'Hayya Athiyah',
         bintang: 'bintang5',
         like: '5',
         komentar: 'Pengiriman sangat cepat, produk masih aman, pembukusan sangat rapih',
         image: 'https://img-9gag-fun.9cache.com/photo/a4QjKv6_700bwp.webp'
       },
       {
         id: '5',
         nama: 'Budi Setiawan',
         bintang: 'bintang5',
         like: '15',
         komentar: 'Pengiriman sangat cepat, produk masih aman, pembukusan sangat rapih',
         image: 'https://img-9gag-fun.9cache.com/photo/a4QjKv6_700bwp.webp'
       },
       {
         id: '6',
         nama: 'Lili Rahayu',
         bintang: 'bintang5',
         like: '20',
         komentar: 'Pengiriman sangat cepat, produk masih aman, pembukusan sangat rapih',
         image: 'https://img-9gag-fun.9cache.com/photo/a4QjKv6_700bwp.webp'
       },
   ];
   const toggleModal = () => {
      setModalVisible(!isModalVisible);
   };

   const selectMateri = (array) => {
       //if(level == 'Level 2' || level == 'Level 3') {
         let val  = JSON.stringify(array)
         let data = JSON.parse(val)
         setModalVisible(!isModalVisible);
         setModaldata(data)
     //  } else {
     //   alert(val)
     //  }
   }

   const openLink = (id, excerpt, title) => {
       NavigatorService.navigate('FinalExam', {lid:id, excerpt:excerpt, uid:state.uid, title:title})
       setModalVisible(!isModalVisible);
       setModaldata('')

   }

   const modalAlert = (data) => {
    Alert.alert(
      "Pilih Jenis Test",
      "Anda harus menyelesaikan semua test setelah masuk",
      [
        {
          text: "Gramar Test",
          onPress: () => {
            NavigatorService.navigate('FinalExam', {link:data.final_exam_grammar})
          }
        },
        { text: "Final Test", onPress: () => {
          NavigatorService.navigate('FinalExam', {link:data.final_exam_quran})
        }}
      ]
    )
  }

  const title = (text) => {
    let newText = text.substr(0,11);

    return(
      <Text>{newText}</Text>
    )
  }

  const RenderItem = (item, index, onPress) => (
    <Pressable onPress={() => onPress()}>
      <View style={styles.card}>
          <View style={styles.Ulasan}>
             <Image source={{uri: item.image}} style={styles.image} />
             <Text style={styles.nama}>{title(item.nama)}</Text>
          </ View>
          <View style={{flexDirection:'row', margin:toDp(5), bottom:toDp(8), marginLeft:toDp(39)}}>
             <Image source={allLogo.icstar} style={styles.icstar} />
             <Image source={allLogo.icstar} style={styles.icstar} />
             <Image source={allLogo.icstar} style={styles.icstar} />
             <Image source={allLogo.icstar} style={styles.icstar} />
             <Image source={allLogo.icstar} style={styles.icstar} />
          </View>
          <Text style={styles.txtKomen}>Pipa sesuai dengan foto, kualitas pipa sangat bagus, tapi pengiriman barang sangat lama, pesan tgl 1  dan barang sampai tgl 8 . .</Text>
      </ View>
    </Pressable>
  );

  const CardProduct = () =>{
    return(
      <FlatList style={{ minHeight:400, width:width, marginTop:10, marginBottom:toDp(45)}}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            marginTop: toDp(3),
            paddingBottom: toDp(3),

          }}

          numColumns={1}
          data={DATA}
            renderItem={({item, index}) => {
              return (
                RenderItem(item, index, () => selectMateri(item))
              )
            }}
          ListFooterComponent={() => <View style={{height: toDp(100)}} />}
        />
    )
  }


  return (
    <View style={styles.container}>

        <Header
          title={'Ulasan'}
          onPress={() => props.navigation.goBack()}
        />

          {/*modal*/}
          <Modal style={styles.modal} isVisible={isModalVisible}>
          <View style={styles.ViewModal}>
              <Pressable style={styles.modalClose} onPress={()=> toggleModal()}>
                <Image source={allLogo.icSilang} style={{height:toDp(20),width:toDp(20)}}/>
              </Pressable>
              <View style={{padding:toDp(20)}}>
                <Text style={{fontSize:toDp(20), fontWeight:'bold'}}>PILIH JENIS UJIAN</Text>
                <View style={{marginTop: toDp(16)}}>
                  <Text style={{fontSize:toDp(16)}}>{modalData.id}</Text>
                  <Text style={{fontSize:toDp(16)}}>{modalData.nama}</Text>
                  <Text style={{fontSize:toDp(16)}}>{modalData.bintang}</Text>
                </View>
              </View>
              <View style={styles.modalFooter}>
                <Pressable style={[styles.pressMbtn, {borderRightWidth:1, borderRightColor:'#ccc'}]} onPress={()=> openLink(modalData.id, 'Grammer Test', modalData.value.name) }>
                    <Text style={{fontWeight:'bold'}}>GRAMMER TEST</Text>
                </Pressable>
                <Pressable style={styles.pressMbtn} onPress={()=> openLink(modalData.id, 'Final Test', modalData.value.name) }>
                    <Text style={{fontWeight:'bold'}}>FINAL TEST</Text>
                </Pressable>
              </View>
          </View>
        </Modal>
        {/*end modal*/}


        <View style={{bottom:0}}>
            <CardProduct/>
        </View>



    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: toDp(15),
    marginVertical: toDp(5),
    marginHorizontal: toDp(16),
    borderRadius:toDp(10),
    height: toDp(150),
    right: toDp(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  Ulasan: {
    // backgroundColor:'cyan',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  image:{
    width: toDp(30),
    height:toDp(30),
    borderRadius:toDp(10)
  },
  iclike: {
    width: toDp(24),
    height:toDp(20),
  },
  icmore: {
    width: toDp(24),
    height:toDp(24),
  },
  icmore1: {
    width: toDp(24),
    height:toDp(24),
    bottom:9,
    right:10
  },
  nama: {
      marginRight:toDp(160)
  },
  txtKomen: {
    marginLeft:toDp(39),
    bottom:toDp(5)
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    top:toDp(5)
  },
  buttonOpen: {
    // backgroundColor: "#F194FF",
    width:toDp(25),
    height:toDp(25)
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
    content: {
    width: '100%',
    alignItems: 'center'
  },
  modal:{
    marginVertical:'50%',
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
  viewCenterAbsolute: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  logo: {
    width: toDp(256),
    height: toDp(270),
    resizeMode: 'contain'
  },
  icMateri: {
    width: toDp(39),
    height: toDp(52),
    resizeMode: 'contain',
    marginLeft: toDp(24),
    marginTop: toDp(6)
  },
  presableMenu: {
    width: '90%',
    marginLeft: toDp(16),
    height: toDp(66),
    borderRadius: toDp(25),
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    flexDirection: 'row',
    marginTop: toDp(16)
  },
  viewText: {
    width: '60%',
    marginLeft: toDp(18),
    justifyContent: 'center',
  },
  title: {
    fontSize: toDp(20),
    height: toDp(30),
    fontWeight: '500',
    color: 'white',
    width: '100%',
    textAlign: 'center',
    marginTop: toDp(4)
  },

});

export default Cb;
