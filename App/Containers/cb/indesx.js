import React, {useState} from 'react';
import { Text, View, StyleSheet,Pressable,Image,FlatList,Dimensions,TouchableOpacity} from 'react-native';

const {height, width} = Dimensions.get('window');
const itemWidth = (width - 15) / 2;

export default function cb() {
  const [wish, setWish] = useState([])
  const [uid, setUid] = useState('id000123')
  const [selectedItems, setSelectedItems] = useState([]);

  const [current, setCurrent] = useState(0);
  const produk = [
    {
      'id':'1',
      'name':'Title 1',
      'image':'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//97/MTA-5097156/oem_bantal_tidur_premium_full_dacron_ukuran_67x27_cm_-_bantal_kepala_-_medan_full01_mr1we2z8.jpg',

    },{
      'id':'2',
      'name':'Title 2',
      'image':'https://cf.shopee.co.id/file/baf1e4d3fbf98936a4501619197619d0',

    },{
      'id':'3',
      'name':'Title 3',
      'image':'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//88/MTA-11809212/no_brand_lemari_3_pintu_-_cermin_lpm_331_-gratis_ongkir_bandung_full01_f17c63x6.jpg',

    },{
      'id':'4',
      'name':'Title 4',
      'image':'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//1106/grace_lemari-pakaian-anak-2-pintu-motif-grace-bl-57-cr-jabodetabek_full02.jpg',

    },
  ]

  const selectItems = (item, uid, index) => {
      //love /favorit

      //checking json product (id and uid) value same
      if((selectedItems.id != produk[index]?.id ) && (selectedItems.uid != uid )){
        let data = {
          id: item,
          uid: uid,
        } // data will send to seerver
        //push to server
           //write code here

        //If the status is successful, the server must send the product data that the related user loves
        //set response to state : update let data only
        setSelectedItems([...selectedItems, data]);
      }
  };

  const deSelectItems = (item,uid) => {
    //unlike
    //Is there data that is the same as the clicked data?
    if (selectedItems.some(i => i.id === item) && selectedItems.some(i=> i.uid === uid) ) {
       //send the clicked/referred data to the api, to be updated
         //write code here


      //if there is, filter that data (Update local state like this)
        const newListItems = selectedItems.filter(
          listItem => listItem.id != item && listItem.id != uid
        );

      //update the state
        return setSelectedItems(newListItems);
      }

  }
  const getSelected = (id, uid) => {
    //for filter button
    if( selectedItems.some(i=> i.id === id) && selectedItems.some(i=> i.uid === uid) ){
      return true
    }else{
      return false
    }
  }



  const loveline = 'https://www.seekpng.com/png/full/326-3268593_heart-icon-transparent-icon-symbol-love-black.png'

  const lovepink ='https://www.seekpng.com/png/full/97-974314_heart-clipart-orange-heart-clip-icon-love-pink.png'




  const Card=({option, index, onPress, selected, unfollow})=>{
    return (
      <View style={{flex:0.5, backgroundColor:'#FFF',maxWidth:width,
                    margin:5, height:220, borderRadius:8,padding:8,
                    marginBottom:12,  alignItems:'space-between', }}>

          <View style={{justifyContent:'center', alignItems:'center'}}>
           <Image source={{uri: option.image}} style={{width:100,height:125 ,backgroundColor:'#FFF'}}></Image>
          </View>

           <Text style={{marginTop:10, fontWeight:'bold'}}>{option.name}</Text>

          <View style={{width:'100%', marginTop:12}}>
            {selected==false ?
              <TouchableOpacity  onPress={()=>onPress()}>
                 <Image source={{uri: loveline}} style={{width:25, height:22,padding:6}}></Image>
              </TouchableOpacity>
            :
            <TouchableOpacity onPress={unfollow}>
                      <Image  source={{uri: lovepink}} style={{width:25, height:22,padding:6}}></Image>
            </TouchableOpacity>
            }
          </View>


      </View>
    )
  }



  return (
    <View style={styles.container}>
        <FlatList
        data={produk}
        numColumns={2}
        renderItem={({item, index}) => (

            <Card
               option={item}
               index={index}
               onPress={() =>selectItems(item.id, uid, index)}
               selected={getSelected(item.id, uid)}
               unfollow={() =>deSelectItems(item.id, uid)}
              />
         )}
              keyExtractor={item => item}

            ListFooterComponent={() => <View style={{height: 24}} />}
        />

        <View style={styles.checkboxContainer}>
           <Text>{selectedItems.length}</Text>
        </View>
        <Text>{JSON.stringify(selectedItems)}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 8,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
});
