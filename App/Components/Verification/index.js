import {Alert, Animated, Image, SafeAreaView, Text, View, Pressable,AsyncStorage} from 'react-native';
import React, {useState, useRef,useEffect} from 'react';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { toDp } from '@percentageToDP';
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './styles';
import { useTranslation } from 'react-i18next';
import { svr } from '../../Configs/apikey';
import axios from 'axios';
import Loader from '@Loader'
import ButtonVerify from '@ButtonVerify';
import NavigatorService from '@NavigatorService'
const {Value, Text: AnimatedText} = Animated;

const CELL_COUNT = 4;
const source = {
  uri:
    'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));

const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const VerificationAnimate = (prop) => {
    const { t } = useTranslation();
    let informasi   =  t('common:informasi');
    let kembali     =  t('common:kembali');
    let oke     =  t('common:oke');
    let hapusAccGagal =  t('common:hapusAccGagal');
    let hapusAccSukses = t('common:hapusAccSukses');
    let codeWrong = t('common:codeWrong');
    let btnVerify = t('common:btnVerify');



    const [value, setValue] = useState('');
    const [resendingEmail, setResendingEmail] = useState(false)

    const [resendStatus, setResendStatus] = useState('Resend');
    const [timeLeft, setTimeLeft] = useState(null);
    const [targetTime, setTargetTime] = useState(null);
    const [activeResend, setActiveResend] = useState(false);
    let resendTimerInterval;
    //
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });
    const [state, setState] = useState({
      timer: false,
      menit: '',
      detik:'',
      loading:false
    })
    //timers
    const [timerCount, setTimer] = useState(60)

    let txt_verivNotice = t('common:txt_konfirmdelacct');
    let txt_codeResend = t('common:txt_codeResend');
    let enterCodev = t('common:enterCodev');


    useEffect(()=>{
      getVerifcode()
      //cleanup the interval on complete
      return () => {
        clearInterval(resendTimerInterval);
      }
    },[])

    const renderCell = ({index, symbol, isFocused}) => {
      const hasValue = Boolean(symbol);
      const animatedCellStyle = {
        backgroundColor: hasValue
          ? animationsScale[index].interpolate({
              inputRange: [0, 1],
              outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
            })
          : animationsColor[index].interpolate({
              inputRange: [0, 1],
              outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
            }),
        borderRadius: animationsScale[index].interpolate({
          inputRange: [0, 1],
          outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
        }),
        transform: [
          {
            scale: animationsScale[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 1],
            }),
          },
        ],
      };

      // Run animation on next event loop tik
      // Because we need first return new style prop and then animate this value
      setTimeout(() => {
        animateCell({hasValue, index, isFocused});
      }, 0);

      return (
        <AnimatedText
          key={index}
          style={[styles.cell, animatedCellStyle]}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </AnimatedText>
      );
    };

    const calculateTimeLeft = (finalTime)=>{
    	const difference = finalTime - +new Date();
      if(difference >=0){
        setTimeLeft(Math.round(difference / 1000));

      }else{
        setTimeLeft(null);
        clearInterval(resendTimerInterval);
        setActiveResend(true);
        setResendingEmail(false)
      }

    }

    const triggerTimer = (targetTimeInSeconds=60)=>{
      setTargetTime(targetTimeInSeconds);
      setActiveResend(false);
      setResendingEmail(true)
      const finalTime = +new Date() + targetTimeInSeconds * 1000;

      resendTimerInterval = setInterval(() => (
        calculateTimeLeft(finalTime),1000
      ));
      console.log(resendTimerInterval);
    }

    const getVerifcode = async() =>{
      setState(state => ({...state, loading: true }))
      let uid = await AsyncStorage.getItem('uid');
      let type = prop.tipe;

            if (state.timer) {
                console.log('Tunggu sebentar');
                setState(state => ({...state, loading: false}))
            } else {
                //call api
                const body = {
                  "uid":uid,
                  "type":type,
                }


                const response = await axios.post(svr.url+'verif/'+svr.api,body);
                if(response.data.status==200){
                    //condition of response
                    console.log('theminutes');
                    setState(state => ({...state, loading: false}))
                    triggerTimer();
                }else{
                    //filed to send code
                    console.log('response.data.status ' + JSON.stringify(response.data));
                    setState(state => ({...state, loading: false }))
                }
                //else condition
            }//end timer condition
    }

    const RequestdeleAccount = async(id,type, code) =>{
      setState(state => ({...state, loading: true }))
       try {
          const body = {
            "uid":id,
            "type": type,
            "code": code
          }

          const response = await axios.post(svr.url+'verif/'+svr.api,body);
          if(response.data.status==200){
              showSuccess(hapusAccSukses);
              setState(state => ({...state, loading: false }))

          }else if(response.data.status==404){
            setState(state => ({...state, loading: false }))
            showAlertone(codeWrong);

          }else{
              setState(state => ({...state, loading: false }))
              showAlertone(hapusAccGagal);

          }

       } catch (e) {
         console.log('Error ' + e);
         setState(state => ({...state, loading: false }))
       }
    }

    const showAlertone = (data) => {
      Alert.alert(
        ""+informasi,
        ""+data,
        [
          {
            text: kembali,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      )
    }

    const showSuccess = (data) => {
      Alert.alert(
        ""+informasi,
        ""+data,
        [
          {
            text: oke,
            onPress: () => {
              setTimeout(function () {
                NavigatorService.reset('Login')
              }, 1000);
            }
          }
        ]
      )
    }

    const Verify = async(code) =>{
      if(code==''){
          showAlertone('Enter Code');
      }else{
          let uid = await AsyncStorage.getItem('uid');
          let type = prop.tipe;

          if(type=='del'){
            RequestdeleAccount(uid, type, code);
          }
      }
    }

  return (
    <SafeAreaView style={styles.root}>
      <Loader loading={state.loading} />
      <Text style={styles.title}>VERIFICATION</Text>
      <Image style={styles.icon} source={source} />
      <Text style={styles.subTitle}>
        {t('common:enterCodev')}
        {t('common:txt_verivNotice')}
      </Text>


      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFiledRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      <Pressable style={styles.nextButton} onPress={()=> Verify(value)}>
        <Text style={styles.nextButtonText}>{t('common:btnVerify')}</Text>
      </Pressable>

      <ButtonVerify
          activeResend={activeResend}
          resendingEmail={resendingEmail}
          resendStatus={resendStatus}
          timeLeft={timeLeft}
          targetTime={targetTime}
          resendEmail={getVerifcode}
      />


    </SafeAreaView>
  );
};

export default VerificationAnimate;
