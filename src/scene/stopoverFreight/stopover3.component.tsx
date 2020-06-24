import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {  
  StyleSheet,
  ScrollView,
  NativeModules,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {
  Text,
  Layout,
  Icon,
  Divider,
  Button,
} from '@ui-kitten/components';
import MapView, {PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import {StopoverScreen3Props} from '../../navigation/search.navigator';
import {AppRoute} from '../../navigation/app-routes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-tiny-toast';
import TextTicker from 'react-native-text-ticker'
import { ThemeContext } from '../../component/theme-context';
const DirectSms = NativeModules.DirectSms;

export const StopoverScreen3 = (props) : StopoverScreen3Props => {

  const themeContext = React.useContext(ThemeContext);
  const [apiInfo, setApiInfo] = useState([]);
  const [mapVisible, setmapVisible] = useState(true);
  const [stopoverVisible, setstopoverVisible] = useState(true);
  const [FreightID, setFreightID] = useState('');
  const [totalTime, settotalTime] = useState();
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [data, setdata] = useState({
    startAddress: ['','',''],
    endAddress: ['','',''],
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    startType: '',
    endType: '',
    Type: '',
    carType: '',
    carType2: '',
    freightSize: '',
    freightWeight: '',
    loadType: '',
    distanceY: '',
    time: null,
    smart: undefined,
    money: 0,
    moneyPrint: '',
    startFull: '',
    endFull: '',
    desc: '',
    day: '',
  });

  useEffect(() => {
    FirebaseRequest(); // 한번만 실행    
  }, [])


  const FirebaseRequest = async () => {
    var user = auth().currentUser;
    var week = new Array('일요일','월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
    var date = new Date();
    var dayName = week[date.getDay()];
    var FreightID
    try {
      const value = await AsyncStorage.getItem('Stopover3');
      if (value !== null) {
        FreightID = value;
      }
    } catch (error) {
      console.log(error)
    }

    if (user != null) {
      var docRef = firestore().collection('freights').doc(FreightID);
      docRef.get().then(async function (doc) {
        if (doc.exists) {
          var parseStart = doc.data().startAddr + '';
          var startArr = parseStart.split(' ');
          var parseEnd = doc.data().endAddr + '';
          var endArr = parseEnd.split(' ');
          var moneyprint = doc.data().expense + '';
          moneyprint = moneyprint
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          var smart;
          await RegionCode(endArr[0]).then((result)=>{smart = result});

          var detaildata = {
            startAddress: startArr,
            endAddress: endArr,
            startX: Number(doc.data().startAddr_lon),
            startY: Number(doc.data().startAddr_lat),
            endX: Number(doc.data().endAddr_lon),
            endY: Number(doc.data().endAddr_lat),
            startType: doc.data().startDate,
            endType: doc.data().endDate,
            Type: doc.data().driveOption,
            carType: doc.data().carSize,
            carType2: doc.data().carType,
            freightSize: doc.data().volume,
            freightWeight: doc.data().weight,
            loadType: doc.data().freightLoadType,
            distanceY: doc.data().dist,
            time: null,
            smart: smart,
            money: doc.data().expense,
            moneyPrint: moneyprint,
            startFull: doc.data().startAddr_Full,
            endFull: doc.data().endAddr_Full,
            desc: doc.data().desc,
            day: dayName,
          };

          var region = {
            latitude: Number(doc.data().startAddr_lat),
            longitude: Number(doc.data().startAddr_lon),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          
          onRegionChange(region);
          setdata(detaildata);

          var data = fetch(
            'https://apis.openapi.sk.com/tmap/truck/routes?version=1&format=json&callback=result',
            {
              method: 'POST',
              headers: {
                appKey: 'l7xxce3558ee38884b2da0da786de609a5be',
              },
              body: JSON.stringify({
                startX: doc.data().startAddr_lon,
                startY: doc.data().startAddr_lat,
                endX: doc.data().endAddr_lon,
                endY: doc.data().endAddr_lat,
                reqCoordType: 'WGS84GEO',
                resCoordType: 'WGS84GEO',
                angle: '172',
                searchOption: '1',
                passlist: ``, //경유지 정보 (5개까지 추가 가능이므로 고려 할 것)
                trafficInfo: 'Y',
                truckType: '1',
                truckWidth: '100',
                truckHeight: '100',
                truckWeight: '2000', // 트럭 무게를 의미하기 때문에 값을 불러오는것이 좋을 듯
                truckTotalWeight: '20000', // 화물 무게도 불러올 것
                truckLength: '200', // 길이 및 높이는 일반적인 트럭 (2.5톤 트럭의 크기 등) 을 따를 것
              }),
            },
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (jsonData) {
              var coordinates = [];
               for (let i = 0; i < Object(jsonData.features).length; i++) {
                if (
                  typeof jsonData.features[i].geometry.coordinates[0] ===
                  'object'
                ) {
                  for (
                    let j = 0;
                    j <
                    Object(jsonData.features[i].geometry.coordinates).length;
                    j++
                  ) {
                    coordinates.push({
                      latitude: Number(
                        jsonData.features[i].geometry.coordinates[j][1],
                      ),
                      longitude: Number(
                        jsonData.features[i].geometry.coordinates[j][0],
                      ),
                    });
                  }
                } else {
                  if (jsonData.features[i].geometry.coordinates != null) {
                    coordinates.push({
                      latitude: Number(
                        jsonData.features[i].geometry.coordinates[1],
                      ),
                      longitude: Number(
                        jsonData.features[i].geometry.coordinates[0],
                      ),
                    });
                  }
                }
              }
              setApiInfo(coordinates);
              return JSON.stringify(jsonData);
            });

            var data2 = fetch(
              'https://apis.openapi.sk.com/tmap/truck/routes?version=1&format=json&callback=result',
              {
                method: 'POST',
                headers: {
                  appKey: 'l7xxce3558ee38884b2da0da786de609a5be',
                },
                body: JSON.stringify({
                  startX: doc.data().startAddr_lon,
                  startY: doc.data().startAddr_lat,
                  endX: doc.data().endAddr_lon,
                  endY: doc.data().endAddr_lat,
                  reqCoordType: 'WGS84GEO',
                  resCoordType: 'WGS84GEO',
                  angle: '172',
                  searchOption: '1',
                  passlist: ``, //경유지 정보 (5개까지 추가 가능이므로 고려 할 것)
                  trafficInfo: 'Y',
                  truckType: '1',
                  truckWidth: '100',
                  truckHeight: '100',
                  truckWeight: '2000', // 트럭 무게를 의미하기 때문에 값을 불러오는것이 좋을 듯
                  truckTotalWeight: '20000', // 화물 무게도 불러올 것
                  truckLength: '200', // 길이 및 높이는 일반적인 트럭 (2.5톤 트럭의 크기 등) 을 따를 것
                  totalValue: '2'
                }),
              },
            )
              .then(function (response) {
                return response.json();
              })
              .then(function (jsonData) {                         
                settotalTime(jsonData.features[0].properties.totalTime);
              });

              console.log('파이어베이스 함수 끝')
        } else {
          console.log('No such document!');
        }
      });
    }
  };

  const hideMap = () => {
    if (mapVisible) {
      setmapVisible(false);
    } else {
      setmapVisible(true);
    }
  };

  const hideStopvoer = () => {
    if (stopoverVisible) {
      setstopoverVisible(false);
    } else {
      setstopoverVisible(true);
    }
  };

  const onRegionChange = (region) => {
    setRegion(region);
  };
  
  const sendDirectSms = async (recvName, ownerName, recvTel, date) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: 'Freight25 App Sms Permission',
            message:
              'Freight25 App needs access to your inbox ' +
              'so you can send messages in background.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          DirectSms.sendDirectSms(
            recvTel,
            ownerName + '님이 보내신 배차가 완료되어 ' + recvName+ '님께 배달될 예정입니다! 도착예정시각은 ' + date.toString() +' 입니다.',
          );
          console.log('SMS sent successfully to ', recvTel);
        } else {
          console.log('SMS permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      console.log('Send message');
      console.log(recvTel);

      const url = `sms:${recvTel}${Platform.OS === 'ios' ? '&' : '?'}body=${
        ownerName + '님이 보내신 배차가 완료되어' + recvName+ '님께 배달될 예정입니다! 도착예정시각은 ' + date.toString() +' 입니다.'
      }`;
      Linking.openURL(url).catch((err) =>
        console.error('An error occurred', err),
      );
    }
  };

  const ClickApply = async () => {
    let date = new Date()
    date.setSeconds(date.getSeconds() + totalTime);

    const user = auth().currentUser;
    const value = await AsyncStorage.getItem('FreightID');
     
    if (user != null) {
      if (value != null) {
        var freightRef = firestore().collection('freights').doc(value);
        var driverRef = firestore().collection('drivers').doc(user.uid);
        var driver_data = (await driverRef.get()).data();
        var freight_data = (await freightRef.get()).data()
        var driverTel = driver_data.tel
        var recvName = freight_data.recvName
        var recvTel = freight_data.recvTel
        var ownerName = freight_data.ownerName
        console.log('target Freight ID:' + freightRef.id);
        try {
          freightRef.update({
            state: 1,
            driverId: user.uid,
            driverTel: driverTel,
            timeStampAssigned: new Date(),
            totalTime: date
          });
          console.log(
            'StopOver X ' + freightRef.id + ' was assigned to ' + user.uid,
          );
          
          Toast.showSuccess('화물이 정상적으로 배차되었습니다.');
          props.navigation.navigate(AppRoute.HOME);
          sendDirectSms(recvName, ownerName, recvTel, date)

        } catch {
          console.log('Failed assign to ' + freightRef.id);
        }
        //트랜잭션 추가
        var transRef = firestore().collection('transactions').doc();
        try{
          transRef.set({
            transactionId: transRef.id,
            driverId: user.uid,
            driverTel: driverTel,
            originalFreightId: value,
            stopoverFreightId: "",   
            totalExpense: "",
            totalDistance: "",
            timeStampAssigned: new Date(),
            totalTime: date
          })
          AsyncStorage.setItem('tsActId',transRef.id);
        }
        catch{
          console.log("Failed transaction to "+value);
        }
      }
    }
  };

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

  return (
    <React.Fragment>
      <ScrollView>
        <Layout>
          <Layout style={styles.MainInfo}>
            <Layout style={styles.MainInfoGeo}>
              <Layout>
                <Text style={styles.geoText}>
                  {data.startAddress[0]}
                </Text>
              </Layout>
              <Layout>
                <Text style={styles.geoText}>
                  {data.startAddress[1]}{' '}
                  {data.startAddress[2]}
                </Text>
              </Layout>
              <Layout>
                <Text style={styles.startType}>
                  {data.startType}
                </Text>
              </Layout>
            </Layout>
            <Layout style={styles.MainInfoIcon}>
              <Icon
                style={styles.icon}
                fill="black"
                name="arrow-forward-outline"
              />
              <Text style={styles.Type}>{data.Type}</Text>
            </Layout>
            <Layout style={styles.MainInfoGeo}>
              <Layout>
                <Text style={styles.geoText}>
                  {data.endAddress[0]}
                </Text>
              </Layout>
              <Layout>
                <Text style={styles.geoText}>
                  {data.endAddress[1]}{' '}
                  {data.endAddress[2]}
                </Text>
              </Layout>
              <Layout>
                <Text style={styles.endType}>{data.endType}</Text>
              </Layout>
            </Layout>
          </Layout>
          <Divider style={{backgroundColor: 'black'}} />
        </Layout>

        <TouchableOpacity onPress={hideMap}>
          <Layout>
            <Text style={styles.Title}> 배차 정보 (Tmap)</Text>
            <Divider style={{backgroundColor: 'black'}} />
          </Layout>
        </TouchableOpacity>
          <Layout style={{height: 200}}>
            <MapView
              region={region}
              style={{flex: 1}}
              provider={PROVIDER_GOOGLE}              
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}              
              onRegionChange={onRegionChange}>
              <Polyline
                coordinates={apiInfo}
                strokeColor="#2F80ED" // fallback for when `strokeColors` is not supported by the map-provider
                strokeWidth={6}
              />
            </MapView>
            <Divider style={{backgroundColor: 'black'}} />
          </Layout>

        <TouchableOpacity onPress={hideStopvoer}>
          <Layout>
            <Text style={styles.Title}> 경유지 정보</Text>
            <Divider style={{backgroundColor: 'black'}} />
          </Layout>
        </TouchableOpacity>

        <Divider style={{backgroundColor: 'black'}} />
        <Layout>
          <Text style={styles.Title}> 화물 상세 정보</Text>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>운행거리 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <Text style={styles.freightTitle}>
                {data.distanceY} Km
              </Text>
            </Layout>
          </Layout>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>운임 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <Text style={styles.freightTitle}>
                {data.moneyPrint}원
              </Text>
            </Layout>
          </Layout>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>차량정보 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <Text style={styles.freightTitle}>
                {data.carType} {data.carType2}
              </Text>
            </Layout>
          </Layout>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>화물정보 및 적재 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <Text style={styles.freightTitle}>
                {data.freightWeight}톤 /{' '}
                {data.freightSize}파렛
              </Text>
            </Layout>
          </Layout>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>적재방법 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <Text style={styles.freightTitle}>
                {data.loadType}
              </Text>
            </Layout>
          </Layout>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>상차지 상세주소 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <TextTicker
                style={(themeContext.theme == 'dark')? {fontWeight: 'bold', fontSize: 16, margin: 5,color: 'white'} : {fontWeight: 'bold', fontSize: 16, margin: 5,color: 'black'}}
                duration={3000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
              {data.startFull}
              </TextTicker>
            </Layout>
          </Layout>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>하차지 상세주소 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <TextTicker
                style={(themeContext.theme == 'dark')? {fontWeight: 'bold', fontSize: 16, margin: 5,color: 'white'} : {fontWeight: 'bold', fontSize: 16, margin: 5,color: 'black'}}
                duration={3000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
              {data.endFull}
              </TextTicker>
            </Layout>
          </Layout>
          <Layout style={{flexDirection: 'row'}}>
            <Layout style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={styles.freightTitle}>특이사항 : </Text>
            </Layout>
            <Layout style={{flex: 5, alignItems: 'center'}}>
              <Text style={styles.freightTitle}>{data.desc}</Text>
            </Layout>
          </Layout>
          <Divider style={{backgroundColor: 'black'}} />
        </Layout>

        <Divider style={{backgroundColor: 'black'}} />
        <Layout style={{flexDirection: 'row'}}>
          <Layout style={{flex: 3}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, margin: 5}}>
              {' '}
              스마트 확률
            </Text>
            <Layout
              style={{alignItems: 'flex-end', justifyContent: 'flex-start'}}>
              <Text
                style={{
                  margin: 2,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#BDBDBD',
                }}>
                {' '}
                {data.day}에 발생한 {data.endAddress[0]}지역의 화물 점유율{' '}
              </Text>
            </Layout>
          </Layout>
          <Layout
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Text style={{fontSize: 26, fontWeight: 'bold', lineHeight: 30}}>{data.smart}%</Text>
          </Layout>
          <Divider style={{backgroundColor: 'black'}} />
        </Layout>
      </ScrollView>

      <Divider style={{backgroundColor: 'black'}} />

      <Layout style={{flexDirection: 'row'}}>
        <Layout style={{flex: 5, justifyContent: 'center'}}>
          <Text style={styles.freightTitle}>
            {' '}
            운행거리 :   {data.distanceY}km{' '}
          </Text>
          <Text style={styles.freightTitle}>
            {' '}
            운행운임 :   {data.moneyPrint}원{' '}
          </Text>
        </Layout>
        <Layout
          style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
          <Button
            style={styles.button}
            status="success"
            onPress={ClickApply}>
            수 락
          </Button>
        </Layout>
      </Layout>
    </React.Fragment>
  );
}


const styles = StyleSheet.create({
  Title: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: 5,
  },
  MainInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  MainInfoGeo: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 2,
    flexDirection: 'column',
  },
  MainInfoGeo2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 2,
    flexDirection: 'row',
  },
  MainInfoType: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  MainInfoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  MainInfoType2: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  geoText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 26
  },
  icon: {
    width: 32,
    height: 28,
   
  },
  icon2: {
    justifyContent: 'center',
    width: 20,
    height: 15,
  },
  startType: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2F80ED',
  },
  Type: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#9B51E0',
  },
  endType: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#EB5757',
  },
  freightTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: 5,
  },
  button: {
    margin: 5,
  },
});
