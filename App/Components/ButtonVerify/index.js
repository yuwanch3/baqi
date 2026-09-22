import React from 'react';
import {View, Text, Pressable,ActivityIndicator} from 'react-native';
import { useTranslation } from 'react-i18next';
const ButtonVerify = ({activeResend, resendEmail, resendingEmail, resendStatus, timeLeft, targetTime}) => {
  const { t } = useTranslation();
  let notReceivecode = t('common:notReceivecode');

  return(
    <View>
        <Text style={{
                  color: '#000',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 0,
              }}>
              {t('common:notReceivecode')}
          </Text>

          {!resendingEmail && (
            <Pressable disabled={!activeResend} onPress={resendEmail}>
              <Text style={{
                        color: '#000',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        textDecorationLine:'underline',
                    }}>
                    {resendStatus}
              </Text>
            </Pressable>
          )}

          <View style={{flexDirection:'row'}}>
      {resendingEmail && (
        <View style={{alignItems:'center', justifyContent:'center', height:30}}>
            <Pressable disabled={true} >
              <Text style={{
                        color: '#f3f3f3',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,

                    }}>

                      <ActivityIndicator color ={'#FF6C3C'}/>

              </Text>
            </Pressable>
        </View>
        )}

          {!activeResend && (
            <View style={{alignItems:'center', justifyContent:'center', height:30}}>
             <Text style={{
                      color: '#FF6C3C',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 14,
                      marginLeft:10
                  }}>
                  in {timeLeft || targetTime} seconds
              </Text>
            </View>
        )}
        </View>
    </View>
  )
}

export default ButtonVerify;
