import React, { Component } from 'react'
import {BackHandler, Dimensions, StyleSheet, Text, View, Image, Alert, Platform, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import { allLogo } from '@Assets'
import { toDp } from '@percentageToDP'

let { width, height } = Dimensions.get('window')

class ExamMessage extends Component {

  render() {
    return (
      <View style={styles.container}>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginVertical: 20,
              marginHorizontal: 5
          }}>
              <Text style={{
                  fontSize: 14,
                  color: '#9A9A9A'
              }}>{this.props.title}</Text>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
})


export default ExamMessage
