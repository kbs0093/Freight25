import React, {useState, Component} from 'react';
import {  
  StyleSheet,
  View,
  Platform,
  FlatList,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {
  Text,
  Icon,
  Divider,
  Layout,
} from '@ui-kitten/components';
import { AppRoute } from '../../navigation/app-routes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { SearchScreenProps } from'../../navigation/search.navigator';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import Geolocation from 'react-native-geolocation-service';
import TextTicker from 'react-native-text-ticker'
import { ThemeContext } from '../../component/theme-context';


const server = "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&"
const isAndroid = Platform.OS === 'android';

export const SearchScreen = (props): SearchScreenProps => {  
  const themeContext = React.useContext(ThemeContext);

  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');
  const [city, setcity] = useState('');
  const [gu, setgu] = useState('');
  const [myeon, setmyeon] = useState('');
  const [dong, setdong] = useState('');
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [distance, setdistance] = useState([]);

  const requestLocationAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {             
        Geolocation.getCurrentPosition(
          (position) => {            
            let Templatitude = JSON.stringify(position.coords.latitude);
            let Templongitude = JSON.stringify(position.coords.longitude);   
            setlatitude(Templatitude)
            setlongitude(Templongitude)
            
            fetch(server + `&lat=${latitude}&lon=${longitude}&coordType=WGS84GEO&addressType=A10&callback=callback&appKey=l7xxce3558ee38884b2da0da786de609a5be`)
            .then(response => response.json())
            .then(response => {              
              const city = JSON.stringify(response.addressInfo.city_do).replace(/\"/gi, "");
              const gu = JSON.stringify(response.addressInfo.gu_gun).replace(/\"/gi, "");
              const myeon = JSON.stringify(response.addressInfo.eup_myun).replace(/\"/gi, "");
              const dong = JSON.stringify(response.addressInfo.adminDong).replace(/\"/gi, "");    
              setcity(city);
              setgu(gu);
              setmyeon(myeon);
              setdong(dong);
              FirebaseRequest();                   
            })   
            .catch(err => console.log(err));     
          }, error => Alert.alert('Error', JSON.stringify(error)),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const requestLocationIos = () => {
    Geolocation.getCurrentPosition(
      position => {
        var Templatitude = JSON.stringify(position.coords.latitude);
        var Templongitude = JSON.stringify(position.coords.longitude);

        setlatitude(Templatitude)
        setlongitude(Templongitude)
        
        fetch(server + `&lat=${latitude}&lon=${longitude}&coordType=WGS84GEO&addressType=A10&callback=callback&appKey=l7xxce3558ee38884b2da0da786de609a5be`)
        .then(response => response.json())
        .then(response => {
          const city = JSON.stringify(response.addressInfo.city_do).replace(/\"/gi, "");
          const gu = JSON.stringify(response.addressInfo.gu_gun).replace(/\"/gi, "");
          const myeon = JSON.stringify(response.addressInfo.eup_myun).replace(/\"/gi, "");
          const dong = JSON.stringify(response.addressInfo.adminDong).replace(/\"/gi, "");

          setcity(city);
          setgu(gu);
          setmyeon(myeon);
          setdong(dong);
          FirebaseRequest();       
        })   
        .catch(err => console.log(err));     
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},     
    );
  };

  const FirebaseRequest = async() => {
    var user = auth().currentUser;    
    if(user != null){
      try {
        firestore().collection('freights').where("state", "==", 0)
        .get()
        .then(async function(querySnapshot){
          var list =[];
          
          for(var docCnt in querySnapshot.docs){
            const doc = querySnapshot.docs[docCnt].data();
            var parseStart = doc.startAddr + "";
            var startArr = parseStart.split(" ");
            var smart;
            var parseEnd = doc.endAddr + "";
            var endArr = parseEnd.split(" ");
            var moneyprint = doc.expense + "";
            var distance = 100 * (Math.acos(Math.sin(Number(latitude))*Math.sin(doc.startAddr_lat) + Math.cos(Number(latitude))*Math.cos(doc.startAddr_lat)*Math.cos(Number(longitude) - doc.startAddr_lon)));;
            
            distance = Math.floor(distance);
            moneyprint = moneyprint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            await RegionCode(endArr[0]).then((result)=>{smart = result});

            list.push({
              id: doc.id,
              startAddress: startArr,
              endAddress: endArr,
              startX: doc.startAddr_lon,
              startY: doc.startAddr_lat,
              startType: doc.startDate,
              endType: doc.endDate,
              Type: doc.driveOption,
              carType: doc.carSize,
              carType2: doc.carType,
              freightSize: doc.volume,
              freightWeight: doc.weight,
              loadType: doc.freightLoadType,
              distanceX: distance,              
              distanceY: doc.dist,
              time: null,
              smart: smart,
              money: doc.expense,
              moneyPrint: moneyprint,              
            })}          
          setData(list);
          setData2(list)
      })} 
      catch (error) {
        console.log(error);
      }      
    }   
  }

  const RegionCode = async(address) =>{
    var week = new Array('sunday','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
    var date = new Date();
    var dayName = week[date.getDay()];
    let smart;

    var data = await firestore().collection('probability').doc(dayName)
    .get()
    .then(function(doc){
      if(address == '강원'){
        smart = doc.data().gw;
      } else if (address == '경기'){
        smart = doc.data().gg;
      } else if (address == '경남'){
        smart = doc.data().gn;
      } else if (address == '경북'){
        smart = doc.data().gb;
      } else if (address == '광주'){
        smart = doc.data().gj;
      } else if (address == '대구'){
        smart = doc.data().dg;
      } else if (address == '대전'){
        smart = doc.data().dj;
      } else if (address == '부산'){
        smart = doc.data().bs;
      } else if (address == '서울'){
        smart = doc.data().se;
      } else if (address == '세종특별자치시'){
        smart = doc.data().sj;
      } else if (address == '울산'){
        smart = doc.data().us;
      } else if (address == '인천'){
        smart = doc.data().ic;
      } else if (address == '전남'){
        smart = doc.data().jn;
      } else if (address == '전북'){
        smart = doc.data().jb;
      } else if (address == '제주특별자치도'){
        smart = doc.data().jj;
      } else if (address == '충남'){
        smart = doc.data().cn;
      } else if (address == '충북'){
        smart = doc.data().cb;
      }
    })  
    return smart;
  }

  const ClickList = item => () => {
    AsyncStorage.setItem('FreightID', item.id);
    props.navigation.navigate(AppRoute.SEARCH_DETAIL);
  };

  const moneySort = (a, b) => {
    if(a.money == b.money){ return 0} return a.money < b.money ? 1 : -1;
  };

  const distanceSort = (a, b) => {
    return Number(a.distanceY) > Number(b.distanceY) ? -1 : Number(a.distanceY) < Number(b.distanceY) ? 1: 0;
  };

  const distanceSort2 = (a, b) => {
    return Number(a.distanceY) < Number(b.distanceY) ? -1 : Number(a.distanceY) > Number(b.distanceY) ? 1: 0;
  };    

  const smartSort = (a, b) => {
    if(a.smart == b.smart){ return 0} return a.smart < b.smart ? 1 : -1;
  };

  
  const _renderItem = ({item}) => (
    <TouchableOpacity onPress={ClickList(item)}>    
    <Layout style={styles.container}>
      <Layout style={styles.geoInfo}>
        
        <Layout style={styles.geoInfo1}>
          <Layout style={styles.geoInfo11}>
          <Layout style={{flex: 1, justifyContent: 'flex-end'}}>
            <TextTicker
                style={(themeContext.theme == 'dark')? {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'white'} : {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'black'}}
                duration={3000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {item.startAddress[0]} {item.startAddress[1]}
              </TextTicker>            
              
            </Layout>
            <Layout>
              <Text style={styles.geoTitleText}>{item.startAddress[2]}</Text>
            </Layout>             
          </Layout>

          <Layout style={styles.geoInfo12}>
            <Layout>
              <Icon style={styles.icon} fill='#8F9BB3' name='arrow-forward-outline'/>
            </Layout>
            <Layout><Text style={styles.Type}>{item.Type}</Text></Layout>      
          </Layout>
          
          <Layout style={styles.geoInfo11}>
            <Layout style={{flex: 1, justifyContent: 'flex-end'}}>
              <TextTicker
                style={(themeContext.theme == 'dark') ? {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'white'} : {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'black'}}
                duration={3000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {item.endAddress[0]} {item.endAddress[1]}
              </TextTicker>              
            </Layout>
            <Layout>
              <Text style={styles.geoTitleText}>{item.endAddress[2]}</Text>
            </Layout> 
          </Layout>          
        </Layout>

        <Layout style={styles.geoInfo2}> 
          <Layout style={styles.geoInfo21}><Text style={styles.startType}>{item.startType}</Text></Layout>
          <Layout style={styles.geoInfo12}></Layout>
          <Layout style={styles.geoInfo21}><Text style={styles.endType}>{item.endType}</Text></Layout>
        </Layout>

          <Layout style={styles.geoInfo3}/>                        
            <Layout>
              <TextTicker
                style={styles.freightTypeText}
                duration={3000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {item.carType} / {item.carType2} / {item.freightSize} 파렛 / {item.freightWeight} 톤 / {item.loadType}
              </TextTicker>
            </Layout>
      </Layout>

      <Layout style={styles.driveInfo}>
        <Layout style={styles.driveInfo1}>
            <Text style={{fontSize: 8}}></Text>
            <Text style={styles.driveText2}>{item.distanceY} Km</Text>
            <Text style={styles.timeText}>스마트 확률 : {item.smart} %</Text>
            <Text style={styles.distance}>{item.distanceX} Km</Text>      
        </Layout>
        <Layout style={styles.moneyInfo}>
            <TextTicker
              style={(themeContext.theme == 'dark')? {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'white'} : {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'black'}}
              duration={3000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
            >
              {item.moneyPrint} 원
            </TextTicker>
          
        </Layout>
      </Layout>                          
    </Layout>
    </TouchableOpacity>
  );
  
  if(isAndroid == true){
    requestLocationAndroid();
  } else {
    requestLocationIos();
  }
    
  return (
  
  <React.Fragment>
    <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
    
    <Layout style={{height: "8%", flexDirection: "row", backgroundColor : 'white'}}>
      <Layout style={{flex: 3, justifyContent: 'center'}}>
        <Layout style={{flexDirection: "row"}}>
          <Layout style={{justifyContent: 'center'}}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 5 }}>검색 위치 : </Text>
          </Layout>
          <Layout style={{justifyContent: 'center'}}>
            <TextTicker
              style={(themeContext.theme == 'dark')? {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'white'} : {fontWeight: 'bold', fontSize: 18, margin: 2,color: 'black'}}
              duration={3000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
            >
              {city} {gu} {myeon} {dong}
            </TextTicker>
          </Layout>         
        </Layout>      
      </Layout>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}/>  
    </Layout>
    
    <Layout style={{height: "8%", flexDirection: "row", backgroundColor : 'white'}}>
      <Layout style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 18, margin: 5}}>
        검색 조건 : 
        </Text>
      </Layout>
      <Layout style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
        <RNPickerSelect
            onValueChange={(value) => {
                
            }}
            placeholder={{
              label: '정렬 순서',
              value: null,
            }}
            useNativeAndroidPickerStyle={isAndroid? true: false}
            items={[
              {label: '운행거리 순 (낮음)', value: '4'},
              {label: '운행거리 순 (높음)', value: '3'},
              {label: '운임 순', value: '2'},
              {label: '스마트 확률 순', value: '1'},
            ]}
            style={{
              placeholder: {
                color: 'orange'
              },
            }}
    
          />
      </Layout>      
    </Layout>
    <Layout style={{height: "8%", flexDirection: "row", backgroundColor : 'white'}}>
      <Layout style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 18, margin: 5}}>
          검색 반경 : 
        </Text>
      </Layout>
      <Layout style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
        <RNPickerSelect
            onValueChange={(value) => {
              
            }}
            placeholder={{
              label: '검색 반경 Km를 선택하세요',
              value: null,
            }}
            useNativeAndroidPickerStyle={isAndroid? true: false}
            items={[
              {label: '10Km', value: '4'},
              {label: '30Km', value: '3'},
              {label: '50Km', value: '2'},
              {label: '100Km', value: '1'},
            ]}
            style={{
              placeholder: {
                color: 'orange'
              },
            }}
          />
      </Layout>      
    </Layout>     
    <Divider style={{backgroundColor: 'black'}}/>     
      <FlatList
        style={(themeContext.theme == 'dark')? {backgroundColor: '#222B45'} : {backgroundColor: '#FFFFFF'}}
        data={data2}
        renderItem={_renderItem}
        keyExtractor={item => item.id}
      />                             
  </React.Fragment>
    
  );
};




const styles = StyleSheet.create({
  startType: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#2F80ED'
  },
  endType: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#EB5757'
  },
  endType2: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#F2994A'
  },
  Type: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#9B51E0',
  },
  container: {
    flex : 1,
    flexDirection: 'row',
    margin: 5
  },
  geoInfo: {
    flex: 4,
    flexDirection: 'column',
    //height : "20%",
  },
  geoInfo1: {
    flex : 2,
    flexDirection: 'row',
  },
  geoText:{
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 16,
    margin: 2,  
  },
  geoTitleText: {    
    fontWeight: 'bold',
    fontSize: 18,
    margin: 2,
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  driveText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  driveText2: {
    fontWeight: 'bold',
    fontSize: 20,
    justifyContent: 'flex-start',
  },
  geoInfo11: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'center',
    flex : 2,
  },
  geoInfo12: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex : 1,    
  },
  geoInfo3: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex : 1,
  },
  geoInfo2: {
    flex : 1,
    flexDirection: 'row',
  },
  geoInfo21: {
    justifyContent: 'center',
    alignItems: 'center',
    flex : 2,
  },
  driveInfo:{
    flex: 2,
    height : "20%",
  },
  driveInfo1:{
    alignItems: 'center',
    flex: 2,
  },
  moneyInfo:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  icon: {
    width: 28,
    height: 28,
  },
  distance: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#E5E5E5',
  },
  freightTypeText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#219653'
  },
  freightType: {    
    flexDirection: 'row',
    flex : 1,
  }
});