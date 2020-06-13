import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {
  Icon,
  Divider,
  Button,
} from '@ui-kitten/components';
import MapView, {PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import {DetailScreenProps} from '../../navigation/search.navigator';
import {AppRoute} from '../../navigation/app-routes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-tiny-toast';

export class DetailScreen extends React.Component<DetailScreenProps> {
  constructor(props) {
    super(props);
    this.state = {
      apiInfo: [],
      mapVisible: true,
      stopoverVisible: true,
      FreightID: null,
      totalTime: null,
      data: {
        startAddress: [],
        endAddress: [],
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        startType: null,
        endType: null,
        Type: null,
        carType: null,
        carType2: null,
        freightSize: null,
        freightWeight: null,
        loadType: null,
        distanceY: null,
        time: null,
        smart: null,
        money: null,
        moneyPrint: null,
        isShowLocation: false,
        desc: null,
      },
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('FreightID');
      if (value !== null) {
        this.setState({FreightID: value});
      }
    } catch (error) {
      console.log(error)
    }

    var user = auth().currentUser;
    const that = this;
    var week = new Array('일요일','월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
    var date = new Date();
    var dayName = week[date.getDay()];

    if (user != null) {
      var docRef = firestore().collection('freights').doc(this.state.FreightID);

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
          await that.RegionCode(endArr[0]).then((result)=>{smart = result});

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
            isShowLocation: true,
            desc: doc.data().desc,
            day: dayName,
          };

          var region = {
            latitude: Number(doc.data().startAddr_lat),
            longitude: Number(doc.data().startAddr_lon),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          that.onRegionChange(region);
          that.setState({data: detaildata});

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
              that.setState({apiInfo: coordinates});
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
                that.setState({totalTime: jsonData.features[0].properties.totalTime});
              });


        } else {
          console.log('No such document!');
        }
      });
    }
  };

  hideMap = () => {
    if (this.state.mapVisible) {
      this.setState({mapVisible: false});
    } else {
      this.setState({mapVisible: true});
    }
  };

  hideStopvoer = () => {
    if (this.state.stopoverVisible) {
      this.setState({stopoverVisible: false});
    } else {
      this.setState({stopoverVisible: true});
    }
  };

  onRegionChange = (region) => {
    this.setState({region});
  };

  ClickApply = async () => {
    let date = new Date()
    date.setSeconds(date.getSeconds() + this.state.totalTime);

    const user = auth().currentUser;
    const value = await AsyncStorage.getItem('FreightID');
     
    if (user != null) {
      if (value != null) {
        var freightRef = firestore().collection('freights').doc(value);
        var driverRef = firestore().collection('drivers').doc(user.uid);
        var driverTel = (await driverRef.get()).data().tel;
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
          
          if(this.state.data.Type == '혼적'){
            this.props.navigation.navigate(AppRoute.STOPOVERAD);
          } else{
            Toast.showSuccess('화물이 정상적으로 배차되었습니다.');
            this.props.navigation.navigate(AppRoute.HOME);
          }
          
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

  RegionCode = async(address) =>{
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

  render() {
    return (
      <React.Fragment>
        <ScrollView>
          <View style={{backgroundColor: 'white'}}>
            <View style={styles.MainInfo}>
              <View style={styles.MainInfoGeo}>
                <View>
                  <Text style={styles.geoText}>
                    {this.state.data.startAddress[0]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.geoText}>
                    {this.state.data.startAddress[1]}{' '}
                    {this.state.data.startAddress[2]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.startType}>
                    {this.state.data.startType}
                  </Text>
                </View>
              </View>
              <View style={styles.MainInfoIcon}>
                <Icon
                  style={styles.icon}
                  fill="black"
                  name="arrow-forward-outline"
                />
                <Text style={styles.Type}>{this.state.data.Type}</Text>
              </View>
              <View style={styles.MainInfoGeo}>
                <View>
                  <Text style={styles.geoText}>
                    {this.state.data.endAddress[0]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.geoText}>
                    {this.state.data.endAddress[1]}{' '}
                    {this.state.data.endAddress[2]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.endType}>{this.state.data.endType}</Text>
                </View>
              </View>
            </View>
            <Divider style={{backgroundColor: 'black'}} />
          </View>

          <TouchableOpacity onPress={this.hideMap}>
            <View style={{backgroundColor: 'white'}}>
              <Text style={styles.Title}> 배차 정보 (Tmap)</Text>
              <Divider style={{backgroundColor: 'black'}} />
            </View>
          </TouchableOpacity>
          {this.state.data.isShowLocation ? (
            <View style={{height: 200, backgroundColor: 'white'}}>
              <MapView
                style={{flex: 1}}
                provider={PROVIDER_GOOGLE}
                initialRegion={this.state.region}
                onRegionChange={this.onRegionChange}>
                <Polyline
                  coordinates={this.state.apiInfo}
                  strokeColor="#2F80ED" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={6}
                />
              </MapView>
              <Divider style={{backgroundColor: 'black'}} />
            </View>
          ) : null}

          <TouchableOpacity onPress={this.hideStopvoer}>
            <View style={{backgroundColor: 'white'}}>
              <Text style={styles.Title}> 경유지 정보</Text>
              <Divider style={{backgroundColor: 'black'}} />
            </View>
          </TouchableOpacity>

          <Divider style={{backgroundColor: 'black'}} />
          <View style={{backgroundColor: 'white'}}>
            <Text style={styles.Title}> 화물 상세 정보</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>운행거리 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>
                  {this.state.data.distanceY} Km
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>운임 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>
                  {this.state.data.moneyPrint}원
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>차량정보 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>
                  {this.state.data.carType} {this.state.data.carType2}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>화물정보 및 적재 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>
                  {this.state.data.freightWeight}톤 /{' '}
                  {this.state.data.freightSize}파렛
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>적재방법 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>
                  {this.state.data.loadType}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>상차지 상세주소 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>
                  {this.state.data.startFull}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>하차지 상세주소 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>
                  {this.state.data.endFull}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text style={styles.freightTitle}>특이사항 : </Text>
              </View>
              <View style={{flex: 5, alignItems: 'center'}}>
                <Text style={styles.freightTitle}>{this.state.data.desc}</Text>
              </View>
            </View>
            <Divider style={{backgroundColor: 'black'}} />
          </View>

          <Divider style={{backgroundColor: 'black'}} />
          <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
            <View style={{flex: 3}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, margin: 5}}>
                {' '}
                스마트 확률
              </Text>
              <View
                style={{alignItems: 'flex-end', justifyContent: 'flex-start'}}>
                <Text
                  style={{
                    margin: 2,
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#BDBDBD',
                  }}>
                  {' '}
                  {this.state.data.day}에 발생한 {this.state.data.endAddress[0]}지역의 화물 점유율{' '}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text style={{fontSize: 26, fontWeight: 'bold'}}>{this.state.data.smart}%</Text>
            </View>
            <Divider style={{backgroundColor: 'black'}} />
          </View>
        </ScrollView>

        <Divider style={{backgroundColor: 'black'}} />

        <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
          <View style={{flex: 5, justifyContent: 'center'}}>
            <Text style={styles.freightTitle}>
              {' '}
              운행거리 :   {this.state.data.distanceY}km{' '}
            </Text>
            <Text style={styles.freightTitle}>
              {' '}
              운행운임 :   {this.state.data.moneyPrint}원{' '}
            </Text>
          </View>
          <View
            style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
            <Button
              style={styles.button}
              status="success"
              onPress={this.ClickApply}>
              수 락
            </Button>
          </View>
        </View>
      </React.Fragment>
    );
  }
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
  },
  icon: {
    width: 32,
    height: 24,
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
