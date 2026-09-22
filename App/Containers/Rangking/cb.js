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
  AsyncStorage
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient'
//import { firebase } from '../../Configs/firebase'

import Loader from '@Loader'

const { width, height } = Dimensions.get('window')
const Ranking = (props) => {

  const [state, setState] = useState({
    name: '',
    picture: '',
    activeIndex: 0,
    arrayFriends: [
      {
        images: 'https://images.pexels.com/photos/6668811/pexels-photo-6668811.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'Anton Wijaya',
        message: 'Yess it’s correct :)',
        time: '09:40 AM',
        notif: 8,
        distance: '8 M away'
      }, {
        images: 'https://images.pexels.com/photos/2643905/pexels-photo-2643905.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'Brandon Kusuma',
        message: 'Will be there in 5 minutes!',
        time: '08:00 AM',
        notif: 8,
        distance: '9 M away'
      }, {
        images: 'https://images.pexels.com/photos/7603104/pexels-photo-7603104.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'Cynthia Charlie',
        message: 'See you there soon!',
        time: 'Yesterday',
        notif: 0,
        distance: '10 M away'
      }, {
        images: 'https://images.pexels.com/photos/3697829/pexels-photo-3697829.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'Daniel Hanson',
        message: 'Thank you, please wait.',
        time: 'Yesterday',
        notif: 0,
        distance: '11 M away'
      }, {
        images: 'https://images.pexels.com/photos/7166173/pexels-photo-7166173.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'Edward James',
        message: 'Photo',
        time: 'Sunday',
        notif: 0,
        distance: '12 M away'
      }, {
        images: 'https://images.pexels.com/photos/8192066/pexels-photo-8192066.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'Felicia Wijaya',
        message: 'Photo',
        time: 'Saturday',
        notif: 0,
        distance: '13 M away'
      }, {
        images: 'https://images.pexels.com/photos/8172592/pexels-photo-8172592.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'George Abraham',
        message: 'Thank you very much!',
        time: '2/09/21',
        notif: 0,
        distance: '14 M away'
      }, {
        images: 'https://images.pexels.com/photos/7576388/pexels-photo-7576388.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        name: 'Hannah Ferdinia',
        message: 'Thank you very much!',
        time: '2/08/21',
        notif: 0,
        distance: '15 M away'
      }
    ],
    arrayUsers: [],
    loading: false
  })

  useEffect(() => {
    AsyncStorage.getItem('users').then(response => {
      console.log('response', response);
      let users = JSON.parse(response)
      setState(state => ({...state,
        name: users?.name,
        picture: users?.picture,
      }))
    }).catch(err => {
      console.log('err', err)
    })
    getUsers()
  }, [])

  // const getUsers = () => {
  //   setState(state => ({...state, loading: true }))
  //   firebase.firestore().collection('users').get().then(response => {
  //     let data = response.docs.map(doc => {
  //       return {
  //         id: doc.id,
  //         value: doc.data()
  //       }
  //     })
  //     console.log('data', data);
  //     setState(state => ({...state, loading: false, arrayUsers: data }))
  //   })
  // }

  const renderItemExpore = (item,index) => {
    console.log('item', item);
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
            <Text style={styles.textWork}>{item.item.value.username}</Text>
            <Text style={styles.textDistance}>{item.item.value.email}</Text>
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
            <Text style={styles.textName}>{state.name}</Text>
          </View>

          <View style={styles.viewScore}>
            <Text style={styles.textName}>Score</Text>
            <View style={styles.viewValueScore}>
              <Text style={styles.textNameVal}>2500</Text>
            </View>
          </View>
              <View style={{width: toDp(16)}} />
          <View style={styles.viewScore}>
            <Text style={styles.textName}>Rank</Text>
            <View style={styles.viewValueScore}>
              <Text style={styles.textNameVal}>5</Text>
            </View>
          </View>
        </View>
      </View>

      <Carousel
        layout={"default"}
        data={state.arrayFriends}
        sliderWidth={width}
        itemWidth={toDp(350)}
        renderItem={(item, index) => renderItemExpore(item, index)}
        onSnapToItem = { index => setState(state => ({...state, activeIndex: index})) }
      />

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

export default Ranking;
