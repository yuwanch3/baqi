import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable,
  Dimensions,Alert
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import Pdf from 'react-native-pdf';
import NavigatorService from '@NavigatorService'
import Modal from "react-native-modal";
import { useTranslation } from 'react-i18next';

const Read = (props) => {
  const { t }     = useTranslation();
  let informasi   = t('common:informasi');
  let err_unduhV2 = t('common:err_unduhV2');
  let kembali     = t('common:kembali');
  let unduh_sekarang = t('common:unduh_sekarang');

  let informasi_upper = informasi.toUpperCase();

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
     setModalVisible(!isModalVisible);
     BackGo()
  };
  const BackGo=()=>{
    props.navigation.goBack();
  }
  const openLinks = (type, link, value) => {
    if(type === 'unduh'){
      NavigatorService.navigate('Download', {link, value})
    }
  }

  const ModalError = () => {
    return(
      <>
      <Modal style={styles.modal} isVisible={isModalVisible}>
        <View style={styles.ViewModal}>
            <Pressable style={styles.modalClose} onPress={()=> toggleModal()}>
              <Image source={allLogo.icSilang} style={{height:toDp(20),width:toDp(20)}}/>
            </Pressable>
            <View style={{padding:toDp(20)}}>
              <Text style={{fontSize:toDp(20), fontWeight:'bold'}}>{informasi_upper}</Text>
              <View style={{marginTop: toDp(16)}}>
                <Text style={{fontSize:toDp(16)}}>{err_unduhV2}</Text>

              </View>
            </View>
            <View style={styles.modalFooter}>

              <Pressable style={styles.pressMbtn} onPress={()=> BackGo()}>
                  <Text style={{fontWeight:'bold'}}>{kembali}</Text>
              </Pressable>
            </View>
        </View>
      </Modal>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={props.navigation.state.params.value.information}
        onPress={() => props.navigation.goBack()}
      />
      <Pdf
        source={{uri: props.navigation.state.params.link}}
        onError={(error) => {
          setModalVisible(!isModalVisible);
        }}
        style={styles.pdf}
      />
      <View style={styles.viewDownload}>
        <Pressable style={styles.download} onPress={() => openLinks('unduh',props.navigation.state.params.link,props.navigation.state.params.value)}>
          <Text style={styles.textDownload}>{unduh_sekarang}</Text>
        </Pressable>
      </View>
      <ModalError/>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'black',
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  viewDownload: {
    margin: toDp(15),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3
  },
  download: {
    backgroundColor: '#52B788',
    height: toDp(30),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(8),
    zIndex: 4
  },
  textDownload: {
    fontSize: toDp(12),
    fontWeight: 'bold',
    color:'#fff'
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
});

export default Read;
