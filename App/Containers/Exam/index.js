import React, { useState,useEffect } from 'react'
import { View, Text,StyleSheet, SafeAreaView, StatusBar, Image,TouchableOpacity, Modal, Alert,Animated,Dimensions,Pressable, ScrollView,FlatList,AsyncStorage,BackHandler} from 'react-native'
import { COLORS, SIZES } from '../../Components/Theme';
import data from '../cb/soal.js';
import Header from '@Header';
import Modals from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigatorService from '@NavigatorService';
import { DraxProvider, DraxView, DraxList,DraxSnapbackTargetPreset,DraxViewDragStatus } from 'react-native-drax';
const width = Dimensions.get('window').width / 2 - 30;
const widthMt = Dimensions.get('window').width-68;
import { toDp } from '@percentageToDP';
import { allLogo } from '@Assets';
import Loader from '@Loader';
import ExamMessage from '@ExamMessage';
import {svr} from '../../Configs/apikey'
import axios from 'axios'
import translate from 'translate-google-api';
import { useTranslation } from 'react-i18next';

const Exam = (props) => {
   //Dari Materi
   const { t }   = useTranslation();
   let lang      =  t('common:lang');
   let informasi     =  t('common:informasi');
   let konfirmasi    =  t('common:konfirmasi');
   let alt_ujianOut  =  t('common:alt_ujianOut');
   let batal      =  t('common:batal');
   let yakin      =  t('common:yakin');
   let err_500    =  t('common:err_500');
   let dataNull   =  t('common:dataNull');
   let err_trima  =  t('common:err_trima');
   let err_konek  =  t('common:err_konek');
   let err_data500Nr  =  t('common:err_data500Nr');
   let lanjut         =  t('common:lanjut');
   let kembali        =  t('common:kembali');
   let inf_ujianDone  =  t('common:inf_ujianDone');
   let inf_ujianNull  =  t('common:inf_ujianNull');
   let oke       =  t('common:oke');
   let cobalagi  =  t('common:cobalagi');
   let selamat   =  t('common:selamat');
   let inf_endText =  t('common:inf_endText');
   let err_data404Grp =  t('common:err_data404Grp');
   let err_savingData =  t('common:err_savingData');

   const [langTo,setTo]=useState('');
   const [nowlang,setNow]=useState('');
    //const allQuestions = data;
    const [state, setState]= useState({
        arraSoal:[],
        loading: false,
        id:'',
        lastestId:'',
        lastData:[]
    })

    const [isModalVisible, setModalVisible] = useState(false);
    const [iduser, setIDU] = useState('');
    const [done, setDone] = useState(false);
    const [mid, setMid] = useState(null);
    const [panjang, setPjg] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [typeQuestion, setTypeQuestion] = useState(null);
    const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [wrscore, setWscore] = useState(0);
    const [lastestnumber, setLasnum] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false)
    const [showScoreModal, setShowScoreModal] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);
    const [multiLength, setLeng] = useState(0);
    var answerDrg = [];
    const [aswDRG,setDRG] = useState([]);
    const [selectedDrags, setSelectedDrags] = useState([]);
    const [restartNum, setRestarNum] = useState(false);
    const [wrongTemp, setWrongtemp] = useState(0);
    const [correctTemp, setCorrecttemp] = useState(0);
    const [updatType, setUpdateType] = useState('');

    useEffect(() => {
      if(lang=='en'){
        setTo('en')
        setNow('id')
        console.log('s-->' +langTo +'|'+nowlang);
      }
        setState(state => ({...state,
          id: props.navigation.state.params.uid
        }))
        //setState(state => ({...state, arraSoal: data }))
        getLastest();
    }, [])

    useEffect(() => {
        return () =>{
          AsyncStorage.getItem('current').then(last =>{
            let curentIndex = last;
            if(last=='0' || last ==0){
              setCurrentQuestionIndex(0)
              console.log('last === 0');
            }else{
              const necur = (( (curentIndex*1)+0) );
              setCurrentQuestionIndex(necur)
              Animated.timing(progress, {
                  toValue: curentIndex,
                  duration: 1000,
                  useNativeDriver: false
              }).start();
            }
          });
          AsyncStorage.getItem('wrong').then(w =>{
            let currentWrong = w;
            if(w=='0' || w ==0){
              setWrongtemp(0)

            }else{
              const newcur = (( (currentWrong*1)+0) );
              console.log('w === '+newcur);
              setWrongtemp(newcur)
            }
          });
          AsyncStorage.getItem('correct').then(c =>{
            let currentCorrect = c;
            if(c=='0' || c==0){
              setCorrecttemp(0)
            }else{
              const newcor = (( (currentCorrect*1)+0) );
              console.log('c === '+newcor);
              setCorrecttemp(newcor)
            }
          });
        }
        return()=>{
            try {
              AsyncStorage.removeItem('current');
              AsyncStorage.removeItem('wrong');
              AsyncStorage.removeItem('correct');
              return true;
            } catch (e) {
              console.log('Can'+'t deleta');
            }
        }
    }, [lastestnumber])

    useEffect(()=>{
      const backAction = () => {
          Alert.alert(konfirmasi, alt_ujianOut, [
            {
              text: batal,
              onPress: () => null,
              style: "cancel"
            },
            { text: yakin, onPress: () => BackGo() }
          ]);
          return true;

      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    },[])

    const toUpper = (i)=>{
      let result = i.toUpperCase();
      return result;
    }

    const showAlert = (data) => {
      Alert.alert(
        ""+informasi,
        ""+data,
        [
          {
            text: oke,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
        ]
      )
    }

    const showAlertone = (data) => {
      Alert.alert(
        ""+informasi,
        ""+data,
        [
          {
            text: batal,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      )
    }

    const trans = (val, from, to)=>{
       let data=''
      const [r, setR]=useState('');
      translate(val, {from: from, to: to})
      .then(res => {
             setR(res)
             data = r
      })
      return r
    }

    const toggleModal = () => {
       setModalVisible(!isModalVisible);
    };

    const resetAsync = () =>{
      try {
        AsyncStorage.removeItem('current');
        AsyncStorage.removeItem('wrong');
        AsyncStorage.removeItem('correct');
        return true;
      } catch (e) {
        console.log('Can'+'t deleta');
      }
    }

    const getScore = () => {
      const uids = props.navigation.state.params.uid;
      const mids = props.navigation.state.params.value;
      const excerpt  = props.navigation.state.params.val;
      const lid     = props.navigation.state.params.lid;
      const sublid  = props.navigation.state.params.sublid;

      setMid(props.navigation.state.params.value);
      setState(state => ({...state, loading: true }))
      axios.get(svr.url+'skor/getmid/'+uids+'/'+mids+'/'+excerpt+'/'+svr.api)
      .then(result=>{
        console.log(JSON.stringify(result));
          if(result.data.status==200){
            setState(state => ({...state, loading: false }))
            toggleModal()

          }else if(result.data.status==404){
            if(done===false) {

              getSoal();
              //console.log('get soal');
            }
            setState(state => ({...state, loading: false }))
          }else if(result.data.status==500){
            showAlertone(err_500);
            setState(state => ({...state, loading: false }))
          }

      }).catch(err=>{
        showAlertone('Tidak dapat memuat data!')
        setState(state => ({...state, loading: false }))
      })

    }

    const getLastest = () => {
      const uids = props.navigation.state.params.uid;
      const mids = props.navigation.state.params.value;
      const excerpt  = props.navigation.state.params.val;
      const lid     = props.navigation.state.params.lid;
      const sublid  = props.navigation.state.params.sublid;
      setState(state => ({...state, loading: true }))
      axios.get(svr.url+'lastest/get/'+mids+'/'+uids+'/'+excerpt+'/'+svr.api)
      .then(result=>{
        //console.log("=======> "+JSON.stringify(result.data.status));

          if(result.data.status==200){
            //jika ada ambil id
            let data = {
                  id: result.data.value[0].id,
                  value: result.data.value
            }

            setState(state => ({...state, loading: false }))
            setState(state => ({...state, lastestId: data.id }))
            setState(state => ({...state, lastData: data}))
            AsyncStorage.setItem('lastestId', data.id);
            AsyncStorage.setItem('current', data.value[0].current);
            AsyncStorage.setItem('wrong', data.value[0].wrong);
            AsyncStorage.setItem('correct',data.value[0].correct);
            setLasnum(data.value[0].current);
            getScore()
            //console.log('===========> adad' + uids);

          }else if(result.data.status==404){
            //insert
            insertLastest()
            //console.log('===========> insert'+ uids);
            setState(state => ({...state, loading: false }))
          }else if(result.data.status==500){
            showAlertone(err_500);
            setState(state => ({...state, loading: false }))
          }
      }).catch(err=>{
        showAlertone(dataNull)
        setState(state => ({...state, loading: false }))
      })

    }

    const getSoal = () => {
          let idm = props.navigation.state.params.value;
          setState(state => ({...state, loading: true }))
          console.log(svr.url+'questions/mid/'+idm+'/'+svr.api);
          axios.get(svr.url+'questions/mid/'+idm+'/'+svr.api)
          .then(result=>{
            //console.log('-------->'+JSON.stringify(result.data));
            if(result.data.length>0){
                let data = result.data.map(doc => {
                  return {
                    id: doc.id,
                    value: doc.value
                  }
                })

                // Acak urutan soal supaya tipe soal (option/multi/yesorno/drag)
                // tercampur acak, tidak beruntun berdasarkan urutan di database.
                for (let i = data.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [data[i], data[j]] = [data[j], data[i]];
                }

                setState(state => ({...state, arraSoal: data }))
                setState(state => ({...state, loading: false }))
            }else{
                //console.log("Tidak ada data!");
                setState(state => ({...state, loading: false }))
                AsyncStorage.getItem('lastestId').then(l =>{
                  let lastestId = l;
                  console.log(lastestId+'<-------------');
                  deleteLastest(lastestId)
                });
            }

            if(result.data.status==404){
              AsyncStorage.getItem('lastestId').then(l =>{
                let lastestId = l;
                deleteLastest(lastestId)
              });

            }


          }).catch(err=>{
            showAlertone(err_trima)
            setState(state => ({...state, loading: false }))
          })

  }

    const insertLastest = () =>{
      const uids = props.navigation.state.params.uid;
      const mids = props.navigation.state.params.value;
      const excerpt  = props.navigation.state.params.val;
      const lid     = props.navigation.state.params.lid;
      const sublid  = props.navigation.state.params.sublid;
        let body = {
         uid: uids,
         mid: mids,
         lid: lid,
         sublid: sublid,
         total: 0,
         excerpt: excerpt,
         correct: 0,
         wrong: 0,
         current:0,
         status:''
       }

        axios.post(svr.url+'lastest/'+svr.api+'/', body)
        .then(result =>{

            if(result.data.status==201){
              //console.log('=================>sukses' + JSON.stringify(result.data.last_id));
              setState(state => ({...state, lastestId: result.data.last_id }))
              getScore();
            }else if(result.data.status==500){
              showAlertone(err_data500Nr)
            }
        }).catch(err =>{
          console.log(err)
          showAlertone(err_konek)
        })
    }

    const updateLastest = (lastestId, wrscore, score) =>{
      const uids = props.navigation.state.params.uid;
      const mids = props.navigation.state.params.value;
      const excerpt  = props.navigation.state.params.val;
      const lid     = props.navigation.state.params.lid;
      const sublid  = props.navigation.state.params.sublid;
      let wrongAnswer  = wrscore;
      let correct_answ = score;
      let currentNow   = currentQuestionIndex+1;
      if(wrongTemp!=0 || correctTemp!=0){
         wrongAnswer  = wrscore+wrongTemp;
         correct_answ = score+correctTemp;
      }
      if(allQuestions.length==currentQuestionIndex){
        currentNow = currentQuestionIndex;
      }
      console.log('salah ====== > '+wrongAnswer+'  benar :'+correct_answ);
        let body = {
         uid: uids,
         mid: mids,
         lid: lid,
         sublid: sublid,
         total: allQuestions.length,
         excerpt: excerpt,
         correct: correct_answ,
         wrong: wrongAnswer,
         current: currentNow,
         status:''
       }

        axios.post(svr.url+'lastest/'+lastestId+'/'+svr.api+'/', body)
        .then(result =>{
           //console.log("=================>"+ JSON.stringify(result));
            if(result.data.status==200){
              //alert('Yees')
            }else if(result.data.status==500){
              showAlertone(showAlertone)
            }
        }).catch(err =>{
          console.log(err)
          showAlertone(err_konek)
        })
    }

    const resetLastest = (lastestId) =>{
      const uids = props.navigation.state.params.uid;
      const mids = props.navigation.state.params.value;
      const excerpt  = props.navigation.state.params.val;
      const lid     = props.navigation.state.params.lid;
      const sublid  = props.navigation.state.params.sublid;
      let wrongAnswer = wrscore;

        let body = {
         uid: uids,
         mid: mids,
         lid: lid,
         sublid: sublid,
         total: 0,
         excerpt: excerpt,
         correct: 0,
         wrong: 0,
         current: 0,
         status:''
       }
      //console.log('lastest ====== > '+lastestId);
        axios.post(svr.url+'lastest/'+lastestId+'/'+svr.api+'/', body)
        .then(result =>{
           //console.log("=================>"+ JSON.stringify(result));
            if(result.data.status==200){
              //alert('Yees')
            }else if(result.data.status==500){
              showAlertone(err_data500Nr)
            }
        }).catch(err =>{
          console.log(err)
          showAlertone(err_konek)
        })
    }

    const deleteLastest = (lastestId) =>{
      axios.delete(svr.url+'lastest/del/'+lastestId+'/'+svr.api)
      .then(result =>{
         //console.log("=================>"+ JSON.stringify(result));
          if(result.data.status==200){
            //alert('Yees')
            console.log('deletedd!')
          }else if(result.data.status==500){
            console.log('Fiailed remove')
          }
      }).catch(err =>{
        console.log(err)
        console.log('Tidak dapat terhubung ke server!')
      })
    }

    const handleNext = () => {
        if(currentQuestionIndex== allQuestions.length-1){
            // Last Question
            // Show Score Modal
            setDone(true);
            setShowScoreModal(true);
        }else{
            setCurrentQuestionIndex(currentQuestionIndex+1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
            updateLastest(state.lastestId, wrscore, score);
        }
        Animated.timing(progress, {
            toValue: currentQuestionIndex+1,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    const handleNextDM = (w, s) => {
        if(currentQuestionIndex== allQuestions.length-1){
            // Last Question
            // Show Score Modal
            setDone(true);
            setShowScoreModal(true);
        }else{
            setCurrentQuestionIndex(currentQuestionIndex+1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
            updateLastest(state.lastestId, w, s);
        }
        Animated.timing(progress, {
            toValue: currentQuestionIndex+1,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    const BackGo = () =>{
      props.navigation.goBack();
    }

    const Oke = () =>{
      setShowScoreModal(false);
      if(done==true){
        pushScore()
        updateLastest(state.lastestId,  wrscore, score)
      }
    }

    const pushScore = () => {
      let wrongAnswer  = wrscore;
      let correct_answ = score;
      if(wrongTemp!=0 || correctTemp!=0){
         wrongAnswer  = wrscore+wrongTemp;
         correct_answ = score+correctTemp;
      }
      let excerpts    = props.navigation.state.params.val;
      let body = {
       uid: state.id,
       mid: mid,
       skor: correct_answ,
       excerpt: excerpts,
       correct: correct_answ,
       wrong: wrongAnswer,
     }
     console.log(JSON.stringify(body));
      setState(state => ({...state, loading: true }))
      axios.post(svr.url+'skor/'+svr.api+'/', body)
      .then(result =>{

          if(result.data.status==201){
            props.navigation.goBack();
            setState(state => ({...state, loading: false }))

          }else if(result.data.status==500){
            showAlert(err_data500Nr)
            props.navigation.goBack();
            setState(state => ({...state, loading: false }))
          }else if(result.data.status==404){
            console.log(JSON.stringify(result.data));
            //masuk ke grup
            showAlert(err_data404Grp)
            setState(state => ({...state, loading: false }))
          }else if(result.data.status==400){
            console.log(JSON.stringify(result.data));
            //grup tidak terdeteksi
            showAlert(err_savingData)
            setState(state => ({...state, loading: false }))
          }
      }).catch(err =>{
        console.log(err)
        showAlertone(err_konek)
        setState(state => ({...state, loading: false }))
      })

    }

    const allQuestions = state.arraSoal;

    //this lang
    const validateAnswer = (selectedOption) => {
       let correct_option='';
        if(lang=='id'){
            correct_option = allQuestions[currentQuestionIndex]?.value['correct_option'];
        }else if(lang=='en'){
            correct_option = allQuestions[currentQuestionIndex]?.value['correct_option_en'];
        }
        setCurrentOptionSelected(selectedOption);
        setCorrectOption(correct_option);
        setIsOptionsDisabled(true);
        if(selectedOption==correct_option){
            // Set Score
            setScore(score+1)
        }else{
            setWscore(wrscore+1)
        }
        // Show Next Button

        setShowNextButton(true)
    }

    const restartQuiz = () => {
        resetAsync()
        resetLastest(state.lastestId)
        setShowScoreModal(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setDone(false);
        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
        setShowNextButton(false);
        setLasnum(0);
        setWscore(0);
        setRestarNum(false);
        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }
//Basic Option-------------------------------------------------------------------------------
    const renderQuestion = () => {
        return (
            <View style={{marginVertical: toDp(40)}}>
                {/* Question Counter */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: toDp(7)
                }}>
                    <Text style={{color: '#000', fontSize: toDp(20), opacity: 0.6, marginRight: 2}}>{currentQuestionIndex+1}</Text>
                    <Text style={{color: '#000', fontSize: toDp(18), opacity: 0.6}}>/ {allQuestions.length}</Text>
                </View>
                <View style={{
                  width: '100%',
                  justifyContent: 'center'
                }}>
                {
                  allQuestions[currentQuestionIndex]?.value.image === '' ?
                    <Text></Text>
                  :
                    <Image source={{uri : allQuestions[currentQuestionIndex]?.value.image}} style={{width:'100%', height: toDp(180)}}/>

                }

                </View>
                {/* Question */}

                <View style={{alignItems:'center'}}>
                  <Text style={{
                      marginTop: toDp(16),
                      color: '#000',
                      fontSize: toDp(20)
                  }}>
                  {lang=='id' &&
                      allQuestions[currentQuestionIndex]?.value?.question
                  }

                  {lang=='en' &&
                      allQuestions[currentQuestionIndex]?.value?.question_en
                  }
                  </Text>
                </View>

            </View>
        )
    }

    const renderOptions = () => {
        return (
            <View>
                {
                    allQuestions[currentQuestionIndex]?.value.options.map((option, index)=> (
                        <TouchableOpacity
                        onPress={()=> validateAnswer(option)}
                        disabled={isOptionsDisabled}
                        key={index}
                        style={{
                            borderWidth: toDp(3),
                            borderColor:
                            option==correctOption
                              ? COLORS.success
                            : option==currentOptionSelected
                              ? COLORS.error
                            : '#FFF',
                            backgroundColor: option==currentOptionSelected
                            ? '#8F0000'
                            : option==correctOption
                            ? '#01880F'
                            : generateBackgroundColor(index),
                            height: toDp(60), borderRadius: toDp(30), overflow: 'hidden',
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between',
                            paddingHorizontal: toDp(20),
                            marginVertical: toDp(10)
                        }}
                        >

                            <Text style={{fontSize: toDp(16), color: COLORS.white, width:'94%'}}>{generateAbc(index)+' '+option}</Text>

                            {/* cek jawaban benar */}
                            {
                                option==correctOption ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.success,
                                        justifyContent: 'center', alignItems: 'center', zIndex:2, position:'absolute', right: 0, marginRight:toDp(10)
                                    }}>
                                        <View style={{
                                            color: COLORS.white,
                                            fontSize: toDp(20)
                                        }}>
                                            <Image source={allLogo.ck_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                        </View>
                                    </View>
                                ): option == currentOptionSelected ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.error,
                                        justifyContent: 'center', alignItems: 'center', zIndex:2, position:'absolute', right: 0, marginRight:toDp(10)
                                    }}>
                                    <View style={{
                                        color: COLORS.white,
                                        fontSize: toDp(20)
                                    }}>
                                        <Image source={allLogo.cl_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                    </View>
                                    </View>
                                ) : null
                            }

                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }

    //en version
    const renderOptions_en = () => {
        return (
            <View>
                {
                    allQuestions[currentQuestionIndex]?.value.options_en.map((option, index)=> (
                        <TouchableOpacity
                        onPress={()=> validateAnswer(option)}
                        disabled={isOptionsDisabled}
                        key={index}
                        style={{
                            borderWidth: toDp(3),
                            borderColor:
                            option==correctOption
                              ? COLORS.success
                            : option==currentOptionSelected
                              ? COLORS.error
                            : '#FFF',
                            backgroundColor: option==currentOptionSelected
                            ? '#8F0000'
                            : option==correctOption
                            ? '#01880F'
                            : generateBackgroundColor(index),
                            height: toDp(60), borderRadius: toDp(30), overflow: 'hidden',
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between',
                            paddingHorizontal: toDp(20),
                            marginVertical: toDp(10)
                        }}
                        >

                            <Text style={{fontSize: toDp(16), color: COLORS.white, width:'94%'}}>{generateAbc(index)+' '+option}</Text>

                            {/* cek jawaban benar */}
                            {
                                option==correctOption ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.success,
                                        justifyContent: 'center', alignItems: 'center', zIndex:2, position:'absolute', right: 0, marginRight:toDp(10)
                                    }}>
                                        <View style={{
                                            color: COLORS.white,
                                            fontSize: toDp(20)
                                        }}>
                                            <Image source={allLogo.ck_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                        </View>
                                    </View>
                                ): option == currentOptionSelected ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.error,
                                        justifyContent: 'center', alignItems: 'center', zIndex:2, position:'absolute', right: 0, marginRight:toDp(10)
                                    }}>
                                    <View style={{
                                        color: COLORS.white,
                                        fontSize: toDp(20)
                                    }}>
                                        <Image source={allLogo.cl_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                    </View>
                                    </View>
                                ) : null
                            }

                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }
//Basic Option------------------------------------------------END----------------------------

//Image Option-------------------------------------------------------------------------------
    const RenderImageOptions = (option, index) => {
        return (
          <View style={styles.card}>
            <View>
                        <TouchableOpacity
                        onPress={()=> validateAnswer(option)}
                        disabled={isOptionsDisabled}
                        key={index}
                        style={{
                            borderWidth: 3,
                            borderColor:
                            option==correctOption
                              ? COLORS.success
                            : option==currentOptionSelected
                              ? COLORS.error
                            : '#FFF',
                            backgroundColor: generateBackgroundColor(index)
                            ? '#FFF'
                            : option==currentOptionSelected
                            ? COLORS.error +'50'
                            : COLORS.secondary+'20',
                            height: toDp(100), borderRadius: toDp(10),
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between',
                            marginVertical: toDp(10)
                        }}
                        >
                     <Image source={{uri:option}} style={{width:toDp(100), height: toDp(100)}}></Image>
                            {/* Show Check Or Cross Icon based on correct answer*/}
                            {
                                option==correctOption ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: '#3def43', right:toDp(8),
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <View  style={{
                                            color: '#FFF',
                                            fontSize: toDp(20)
                                        }}>
                                              <Image source={allLogo.ck_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                        </View>
                                    </View>
                                ): option == currentOptionSelected ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: 'red', right:toDp(8),
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <View  style={{
                                            color: '#FFF',
                                            fontSize: toDp(20)
                                        }}>
                                              <Image source={allLogo.cl_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                        </View>
                                    </View>
                                ) : null
                            }
                        </TouchableOpacity>

            </View>
          </View>
        )
    }

    const ImgList = () =>{
      return(
        <FlatList
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: toDp(10),
              paddingBottom: toDp(50),
            }}

            numColumns={2}
            data={allQuestions[currentQuestionIndex]?.value.options}

              renderItem={({item, index}) => {
                return (
                  RenderImageOptions(item, index)
                )
              }}
          />
      )
    }

    const ImgListEN = () =>{
      return(
        <FlatList
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: toDp(10),
              paddingBottom: toDp(50),
            }}

            numColumns={2}
            data={allQuestions[currentQuestionIndex]?.value.options_en}

              renderItem={({item, index}) => {
                return (
                  RenderImageOptions(item, index)
                )
              }}
          />
      )
    }
//Image Option------------------------------------------------END-----------------------------

//Yes/No Option-------------------------------------------------------------------------------
    const renderYesnoOptions = () => {
        return (
            <View style={styles.vrow}>
                {
                    allQuestions[currentQuestionIndex]?.value.options.map((option, index)=> (
                        <TouchableOpacity
                        onPress={()=> validateAnswer(option)}
                        disabled={isOptionsDisabled}
                        key={index}
                        style={{
                            borderWidth: toDp(3),
                            borderColor:
                            option==correctOption
                              ? COLORS.success
                            : option==currentOptionSelected
                              ? COLORS.error
                            : '#FFF',
                            backgroundColor: '#FFF'
                            ? '#f3f3f3'
                            : option==currentOptionSelected
                            ? COLORS.error +'50'
                            : COLORS.secondary+'20',
                            height: toDp(70), borderRadius: toDp(35), overflow: 'hidden',
                            width:'47%',
                            flexDirection:'row',
                            alignItems:'center',
                            paddingHorizontal: toDp(20),
                            marginVertical: toDp(10)
                        }}
                        >

                            <Image
                              source={option=='Yes'
                            ? allLogo.icCheck
                            : allLogo.icClose}
                              style={styles.imgYesno} />

                            {/* cek jawaban benar */}
                            {
                                option==correctOption ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.success,right:toDp(10),position:'absolute',
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <View style={{
                                            color: COLORS.white,
                                            fontSize: 20
                                        }}>
                                            <Image source={allLogo.ck_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                        </View>
                                    </View>
                                ): option == currentOptionSelected ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.error,right:toDp(10),position:'absolute',
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <View style={{
                                        color: COLORS.white,
                                        fontSize: toDp(20)
                                    }}>
                                        <Image source={allLogo.cl_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                    </View>
                                    </View>
                                ) : null
                            }

                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }

    const renderYesnoOptions_en = () => {
        return (
            <View style={styles.vrow}>
                {
                    allQuestions[currentQuestionIndex]?.value.options_en.map((option, index)=> (
                        <TouchableOpacity
                        onPress={()=> validateAnswer(option)}
                        disabled={isOptionsDisabled}
                        key={index}
                        style={{
                            borderWidth: toDp(3),
                            borderColor:
                            option==correctOption
                              ? COLORS.success
                            : option==currentOptionSelected
                              ? COLORS.error
                            : '#FFF',
                            backgroundColor: '#FFF'
                            ? '#f3f3f3'
                            : option==currentOptionSelected
                            ? COLORS.error +'50'
                            : COLORS.secondary+'20',
                            height: toDp(70), borderRadius: toDp(35), overflow: 'hidden',
                            width:'47%',
                            flexDirection:'row',
                            alignItems:'center',
                            paddingHorizontal: toDp(20),
                            marginVertical: toDp(10)
                        }}
                        >

                            <Image
                              source={option=='Yes'
                            ? allLogo.icCheck
                            : allLogo.icClose}
                              style={styles.imgYesno} />

                            {/* cek jawaban benar */}
                            {
                                option==correctOption ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.success,right:toDp(10),position:'absolute',
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <View style={{
                                            color: COLORS.white,
                                            fontSize: 20
                                        }}>
                                            <Image source={allLogo.ck_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                        </View>
                                    </View>
                                ): option == currentOptionSelected ? (
                                    <View style={{
                                        width: toDp(30), height: toDp(30), borderRadius: 30/2,
                                        backgroundColor: COLORS.error,right:toDp(10),position:'absolute',
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <View style={{
                                        color: COLORS.white,
                                        fontSize: toDp(20)
                                    }}>
                                        <Image source={allLogo.cl_ex} style={{width:toDp(10), height:toDp(10)}}/>
                                    </View>
                                    </View>
                                ) : null
                            }

                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }
//Yes/No Option-----------------------------------------------END-----------------------------

//Multiselected-------------------------------------------------------------------------------v
    // Memberikan aksi pada multi select
    const handleOnPress = contact => {
        if (selectedItems.length) {
          return selectItems(contact);
        }
        // here you can add you code what do you want if user just do single tap
        console.log('pressed');
      };

    const getSelected = contact => selectedItems.includes(contact);

    const deSelectItems = () => {setSelectedItems([]);}

    const selectItems = item => {
        if (selectedItems.includes(item)) {
          const newListItems = selectedItems.filter(
            listItem => listItem !== item,
          );
          setShowNextButton(false)
          return setSelectedItems(newListItems);
        }
        if(lang=='id'){
            if(selectedItems.length <= allQuestions[currentQuestionIndex]?.value.correct_option.length-1){
              setSelectedItems([...selectedItems, item]);

            }
            if(selectedItems.length === allQuestions[currentQuestionIndex]?.value.correct_option.length-1){
                setShowNextButton(true)
            }

        }else if(lang=='en'){

            if(selectedItems.length <= allQuestions[currentQuestionIndex]?.value.correct_option_en.length-1){
              setSelectedItems([...selectedItems, item]);

            }
            if(selectedItems.length === allQuestions[currentQuestionIndex]?.value.correct_option_en.length-1){
                setShowNextButton(true)
            }
        }
    };

    const RenderMultiCheck = ({item, selected, onPress, onLongPress, option, index}) => {
      return (
        <View>
                  <TouchableOpacity
                    onPress={onPress}
                    disabled={isOptionsDisabled}
                    key={index}
                    style={{
                        borderWidth: 3,
                        borderColor:
                        option==correctOption
                          ? 'green'
                        : option==currentOptionSelected
                          ? 'red'
                        : '#FFF',
                        backgroundColor: '#FFF'
                        ? '#05A6CA'
                        : selected
                        ? 'red' +'50'
                        : '#CCC'+'20',
                        height: 60, borderRadius: 30, overflow: 'hidden',
                        flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        marginVertical: 10
                    }}
                    >
                        <Text style={{fontSize: 20, color: '#fff'}}>{generateAbc(index)+option}</Text>

                        {/* cek jawaban benar */}
                        {
                            option==correctOption ? (
                                <View style={{
                                    width: 30, height: 30, borderRadius: 30/2,
                                    backgroundColor: 'green',
                                    justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <View style={{
                                        color: '#FFF',
                                        fontSize: 20
                                    }}>

                                    </View>
                                </View>
                            ): option == currentOptionSelected ? (
                                <View style={{
                                    width: 30, height: 30, borderRadius: 30/2,
                                    backgroundColor: 'red',
                                    justifyContent: 'center', alignItems: 'center'
                                }}>
                                <View style={{
                                    color: '#FFF',
                                    fontSize: 20
                                }}>
                                </View>
                                </View>
                            ) : null
                        }
                        {selected && <View style={styles.overlayrdn} />}
                    </TouchableOpacity>

        </View>
      );
    }

    //List Multe select
    const ListMultiOption=()=>{
      return(
        <Pressable onPress={deSelectItems} style={{flex: 1, padding: 15}}>
              <FlatList
                data={allQuestions[currentQuestionIndex]?.value.options}
                renderItem={({item, index}) => (
                  <RenderMultiCheck
                    onPress={() => selectItems(item)}
                    onLongPress={() => selectItems(item)}
                    selected={getSelected(item)}
                    option={item}
                    index={index}

                  />
                )}
                keyExtractor={(item, index) => index}
              />
        </Pressable>
      )
    }

    //en version
    const ListMultiOptionEn=()=>{
      return(
        <Pressable onPress={deSelectItems} style={{flex: 1, padding: 15}}>
              <FlatList
                data={allQuestions[currentQuestionIndex]?.value.options_en}
                renderItem={({item, index}) => (
                  <RenderMultiCheck
                    onPress={() => selectItems(item)}
                    onLongPress={() => selectItems(item)}
                    selected={getSelected(item)}
                    option={item}
                    index={index}

                  />
                )}
                keyExtractor={(item, index) => index}
              />
        </Pressable>
      )
    }

    const renderNextButtonmulti = () => {

         if(showNextButton){
             return (
                 <TouchableOpacity
                 onPress={validateAnswerMultis}
                 style={{
                     marginTop: 20, width: '100%', backgroundColor: COLORS.primary, padding: 20, borderRadius: 60
                 }}>
                     <Text style={{fontSize: 20, color: '#FFF', textAlign: 'center'}}>{lanjut}</Text>
                 </TouchableOpacity>
             )
         }else{
             return null
         }
    }

    //Mencari jawaban benar di selected multi option
    const CheckAnswerMulti=(array, selectItems)=> {
        let c = 0;
        var data = selectedItems;
        var first = array;
        for(let i=0; i<first.length; i++){
          if(data.includes(first[i])){
            c = c+1;
          }
        }
       return c
        // return array.every(function(data) {
        //     return data === first;
        // });

    }

    // Memberikan nilai skoor pada validate selected multi
    //lang
    const validateAnswerMultis = (selectItems) => {
         let w = 0; let s = 0;
         let hasilmulti='';
          if(lang=='id'){
              hasilmulti = CheckAnswerMulti(allQuestions[currentQuestionIndex]?.value.correct_option,selectedItems)

              if(hasilmulti==allQuestions[currentQuestionIndex]?.value.correct_option.length){
                  // Set Score
                  setScore(score+1)
                  s = (score+1)
                  w = (wrscore)
              }else{
                  setWscore(wrscore+1)
                  s = (score)
                  w = (wrscore+1)
              }

          }else if(lang=='en'){
              hasilmulti = CheckAnswerMulti(allQuestions[currentQuestionIndex]?.value.correct_option_en,selectedItems)

              if(hasilmulti==allQuestions[currentQuestionIndex]?.value.correct_option_en.length){
                  // Set Score
                  setScore(score+1)
                  s = (score+1)
                  w = (wrscore)
              }else{
                  setWscore(wrscore+1)
                  s = (score)
                  w = (wrscore+1)
              }
          }

         // setCurrentOptionSelected(selectedOption);
         // setCorrectOption(correct_option);


         // Show Next Button
         setShowNextButton(true)
         //setTimeout(()=>{

            setShowNextButton(false)
            //setScore(0)
            setSelectedItems([])
            setCurrentQuestionIndex(currentQuestionIndex+1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);


         //},1000)

         handleNextDM(w,s)
    }
//Multiselected-----------------------------------------------END----------------------------
    const generateBackgroundColorMD = (index) => {
      if(index % 4 == 0) {
        return '#66C5D3'
      } else if(index % 4 == 1) {
        return '#EABB26'
      } else if(index % 4 == 2) {
        return '#A1BB22'
      } else {
        return '#9811EA' // gak masuk sini ...
      }
    }
//DragDrop-----------------------------------------------------------------------------------
    const Draxzone= ({item,index}) =>{
      return(
        <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', marginBottom:20}}>
            <DraxView
                style={styles.receiver}
                key={index}
                receivingStyle={styles.receiving}
                renderContent={({ viewState }) => {
                  const receivingDrag = viewState && viewState.receivingDrag;
                  const payload = receivingDrag && receivingDrag.payload;
                  return (
                    <>
                      <Text style={styles.received}>{aswDRG[index]}</Text>
                    </>
                  );
                }}
                onReceiveDragDrop={(event) => {
                    let selected_item = event.dragged.payload;
                    answerDrg[index]  = selected_item;

                    let newAsw = aswDRG.slice()
                    newAsw[index] = answerDrg[index]
                    setDRG(newAsw);


                    let newIds = selectedDrags.slice()
                    newIds[index] = answerDrg[index]
                    setSelectedDrags(newIds);

                    if(selectedDrags.length <= allQuestions[currentQuestionIndex]?.value.correct_option.length-1){
                      setSelectedDrags([...selectedDrags, selected_item]);
                    }
                    if(selectedDrags.length === allQuestions[currentQuestionIndex]?.value.correct_option.length-1){
                        setShowNextButton(true)
                    }

                }}

            >

          </DraxView>
        </View>
      )
    }

    const DraxzoneEn= ({item,index}) =>{
      return(
        <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', marginBottom:20}}>
            <DraxView
                style={styles.receiver}
                key={index}
                receivingStyle={styles.receiving}
                renderContent={({ viewState }) => {
                  const receivingDrag = viewState && viewState.receivingDrag;
                  const payload = receivingDrag && receivingDrag.payload;
                  return (
                    <>
                      <Text style={styles.received}>{aswDRG[index]}</Text>
                    </>
                  );
                }}
                onReceiveDragDrop={(event) => {
                    let selected_item = event.dragged.payload;
                    answerDrg[index]  = selected_item;

                    let newAsw = aswDRG.slice()
                    newAsw[index] = answerDrg[index]
                    setDRG(newAsw);


                    let newIds = selectedDrags.slice()
                    newIds[index] = answerDrg[index]
                    setSelectedDrags(newIds);

                    if(selectedDrags.length <= allQuestions[currentQuestionIndex]?.value.correct_option_en.length-1){
                      setSelectedDrags([...selectedDrags, selected_item]);
                    }
                    if(selectedDrags.length === allQuestions[currentQuestionIndex]?.value.correct_option_en.length-1){
                        setShowNextButton(true)
                    }

                }}

            >

          </DraxView>
        </View>
      )
    }

    const TouchDrag = ({item,index})=>{
      return(
              <DraxView
                  style={[styles.draggable,{backgroundColor: generateBackgroundColorMD(index)}]}
                  draggingStyle={styles.dragging}
                  dragReleasedStyle={styles.dragReleased}
                  hoverDragReleasedStyle={styles.hoverDragReleased}
                  hoverDraggingStyle={styles.hoverDragging}
                  dragPayload={item}
                  longPressDelay={0}
                  key={index}
              >
                  <Text style={{color:'#FFF'}}>{item}</Text>
              </DraxView>

      )
    }

    const FlatListItemSeparator = () => {
      return (<View style={styles.itemSeparator} />);
    }

    const renderNextButtonDrag = () => {

         if(showNextButton){
             return (
                 <TouchableOpacity
                 onPress={validateAnswerDrag}
                 style={{
                     marginTop: 20, width: '100%', backgroundColor: COLORS.primary, padding: 20, borderRadius: 60
                 }}>
                     <Text style={{fontSize: 20, color: '#FFF', textAlign: 'center'}}>{lanjut}</Text>
                 </TouchableOpacity>
             )
         }else{
             return null
         }
    }

    //lang
    const validateAnswerDrag = (selectDrags) => {
         let w = 0; let s = 0;
         let hasildrag='';
          if(lang=='id'){
              hasildrag = CheckAnswerDrag(allQuestions[currentQuestionIndex]?.value.correct_option,selectedDrags)
              if(hasildrag==allQuestions[currentQuestionIndex]?.value.correct_option.length){
                  // Set Score
                  setScore(score+1)
                  s = (score+1)
                  w = (wrscore)
              }else{
                  setWscore(wrscore+1)
                  s = (score)
                  w = (wrscore+1)
              }

          }else if(lang=='en'){
              hasildrag = CheckAnswerDrag(allQuestions[currentQuestionIndex]?.value.correct_option_en,selectedDrags)
              if(hasildrag==allQuestions[currentQuestionIndex]?.value.correct_option_en.length){
                  // Set Score
                  setScore(score+1)
                  s = (score+1)
                  w = (wrscore)
              }else{
                  setWscore(wrscore+1)
                  s = (score)
                  w = (wrscore+1)
              }

          }
         // setCurrentOptionSelected(selectedOption);
         // setCorrectOption(correct_option);

         // Show Next Button
         setShowNextButton(true)
         //setTimeout(()=>{

            setShowNextButton(false)
            //setScore(0)
            setSelectedDrags([])
            setCurrentQuestionIndex(currentQuestionIndex+1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);


         //},0)
         setDRG([])

         handleNextDM(w,s)
    }

    const CheckAnswerDrag=(array, selectItems)=> {
      let c = 0;
      var data = selectItems;
      var first = array;
      for(let i=0; i<first.length; i++){
        if(data[i]==first[i]){
          c = c+1;
        }
      }
      return c
    }

//DragDrop---------------------------------------------------END-----------------------------

    const generateBackgroundColor = (index) => {
      if(index % 2 == 0) {
        return '#EDA00C'
      } else if(index % 2 == 1) {
        return '#05A6CA'
      } else if(index % 2 == 2) {
        return '#CBDFBD'
      } else {
        return 'red' // gak masuk sini ...
      }
    }

    const generateAbc = (index)=>{
      if(index == 0) {
        return 'A. '
      }else if(index == 1) {
        return 'B. '
      }else if(index == 2) {
        return 'C. '
      }else if(index == 3) {
        return 'D. '
      }
    }

    const renderNextButton = () => {
        if(showNextButton){
            return (
                <TouchableOpacity
                onPress={handleNext}
                style={{
                    marginTop: toDp(20), width: '100%', backgroundColor: COLORS.primary, padding: toDp(20), borderRadius: toDp(60)
                }}>
                    <Text style={{fontSize: toDp(20), color: COLORS.white, textAlign: 'center'}}>{lanjut}</Text>
                </TouchableOpacity>
            )
        }else{
            return null
        }
    }

    const [progress, setProgress] = useState(new Animated.Value(0));

    const progressAnim = progress.interpolate({
        inputRange: [0, allQuestions.length],
        outputRange: ['0%','100%']
    })

    const renderProgressBar = () => {
        return (
            <View style={{
                width: '100%',
                height: toDp(20),
                borderRadius: toDp(20),
                backgroundColor: '#00000020',

            }}>
                <Animated.View style={[{
                    height: toDp(20),
                    borderRadius: toDp(20),
                    backgroundColor: '#E80000'
                },{
                    width: progressAnim
                }]}>

                </Animated.View>

            </View>
        )
    }

    return (

       <SafeAreaView style={{
           flex: 1
       }}>
       <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
       <Header
        title={props.navigation.state.params.title}
        onPress={() => props.navigation.goBack()}/>
        <Loader loading={state.loading} />
        {state.arraSoal.length > 0 ?
          <ScrollView style={{backgroundColor:'#fff'}}>
            <View style={styles.container}>

               {/* ProgressBar */}
               { renderProgressBar() }

               {/* Question */}
               {renderQuestion()}

               {/* Options */}

               {
                 allQuestions[currentQuestionIndex]?.value.type === 'option' ?
                     <>
                       { lang=='id' ?
                           renderOptions()
                       :lang=='en' ?
                          renderOptions_en()
                       :<><Text>No data available</Text></>
                       }
                     </>

                 : allQuestions[currentQuestionIndex]?.value.type === 'image option' ?

                       <>
                         { lang=='id' ?
                             <ImgList/>
                         :lang=='en' ?
                             <ImgListEN/>
                         :<><Text>No data available</Text></>
                         }
                       </>

                 : allQuestions[currentQuestionIndex]?.value.type === 'yesorno' ?
                       <>
                         { lang=='id' ?
                             renderYesnoOptions()
                         :lang=='en' ?
                             renderYesnoOptions_en()
                         :<><Text>No data available</Text></>
                         }
                       </>

                 : allQuestions[currentQuestionIndex]?.value.type === 'multi' ?

                       <>
                         { lang=='id' ?
                             <ListMultiOption/>
                         :lang=='en' ?
                             <ListMultiOptionEn/>
                         :<><Text>No data available</Text></>
                         }
                       </>
                 : allQuestions[currentQuestionIndex]?.value.type === 'drag' ?


                      <>
                        { lang=='id' ?
                            <DraxProvider key={`drax-id-${currentQuestionIndex}`}>
                                  <View style={{width:'100%'}}>
                                      <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', marginBottom:20}}>
                                            {allQuestions[currentQuestionIndex]?.value.correct_option.map((item, index) => Draxzone({ item, index }))}
                                      </View>
                                  </View>
                                  <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', marginBottom:20}}>
                                   <DraxList
                                      data={allQuestions[currentQuestionIndex]?.value.options}
                                      renderItemContent={TouchDrag}
                                      itemStyles={{
                                        draggingStyle: styles.dragging,
                                        dragReleasedStyle: styles.dragReleased,
                                        hoverDragReleasedStyle: styles.hoverDragReleased,
                                      }}
                                      keyExtractor={(item, index) => item.toString()}
                                      numColumns={2}
                                      ItemSeparatorComponent={FlatListItemSeparator}
                                      scrollEnabled={true}
                                    />
                                   </View>
                            </DraxProvider>
                           /*Drag Drop*/
                        :lang=='en' ?
                            <DraxProvider key={`drax-en-${currentQuestionIndex}`}>
                                  <View style={{width:'100%'}}>
                                      <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', marginBottom:20}}>
                                            {allQuestions[currentQuestionIndex]?.value.correct_option_en.map((item, index) => Draxzone({ item, index }))}
                                      </View>
                                  </View>
                                  <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', marginBottom:20}}>
                                   <DraxList
                                      data={allQuestions[currentQuestionIndex]?.value.options_en}
                                      renderItemContent={TouchDrag}
                                      itemStyles={{
                                        draggingStyle: styles.dragging,
                                        dragReleasedStyle: styles.dragReleased,
                                        hoverDragReleasedStyle: styles.hoverDragReleased,
                                      }}
                                      keyExtractor={(item, index) => item.toString()}
                                      numColumns={2}
                                      ItemSeparatorComponent={FlatListItemSeparator}
                                      scrollEnabled={true}
                                    />
                                   </View>
                            </DraxProvider>
                           /*Drag Drop*/
                        :<><Text>No data available</Text></>
                        }
                      </>

                 :
                 <Text>Sorry This Qustion not have type</Text>
               }

               {/* Next Button */}

               {
                 allQuestions[currentQuestionIndex]?.value.type === 'multi' ?
                    renderNextButtonmulti()

                :allQuestions[currentQuestionIndex]?.value.type === 'drag' ?
                    renderNextButtonDrag()
                :

                    renderNextButton()

               }


               {/* Score Modal */}
               <Modal
               animationType="slide"
               transparent={true}
               visible={showScoreModal}
               >
                   <View style={{
                       flex: 1,
                       backgroundColor: COLORS.primary,
                       alignItems: 'center',
                       justifyContent: 'center'
                   }}>
                       <View style={{
                           backgroundColor: COLORS.white,
                           width: '90%',
                           borderRadius: 20,
                           padding: 20,
                           alignItems: 'center'
                       }}>
                           <Text style={{fontSize: 30, fontWeight: 'bold'}}>{ (score+correctTemp)> (allQuestions.length/2) ? selamat : cobalagi }</Text>

                           <View style={{
                               flexDirection: 'row',
                               justifyContent: 'flex-start',
                               alignItems: 'center',
                               marginVertical: 20
                           }}>
                               <Text style={{
                                   fontSize: 30,
                                   color: (score+correctTemp)> (allQuestions.length/2) ? COLORS.success : COLORS.error
                               }}>{(score+correctTemp)}</Text>
                                <Text style={{
                                    fontSize: 20, color: COLORS.black
                                }}> / { allQuestions.length }</Text>
                           </View>
                           <ExamMessage title={inf_endText}/>
                           {/* Retry Quiz button */}
                           <View style={{flexDirection:'row', justifyContent:'space-around',width:'100%'}}>
                               <TouchableOpacity
                               onPress={restartQuiz}
                               style={{
                                   backgroundColor: COLORS.error,
                                   padding: 20, width: '45%', borderRadius: 20,
                               }}>
                                   <Text style={{
                                       textAlign: 'center', color: COLORS.white, fontSize: 20
                                   }}>{cobalagi}</Text>
                               </TouchableOpacity>

                               <TouchableOpacity
                               onPress={()=> Oke()}
                               style={{
                                   backgroundColor: COLORS.accent,
                                   padding: 20, width: '45%', borderRadius: 20
                               }}>
                                   <Text style={{
                                       textAlign: 'center', color: COLORS.white, fontSize: 20
                                   }}>{oke}</Text>
                               </TouchableOpacity>
                           </View>
                       </View>
                   </View>
               </Modal>

               {/* Background Image */}
               <Image
                source={require('../../Assets/img/ic_user.png')}
                style={{
                    width: SIZES.width,
                    height: 130,
                    zIndex: -1,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    opacity: 0.5
                }}
                resizeMode={'contain'}
                />

           </View>
          </ScrollView>
          :
            <View style={styles.vnotfound}>
                <Image source={allLogo.ic404} style={{width:toDp(200), height:toDp(200)}} />
                <View style={{marginTop:40, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize:16, fontWeight:'bold', color:'#909090' }}>
                    {inf_ujianNull}
                  </Text>

                  <View style={{justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={styles.btnBack} onPress={()=>BackGo()}>
                          <Text style={styles.txtBack}>{kembali}</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
        }
        {/*modal*/}
        <Modals style={styles.modal} isVisible={isModalVisible}>
          <View style={styles.ViewModal}>

              <View style={{padding:toDp(20)}}>
                <Text style={{fontSize:toDp(20), fontWeight:'bold'}}>{toUpper(informasi)}</Text>
                <View style={{marginTop: toDp(16)}}>
                  <Text style={{fontSize:toDp(16)}}>{inf_ujianDone}</Text>
                </View>
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.pressMbtn} onPress={()=> BackGo() }>
                    <Text style={{fontWeight:'bold'}}>{kembali}</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modals>
        {/*end modal*/}
       </SafeAreaView>

    )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    paddingVertical: toDp(40),
    paddingHorizontal: toDp(16),
    backgroundColor: '#fff',
    position:'relative',

  },
  vnotfound:{
    marginVertical: '40%',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },
  pressMbtn:{
    height:toDp(60), alignItems:'center',
    justifyContent:'center', flex:1
  },
  txtBack:{
    alignItems:'center',
    color:'#fff',
    fontSize:toDp(16),
    fontWeight:'bold'
  },
  btnBack:{
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
    padding:toDp(12),
    borderRadius:toDp(10),
    marginTop: toDp(30),
    width: toDp(200)
  },
  card: {
    height: '90%',
    marginHorizontal: toDp(1),
    borderRadius: toDp(10),
    marginBottom: toDp(20),
    padding: toDp(5),
  },
  vrow:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  imgYesno:{
    width: toDp(40),
    height: toDp(40),
  },
  btnYesNo: {
    padding: toDp(14),
    height: toDp(50),
    width: toDp(120),
    fontSize: toDp(15),
    backgroundColor: '#000',
    flexDirection:'row',
    justifyContent:'center',
  },
  modal:{
    marginVertical:'64%',
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
  listItem: {
   backgroundColor: '#252628',
   marginBottom: 10,
   borderRadius: 5,
   overflow: 'hidden',
 },
 overlay: {
   position: 'absolute',
   top: 0,
   left: 0,
   width: '100%',
   height: '100%',
   backgroundColor: 'rgba(255,0,0,0.5)',
 },
 overlayrdn: {
   flex:1,
   position: 'absolute',
   left: 0,
   zIndex:2,
   width: widthMt,
   height: '100%',
   borderRadius: toDp(60),
   borderWidth:toDp(2),
   borderColor: '#01848F',
 },
 draggable: {
      height: 50,
      paddingLeft:18,
      paddingRight:18,
      backgroundColor: 'green',
      borderRadius: 8,
      justifyContent:'center',
      alignItems:'center',
      color:'#FFF',
      marginHorizontal:toDp(25)
  },
  receiver: {
      height: 50,
      paddingLeft:20,
      paddingRight:20,
      backgroundColor: '#ccc',
      borderRadius: 8,
      justifyContent:'center',
      alignItems:'center'
  },
  dragging: {
    opacity: 0.2,
    fontSize: 12
  },
  dragReleased: {
    opacity: 0,
  },
  hoverDragReleased: {
    opacity: 0,
  },
  hoverDragging: {
    borderColor: '#FFF',
    borderWidth: 1,
    paddingLeft:20,
    paddingRight:20,
  },
  receiving: {
    borderColor: 'red',
    borderWidth: 2,
  },
  txtDrag:{
    justifyContent:'center',
    alignItems:'center',
    color:'#FFF'
  },
  itemSeparator: {
    height: 15
  },
});
export default Exam
