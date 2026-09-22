import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Pressable
} from "react-native";
import { allLogo } from '@Assets';
import { toDp } from '@percentageToDP';
import Header from '@Header'
import { WebView } from 'react-native-webview';

const Test = (props) => {
  return (
    <View style={styles.container}>
      <Header
        title={'Test'}
        onPress={() => props.navigation.goBack()}
      />
      <WebView
        source={{ uri: props.navigation.state.params.link }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: toDp(30),
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Test;
