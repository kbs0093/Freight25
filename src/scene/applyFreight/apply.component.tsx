import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  LayoutElement, TopNavigation,
  Button, Layout, Input, DateService,
} from '@ui-kitten/components';

import Modal from 'react-native-modal'
import Postcode from 'react-native-daum-postcode'
import { ApplyScreenProps } from '../../navigation/apply.navigator';
import { AppRoute } from '../../navigation/app-routes';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const tmap_FullTextGeocodingQueryUrl = 'https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result&appKey=';
const tmap_appKey = 'l7xx0b0704eb870a4fcab71e48967b1850dd';
const tmap_URL_rest = '&coordType=WGS84GEO&fullAddr=';

const tmap_distCalcQueryUrl = 'https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=response&appKey=';
const tmap_distCalcUrl = tmap_distCalcQueryUrl + tmap_appKey;
const tmap_FullTextGeocodingUrl = tmap_FullTextGeocodingQueryUrl + tmap_appKey + tmap_URL_rest;

const carSize = [
  { label: '1 톤', value: '1 톤'},
  { label: '1.4 톤', value: '1.4 톤' },
  { label: '2.5 톤' ,value: '2.5 톤'},
  { label: '5 톤' ,value: '5 톤'},
  { label: '11-15 톤' ,value: '11-15 톤'},
  { label: '18 톤' ,value: '18 톤'},
  { label: '25 톤' ,value: '25 톤'},
];
const carType = [
  { label: '카고' ,value: '카고'},
  { label: '탑차' ,value: '탑차'},
  { label: '냉동' ,value: '냉동'},
  { label: '냉장' ,value: '냉장'},
];
const driveType = [
  { label: '독차',value: '독차'},
  { label: '혼적',value: '혼적'},
];

const freightType = [
  { label: '파레트',value: '파레트'},
];

const freightStartDate = [
  { label: '당일 상차(당상)', value: '당일 상차(당상)'},
  { label: '내일 상차(내상)', value: '내일 상차(내상)'},
]

const freightEndDate = [
  { label: '당일 도착(당착)', value: '당일 도착(당착)'},
  { label: '내일 도착(내착)', value: '내일 도착(내착)'},
]
export const ApplyScreen = (props: ApplyScreenProps): LayoutElement => {

  const [selectedCarSize, setSelectedCarSize] = React.useState(null);
  const [selectedCarType, setSelectedCarType] = React.useState(null);
  const [selectedDrive, setSelectedDrive] = React.useState(null);
  
  const [weightValue, setWeightValue] = React.useState('');
  const [volumeValue, setVolumeValue] = React.useState('');
  //Select
  const [selectedFreightType, setSelectedFreightType] = React.useState(null);

  const [freightLoadTypeValue, setFreightLoadTypeValue] = React.useState('');
  const [descValue, setDescValue] = React.useState('');

  const [distValue, setDistValue] = React.useState('');
  const [expenseValue, setExpenseValue] = React.useState('');

  //State를 이용하여 Modal을 제어함
  const [modalStartAddrVisible, setmodalStartAddrVisible] = useState<boolean>(false);
  const [modalEndAddrVisible, setmodalEndAddrVisible] = useState<boolean>(false);

  //Address의 간략한 버전 + Modal의 Output
  const [startAddrCompact, setStartAddrCompact] = useState<string>("주소를 선택/변경해주세요");
  const [endAddrCompact, setEndAddrCompact] = useState<string>("주소를 선택/변경해주세요");

  //Address의 Full 버젼 (도로명주소로 한다)
  const [startAddrFull, setStartAddrFull] = useState<string>("");
  const [endAddrFull, setEndAddrFull] = useState<string>("");

  const [startAddr_lat, setStartAddr_lat] = useState<string>("");
  const [startAddr_lon, setStartAddr_lon] = useState<string>("");

  const [endAddr_lat, setEndAddr_lat] = useState<string>("");
  const [endAddr_lon, setEndAddr_lon] = useState<string>("");

  // Select - 당상/내상/당착/내착
  const [selectedStartDate, setSelectedStartDate] = React.useState(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState(null);

  //화물 db에 등록
  const applyFreightToDb = () => {
    var user = auth().currentUser;
      if(user != null){
        //현재 로그인된 auth가 존재하는 경우만 접근가능하도록 규칙테스트 완료
        var ref = firestore().collection('freights');
        if(user != null){
          try {
            ref.add({
              ownerId: auth().currentUser?.uid,
              carSize: selectedCarSize,
              carType: selectedCarType,
              driveOption: selectedDrive,
              weight: weightValue,
              voluem: volumeValue,
              freightType: selectedFreightType,
              freightLoadType: freightLoadTypeValue,
              desc: descValue,
              dist: distValue,
              expense: expenseValue,
              startAddr: startAddrCompact,
              startAddr_lat: startAddr_lat,
              startAddr_lon: startAddr_lon,
              startDate: selectedStartDate,
              endAddr: endAddrCompact,
              endAddr_lat: endAddr_lat,
              endAddr_lon: endAddr_lon,
              endDate: selectedEndDate,
              timeStamp: Date.now()
              });
              props.navigation.navigate(AppRoute.OWNER);
              console.log(auth().currentUser?.uid + ' Added document with ID: '+ref.id+Date.now());
          } catch (error) {
            //오류 출력 
            console.log(error);
          }
        }
      }
  };

  // Calculate distance between startAddr and endAddr
  const calcDist = () => {
    let tmap_distCalcUrl_rest = `&startX=${startAddr_lon}&startY=${startAddr_lat}&endX=${endAddr_lon}&endY=${endAddr_lat}&truckType=1&truckWidth=100&truckHeight=100&truckWeight=35000&truckTotalWeight=35000&truckLength=200`
    axios.post(tmap_distCalcUrl + tmap_distCalcUrl_rest)
      .then((response) => {
        let tmapdist_response = JSON.stringify(response.request._response)
        tmapdist_response = tmapdist_response.substring(1, tmapdist_response.length - 1) // 따옴표 삭제
        tmapdist_response = tmapdist_response.replace(/\\/gi, "") // '\'문자 replaceall
        tmapdist_response = JSON.parse(tmapdist_response)

        let tmapprops = tmapdist_response.features[0].properties
        let tmapdist_km = tmapprops.totalDistance/1000
        let tmaptime_min = tmapprops.totalTime/60
        console.log("tmap dist :", tmapdist_km, "Km");
        console.log("tmap time :", tmaptime_min, "분");
        setDistValue(tmapdist_km+"")
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <TopNavigation
        title="화물 25"
        titleStyle={styles.titleStyles}
      />
      <ScrollView>
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>위치 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>상차지 : {startAddrCompact}</Text>
            <Button 
              appearance='outline' 
              size='small'
              onPress={() => {
                setmodalStartAddrVisible(true);
              }}
            >변경</Button>
          </View>
          <View style={styles.rowContainerWithLine}>
            <Text style={styles.infoTitle}>상차일 : </Text>
            <View style={{flex:3}}>
              <RNPickerSelect
                onValueChange={(itemValue, itemIndex) => 
                  setSelectedStartDate(itemValue)  
                }
                placeholder={{
                  label: '상차일을 선택하세요',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                items={freightStartDate}
              />
            </View>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>하차지 : {endAddrCompact}</Text>
            <Button 
              appearance='outline'
              size='small'
              onPress={() => {
                setmodalEndAddrVisible(true);
              }}
            >변경</Button>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>하차일 : </Text>
            <View style={{flex:3}}>
              <RNPickerSelect
                onValueChange={(itemValue, itemIndex) => 
                  setSelectedEndDate(itemValue)  
                }
                placeholder={{
                  label: '하차일을 선택하세요',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                items={freightEndDate}
              />
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>화물 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>차량 정보 : </Text>
            <View style={{flex:3}}>
              <RNPickerSelect
                onValueChange={(itemValue, itemIndex) => 
                  setSelectedCarSize(itemValue)  
                }
                placeholder={{
                  label: '톤수',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                items={carSize}
              />
            </View>
            <View style={{flex:3}}>
              <RNPickerSelect
                onValueChange={(itemValue, itemIndex) => 
                  setSelectedCarType(itemValue)  
                }
                placeholder={{
                  label: '타입',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                items={carType}
              />
            </View>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>운행 방식 : </Text>
            <View style={{flex:3}}>
              <RNPickerSelect
                onValueChange={(itemValue, itemIndex) => 
                  setSelectedDrive(itemValue)  
                }
                placeholder={{
                  label: '독차/혼적 여부 선택',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                items={driveType}
              />
            </View>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 무게 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='화물 무게를 입력하세요'
                value={weightValue}
                onChangeText={nextValue => setWeightValue(nextValue)}
              />
            </Layout>
            <Text style={styles.infoTitle}> 톤</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 크기 : </Text>
            <Input
              placeholder='숫자로 입력'
              value={volumeValue}
              onChangeText={nextValue => setVolumeValue(nextValue)}
            />
            <View style={{flex:3}}>
              <RNPickerSelect
                onValueChange={(itemValue, itemIndex) => 
                  setSelectedFreightType(itemValue)  
                }
                placeholder={{
                  label: '단위',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                items={freightType}
              />
            </View>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>적재 방식 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='ex) 지게차 / 기사 인력 필요'
                value={freightLoadTypeValue}
                onChangeText={nextValue => setFreightLoadTypeValue(nextValue)}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 설명 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='화물 설명을 입력하세요'
                value={descValue}
                onChangeText={nextValue => setDescValue(nextValue)}
              />
            </Layout>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>요금 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>총 운행거리 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='수동입력'
                value={distValue}
                onChangeText={nextValue => setDistValue(nextValue)}
              />
            </Layout>
            <Text style={styles.infoTitle}>km</Text>
            <Button onPress={calcDist} >자동계산</Button>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>요금 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='화물 요금을 입력하세요'
                value={expenseValue}
                onChangeText={nextValue => setExpenseValue(nextValue)}
              />
            </Layout>

            <Text style={styles.infoTitle}> 원</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>지불 : 인수증</Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>상차지 반경 30km 내에 00대의 차량이 있습니다</Text>
          
          <View style={styles.buttonsContainer}>
            <Button style={styles.IconButton} status='danger'>취소</Button>
            <Button style={styles.IconButton} onPress={applyFreightToDb} >등록</Button>
          </View>
        </View>

        <Modal
          //isVisible Props에 State 값을 물려주어 On/off control
          isVisible={modalStartAddrVisible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <View>
            <Postcode
              style={{width: 350, height: 600}}
              jsOptions={{ animated: true }}
              onSelected={(startAddrResult) => {
                let addrFull = JSON.stringify(startAddrResult.jibunAddress).replace(/\"/gi, "");
                if (addrFull == ''){
                  addrFull = JSON.stringify(startAddrResult.autoJibunAddress).replace(/\"/gi, "");
                }
                setStartAddrFull(addrFull);
                console.log('addrFull :', addrFull);
                let addr = addrFull.split(' ', 3).join(' ');
                setStartAddrCompact(addr);
                axios
                  .get(tmap_FullTextGeocodingUrl + addrFull)
                  .then((responseJSON) => {
                    let tmapResponse = JSON.stringify(responseJSON.request._response)
                    tmapResponse = tmapResponse.substring(1, tmapResponse.length - 1) // 따옴표 삭제
                    tmapResponse = tmapResponse.replace(/\\/gi, "") // '\'문자 replaceall
                    tmapResponse = JSON.parse(tmapResponse)

                    let coordinate = tmapResponse.coordinateInfo.coordinate[0]
                    let lat = JSON.stringify(coordinate.lat).replace(/\"/gi, "") //latitude 위도
                    let lon = JSON.stringify(coordinate.lon).replace(/\"/gi, "") //longitude 경도

                    console.log('상차지 주소 :', addrFull)
                    console.log('변환된 위도 :', lat);
                    console.log('변환된 경도 :', lon);

                    setStartAddr_lat(lat);
                    setStartAddr_lon(lon);
                        
                    console.log('startAddrCordVal :', lat, lon);
                    
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                setmodalStartAddrVisible(false)
              }}
            />
            <Button
              onPress={() => {
                setmodalStartAddrVisible(false)
              }}>
            뒤로 돌아가기</Button>
          </View>
        </Modal>

        <Modal
          //isVisible Props에 State 값을 물려주어 On/off control
          isVisible={modalEndAddrVisible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <View>
            <Postcode
              style={{width: 350, height: 600}}
              jsOptions={{ animated: true }}
              onSelected={(endAddrResult) => {
                let addrFull = JSON.stringify(endAddrResult.jibunAddress).replace(/\"/gi, "");
                if (addrFull == ''){
                  addrFull = JSON.stringify(endAddrResult.autoJibunAddress).replace(/\"/gi, "");
                }
                setEndAddrFull(addrFull);
                let addr = addrFull.split(' ', 3).join(' ');
                setEndAddrCompact(addr);
                axios
                  .get(tmap_FullTextGeocodingUrl + addrFull)
                  .then((responseJSON) => {
                    let tmapResponse = JSON.stringify(responseJSON.request._response)
                    tmapResponse = tmapResponse.substring(1, tmapResponse.length - 1) // 따옴표 삭제
                    tmapResponse = tmapResponse.replace(/\\/gi, "") // '\'문자 replaceall
                    tmapResponse = JSON.parse(tmapResponse)

                    let coordinate = tmapResponse.coordinateInfo.coordinate[0]
                    let lat = JSON.stringify(coordinate.lat).replace(/\"/gi, "") //latitude 위도
                    let lon = JSON.stringify(coordinate.lon).replace(/\"/gi, "") //longitude 경도

                    console.log('하차지 주소 :', addrFull)
                    console.log('변환된 위도 :', lat);
                    console.log('변환된 경도 :', lon);

                    setEndAddr_lat(lat);
                    setEndAddr_lon(lon);

                    console.log('endAddrCordVal :', lat, lon);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                setmodalEndAddrVisible(false)
              }}
            />
            <Button
              onPress={() => {
                setmodalEndAddrVisible(false)
              }}>
            뒤로 돌아가기</Button>
          </View>
        </Modal>

        

      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  IconButton: {
    width: 150,
    height: 50,
    margin: 10,
  },
  descInputHolder: {
    width: 250,
    height: 50,
    margin: 10,
  },
  selectContainer:{
    flex: 1,
  },
  titleStyles: {
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainerWithLine: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems:'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignItems: 'flex-start',
    borderColor: '#20232a',
    borderWidth: 1,
    justifyContent: 'space-between',
  },

  infoTitle: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    //fontSize: RFPercentage(2),
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
  },

  lineStyle:{
    borderWidth: 0.5,
    borderColor:'black',
    margin:10,
  },

  
});

