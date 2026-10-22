import React, { Component } from 'react'
import {BackHandler, Dimensions, StyleSheet, Text, View, Image, Alert, Platform, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import { allLogo } from '@Assets'
import { toDp } from '@percentageToDP'

let { width, height } = Dimensions.get('window')

class Header extends Component {

  render() {
    const multiline = this.props.multiline;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#52B788', '#52B788']}
            //colors={['white', 'white']}
            style={multiline
              ? [styles.linearHeaderMulti, {justifyContent: 'space-between'}]
              : [styles.linearHeader, {justifyContent: 'space-between'}]}
          >
            { multiline ?
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={styles.touchHeader} onPress={this.props.onPress}>
                  <Image source={allLogo.icArrow} style={styles.icBack} />
                </TouchableOpacity>
                <Text style={styles.titleMulti}>{this.props.title}</Text>
              </View>
            :
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={styles.touchHeader} onPress={this.props.onPress}>
                  <Image source={allLogo.icArrow} style={styles.icBack} />
                </TouchableOpacity>
                <Text style={[styles.title, {fontSize: this.props.title.length >= 28 ? toDp(14) : toDp(20) }]}>{this.props.title}</Text>
              </View>
            }

            {
              this.props.onFilter &&
              <TouchableOpacity
                style={[styles.touchHeader, {marginRight: toDp(8)}]}
                onPress={this.props.onFilter}>
                <Image source={allLogo.icFilter} style={styles.icBack} />
              </TouchableOpacity>
            }

          </LinearGradient>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  header: {
    width,
    //height: 'auto',
    backgroundColor: '#52B788',
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.0,
    elevation: 4,
  },
  linearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: toDp(8),
    height: (height / 12) + (Platform.OS === 'android' ? toDp(0) : toDp(20)) ,
    paddingTop: Platform.OS === 'android' ? toDp(0) : toDp(20)
  },
  // varian khusus judul panjang (dipakai layar ujian): tinggi header mengikuti isi
  linearHeaderMulti: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: toDp(8),
    paddingVertical: toDp(8),
    minHeight: (height / 12) + (Platform.OS === 'android' ? toDp(0) : toDp(20)),
    paddingTop: Platform.OS === 'android' ? toDp(8) : toDp(20)
  },
  touchHeader: {
    padding: toDp(4),
  },
  icBack: {
    marginHorizontal: toDp(8),
    width: toDp(24),
    height: toDp(24),
    resizeMode: 'contain',
    tintColor: 'white',

  },
  title: {
    color: 'white',
    fontSize: toDp(20),
    marginLeft: toDp(8),

  },
  titleMulti: {
    flex: 1,
    color: 'white',
    fontSize: toDp(13),
    lineHeight: toDp(17),
    marginLeft: toDp(8),
    marginRight: toDp(8),
  },
})


export default Header
