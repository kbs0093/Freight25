import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  LayoutElement, 
  Divider,
  Select,
  Button,
  Input,  
} from '@ui-kitten/components';
import { SignupOwnerScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackActions, NavigationActions } from 'react-navigation';
import { CommonActions } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal'
import Postcode from 'react-native-daum-postcode'
import Toast from 'react-native-tiny-toast';

const serverUrl = 'http://49.50.162.128:8000/';

// Postcode API를 위한 URL선언
const tmap_FullTextGeocodingQueryUrl = 'https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result&appKey=';
const tmap_appKey = 'l7xx0b0704eb870a4fcab71e48967b1850dd';
const tmap_FullTextGeocodingURL_rest = '&coordType=WGS84GEO&fullAddr=';
const tmap_FullTextGeocodingUrl = tmap_FullTextGeocodingQueryUrl + tmap_appKey + tmap_FullTextGeocodingURL_rest;

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};



export const SignupOwnerScreen = (props: SignupOwnerScreenProps): LayoutElement => {
  const [nameInput, name] = React.useState('');
  const [accountOwnerInput, accountOwner] = React.useState('');
  
  const [manNumInput, manNum] = React.useState('');
  const [companyNameInput, companyName] = React.useState('');
  const [accountNumInput, accountNum] = React.useState('');
  const [phoneNumInput, phoneNum] = React.useState('');
  const [BankValue, setBankValue] = React.useState('');

  // Postcode API를 위한 변수들 선언
  const [modalAddAddrVisible, setmodalAddAddrVisible] = useState<boolean>(false);
  const [addrCompact, setAddrCompact] = useState<string>('상차지 설정');
  const [addrFull, setAddrFull] = useState<string>("");
  const [addr_lat, setAddr_lat] = useState<string>("");
  const [addr_lon, setAddr_lon] = useState<string>("");

  const [modalAddEndAddrVisible, setmodalAddEndAddrVisible] = useState<boolean>(false);
  const [endAddrCompact, setEndAddrCompact] = useState<string>("하차지 설정");
  const [endAddrFull, setEndAddrFull] = useState<string>("");
  const [endAddr_lat, setEndAddr_lat] = useState<string>("");
  const [endAddr_lon, setEndAddr_lon] = useState<string>("");

  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: AppRoute.SIGNUP}]
  });

  console.log(BankValue);

  const regOwner = () => {
    //분기화면이 생길 시 각 분기화면에서 타입에 맞게 처리되도록 해야 함
    //firebase jwt
    var accessToken;
    AsyncStorage.getItem('accessToken', (error,result)=>{
      if(error){
        console.log(error);
      }
      else{
        accessToken = result;
        axios
          .post(serverUrl+"verifyToken", {token: accessToken, type: "owners"})
          .then((response) => {
            let firebaseToken = JSON.stringify(response.data.firebase_token);
            auth().signInWithCustomToken(firebaseToken);
            //getProfile이 아닌 fb auth로부터 정보갱신해야할 것 같은데 논의가 필요합니다.
            //getProfile();
            AsyncStorage.setItem('fbToken', JSON.stringify(firebaseToken));
            console.log("currentAuth uid: "+auth().currentUser?.uid);

            //auth리스너와 uid를 이용한 db 저장 부분
            var authFlag = true;
            auth().onAuthStateChanged(function(user){
              if(authFlag){
                authFlag = false;
                if(user){
                  //현재 로그인된 auth 본인만 접근가능하도록 규칙테스트 완료
                  var ref = firestore().collection('owners').doc(user.uid);
                  if(user != null){
                    console.log("firestore target uid: "+auth().currentUser?.uid);
                    try {
                      ref.update({
                        name: nameInput,
                        accountOwner: accountNumInput,
  
                        companyNumber: manNumInput, 
                        account: accountNumInput, 
                        tel: phoneNumInput,
                        bankName: BankValue,
                        companyName: companyNameInput
                        });
                      Toast.showSuccess('회원가입이 완료되었습니다.');
                      props.navigation.navigate(AppRoute.OWNER);
                    } catch (error) {
                      //오류 toast 출력 혹은 뒤로 가기 필요할 것 같습니다.
                      console.log(error);
                      Toast.show('회원가입에 실패하였습니다.');
                    }
                  }
                }
              }
            });
          })
          .catch((error) => {
            //verifyToken Request가 실패하는 경우
            console.log(error);
          });  
      }
    });      
  };

    return (
        <React.Fragment>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <View>
            <Text style={{fontWeight: 'bold', fontSize: 20, margin: 10}}>화주 회원가입</Text>
            <Divider style={{backgroundColor: 'black'}}/>
          </View>
          <ScrollView>
          <View> 
            <Text style={styles.textStyle}>개인 정보</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>성 명 :</Text>
              </View>
              <View style={{flex: 3}}>
                <Input
                  style={styles.input}
                  placeholder='성명을 적어주세요'
                  size='small'
                  value={nameInput}
                  onChangeText={name}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>전화 번호 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Input
                  style={styles.input}
                  placeholder='-를 빼고 입력하세요'
                  size='small'
                  value={phoneNumInput}
                  onChangeText={phoneNum}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>사업자 등록번호 :</Text>
              </View>
              <View style={{flex: 3}}>
                <Input
                  style={styles.input}
                  placeholder='사업자 등록번호를 입력하세요'
                  size='small'
                  value={manNumInput}
                  onChangeText={manNum}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>업체명 :</Text>
              </View>
              <View style={{flex: 3}}>
                <Input
                  style={styles.input}
                  placeholder='업체명을 적어주세요'
                  size='small'
                  value={companyNameInput}
                  onChangeText={companyName}
                />
              </View>
            </View>            

            <Divider style={{backgroundColor: 'black'}}/>
          </View>

          <View> 
          <Text style={styles.textStyle}>자주 쓰는 상차/하차지 설정</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
              <Text style={styles.textStyle}>자주 쓰는 상차지 :</Text>
              </View>
              <View style={{flex: 2.3}}>
                <Text style={styles.textStyle}>{addrCompact}</Text>
              </View>
              <View style={{flex: 0.7}}>
                <Button 
                    appearance='outline' 
                    size='small'
                    onPress={() => {
                      setmodalAddAddrVisible(true);
                    }}
                    >입력
                </Button>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>자주 쓰는 하차지 :</Text>
              </View>
              <View style={{flex: 2.3}}>
                <Text style={styles.textStyle}>{endAddrCompact}</Text>
              </View>
              <View style={{flex: 0.7}}>
                <Button 
                    appearance='outline' 
                    size='small'
                    onPress={() => {
                      setmodalAddEndAddrVisible(true);
                    }}
                    >입력
                </Button>
              </View>
            </View>

            <Divider style={{backgroundColor: 'black'}}/>
          </View>

          <View style={{flex: 3}}> 
            <Text style={styles.textStyle}>계좌 정보</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>거래 은행 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <RNPickerSelect
                  onValueChange={(itemValue, itemIndex) => setBankValue(itemValue)}
                  placeholder={{
                    label: '은행을 선택하세요',
                    value: null,
                  }}
                  useNativeAndroidPickerStyle={false}
                  items={[
                    {label: '국민', value: 'kukmin'},
                    {label: '신한', value: 'shinhan'},
                    {label: '농협', value: 'nognhyeob'},
                  ]}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>계좌 번호 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Input
                  style={styles.input}
                  placeholder='-를 빼고 입력하세요'
                  size='small'
                  value={accountNumInput}
                  onChangeText={accountNum}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>예금주 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Input
                  style={styles.input}
                  placeholder='예금주를 입력하세요'
                  size='small'
                  value={accountOwnerInput}
                  onChangeText={accountOwner}
                />
              </View>
            </View>
            <Divider style={{backgroundColor: 'black'}}/>
          </View>
          
          <View style={{flex: 2,flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>            
              <Button style={{margin: 30}} status='danger' size='large' onPress={() => props.navigation.goBack()}>돌아가기</Button>
              <Button style={{margin: 30}} status='primary' size='large' onPress={regOwner}>회원가입</Button>
          </View>

          
          <Modal
            //isVisible Props에 State 값을 물려주어 On/off control
            isVisible={modalAddAddrVisible}
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
                onSelected={(addrResult) => {
                  let addrFull = JSON.stringify(addrResult.jibunAddress).replace(/\"/gi, "");
                  if (addrFull == ''){
                    addrFull = JSON.stringify(addrResult.autoJibunAddress).replace(/\"/gi, "");
                  }
                  setAddrFull(addrFull);
                  let addr = addrFull.split(' ', 3).join(' ');
                  setAddrCompact(addr);
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

                      setAddr_lat(lat);
                      setAddr_lon(lon);

                      console.log('startAddrCordVal :', lat, lon);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  setmodalAddAddrVisible(false)
                }}
              />
              <Button
                onPress={() => {
                  setmodalAddAddrVisible(false)
                }}>
              뒤로 돌아가기</Button>
            </View>
          </Modal>

          <Modal
            //isVisible Props에 State 값을 물려주어 On/off control
            isVisible={modalAddEndAddrVisible}
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
                onSelected={(addrResult) => {
                  let addrFull = JSON.stringify(addrResult.jibunAddress).replace(/\"/gi, "");
                  if (addrFull == ''){
                    addrFull = JSON.stringify(addrResult.autoJibunAddress).replace(/\"/gi, "");
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
                  setmodalAddEndAddrVisible(false)
                }}
              />
              <Button
                onPress={() => {
                  setmodalAddEndAddrVisible(false)
                }}>
              뒤로 돌아가기</Button>
            </View>
          </Modal>


          </ScrollView>


        </React.Fragment>
    );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: 'bold', 
    fontSize: 18, 
    margin: 8
  },
  detailTitle: {
    flex: 2,
    flexDirection: 'row', 
    alignItems:'center',
    justifyContent: 'flex-end'
  },
  input: {
    flex: 1,
    margin: 2,
  },
});