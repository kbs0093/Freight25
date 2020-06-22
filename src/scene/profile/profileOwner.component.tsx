import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  LayoutElement,
  Divider,
  Select,
  Button,
  styled,
  Icon,
  Layout,
  Input,
} from '@ui-kitten/components';
import {ProfileOwnerScreenProps} from '../../navigation/profile.navigator';
import {MainScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';
import {
  BackIcon,
  MenuIcon,
  InfoIcon,
  LogoutIcon,
  MAPIcon,
  PHONEIcon,
  NOTEIcon,
} from '../../assets/icons';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-tiny-toast';
import axios from 'axios';
import {Value} from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import KakaoLogins from '@react-native-seoul/kakao-login';
import {CommonActions} from '@react-navigation/native';
import {ThemeContext} from '../../component/theme-context';

const resetAction = CommonActions.reset({
  index: 0,
  routes: [{name: AppRoute.AUTH}],
});
import Modal from 'react-native-modal';
import Postcode from 'react-native-daum-postcode';

// Postcode API를 위한 URL선언
const tmap_FullTextGeocodingQueryUrl =
  'https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result&appKey=';
const tmap_appKey = 'l7xx0b0704eb870a4fcab71e48967b1850dd';
const tmap_FullTextGeocodingURL_rest = '&coordType=WGS84GEO&fullAddr=';
const tmap_FullTextGeocodingUrl =
  tmap_FullTextGeocodingQueryUrl + tmap_appKey + tmap_FullTextGeocodingURL_rest;

export const ProfileOwnerScreen = (
  props: ProfileOwnerScreenProps,
): LayoutElement => {
  const [BankValue, setBankValue] = React.useState('');
  const [nameInput, name] = React.useState('');
  const [phoneNumInput, phoneNum] = React.useState('');
  const [accountNumInput, accountNum] = React.useState('');
  const [accountOwnerInput, accountOwner] = React.useState('');
  const [manNumInput, manNum] = React.useState('');
  const [companyNameInput, companyName] = React.useState('');

  const [modalAddAddrVisible, setmodalAddAddrVisible] = useState<boolean>(
    false,
  );
  const [addrCompact, setAddrCompact] = useState<string>('');
  const [addrFull, setAddrFull] = useState<string>('');
  const [addr_lat, setAddr_lat] = useState<string>('');
  const [addr_lon, setAddr_lon] = useState<string>('');

  const [modalAddEndAddrVisible, setmodalAddEndAddrVisible] = useState<boolean>(
    false,
  );
  const [endAddrCompact, setEndAddrCompact] = useState<string>('');
  const [endAddrFull, setEndAddrFull] = useState<string>('');
  const [endAddr_lat, setEndAddr_lat] = useState<string>('');
  const [endAddr_lon, setEndAddr_lon] = useState<string>('');

  const [lock, setLock] = React.useState(0);
  const [userID, setUserID] = React.useState('');

  const themeContext = React.useContext(ThemeContext);

  useEffect(() => {
    AsyncStorage.getItem('fbToken').then((value) => {
      if (value) {
        auth().onAuthStateChanged(function (user) {
          if (user) {
            setUserID(user.uid);
          } else {
          }
        });
      }
    });
  });

  const getDB = () => {
    if (userID) {
      var ref = firestore().collection('owners').doc(userID);
      ref.get().then(function (doc) {
        if (doc.exists) {
          // Get the information from driver
          const docs = doc.data();
          setBankValue(docs.bankName);
          name(docs.name);
          phoneNum(docs.tel);
          accountNum(docs.account);
          accountOwner(docs.accountOwner);
          manNum(docs.companyNumber);
          companyName(docs.companyName);
          setAddrCompact(docs.savedStartCompact);
          setEndAddrCompact(docs.savedEndCompact);
        }
      });
      setLock(1);
    }
  };

  if (lock == 0) {
    getDB();
  }

  const withdrawHandler = async () => {
    var user = auth().currentUser;
    var ref = firestore().collection('owners').doc(user?.uid);
    var refFreight = firestore()
      .collection('freights')
      .where('ownerId', '==', user?.uid);

    refFreight.get().then(function (doc) {
      if (doc.size == 0) {
        try {
          ref.delete().then(() => {
            console.log('1. ' + user?.uid + ' 탈퇴 시작');

            user?.delete().then(async () => {
              await KakaoLogins.logout().then((result) => {
                console.log(`2. Kakao Logout Finished:${result}`);
              });

              AsyncStorage.clear().then(() => {
                console.log('3. AsyncStorage 초기화 완료');
                withdrawAlertHandler();
              });
            });
          });
        } catch {
          (error) => {
            Toast.show('탈퇴가 실패하였습니다.');
            console.log(error);
          };
        }
      } else {
        Toast.show('기존에 등록된 화물이 존재합니다');
      }
    });
  };

  const withdrawAlertHandler = () => {
    console.log('4. 탈퇴 완료');
    Alert.alert('탈퇴가 완료되었습니다.');
    props.navigation.dispatch(resetAction);
  };

  const _twoOptionAlertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '화주 회원 탈퇴',
      //body
      '정말로 탈퇴를 하시겠어요?',
      [
        {text: '네', onPress: () => withdrawHandler()},
        {
          text: '취소',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  const reviseProfile = () => {
    var user = auth().currentUser?.uid;
    var ref = firestore().collection('owners').doc(user);
    if (user != null) {
      console.log('firestore target uid: ' + auth().currentUser?.uid);
      try {
        if (BankValue != null) {
          ref.update({bankName: BankValue});
        }
        ref.update({
          name: nameInput,
          tel: phoneNumInput,
          companyNumber: manNumInput,
          companyName: companyNameInput,
          account: accountNumInput,
          accountOwner: accountNumInput,

          // TODO: Need to add Favorite address
          savedStartCompact: addrCompact,
          savedStartFull: addrFull,
          savedStartlat: addr_lat,
          savedStartlon: addr_lon,
          savedEndCompact: endAddrCompact,
          savedEndFull: endAddrFull,
          savedEndLat: endAddr_lat,
          savedEndLon: endAddr_lon,
        });
      } catch (error) {
        console.log(error);
        Toast.show('수정 실패');
      }
    }
  };

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <ScrollView
        style={
          themeContext.theme == 'dark'
            ? {backgroundColor: '#222B45'}
            : {backgroundColor: '#FFFFFF'}
        }>
        <Layout style={styles.titleContainer}>
          <Text style={styles.Subtitle}>화주 정보 수정</Text>
          <Button
            onPress={() => {
              reviseProfile();
              Toast.showSuccess('수정 완료');
              props.navigation.navigate(AppRoute.HOME);
            }}
            style={styles.Button}
            textStyle={styles.ButtonText}>
            수정
          </Button>
        </Layout>

        <Layout style={styles.infoContainer}>
          <Text style={styles.Subtitle}>개인 정보</Text>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>성 명: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="성명을 적어주세요"
                value={nameInput}
                onChangeText={name}
              />
            </Layout>
          </Layout>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>전화 번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="-를 빼고 입력하세요"
                value={phoneNumInput}
                onChangeText={phoneNum}
              />
            </Layout>
          </Layout>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>사업자등록번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="사업자 등록번호를 입력하세요"
                value={manNumInput}
                onChangeText={manNum}
              />
            </Layout>
          </Layout>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>업체명: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="업체명을 적어주세요"
                value={companyNameInput}
                onChangeText={companyName}
              />
            </Layout>
          </Layout>
        </Layout>
        <Divider style={{backgroundColor: 'black'}} />

        <Layout style={styles.infoContainer}>
          <Text style={styles.Subtitle}>자주 쓰는 상차 / 하차지 설정</Text>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>상차지: </Text>
            <Layout style={{flex: 2.3}}>
              <Text style={styles.textStyle}>{addrCompact}</Text>
            </Layout>
            <Layout style={{flex: 0.7}}>
              <Button
                appearance="outline"
                size="small"
                onPress={() => {
                  setmodalAddAddrVisible(true);
                }}>
                변경
              </Button>
            </Layout>
          </Layout>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>하차지: </Text>
            <Layout style={{flex: 2.3}}>
              <Text style={styles.textStyle}>{endAddrCompact}</Text>
            </Layout>
            <Layout style={{flex: 0.7}}>
              <Button
                appearance="outline"
                size="small"
                onPress={() => {
                  setmodalAddEndAddrVisible(true);
                }}>
                변경
              </Button>
            </Layout>
          </Layout>
        </Layout>
        <Divider style={{backgroundColor: 'black'}} />

        <Layout style={styles.infoContainer}>
          <Text style={styles.Subtitle}>계좌 정보</Text>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>거래 은행 : </Text>
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
          </Layout>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>계좌 번호 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="-를 뺴고 입력하세요"
                value={accountNumInput}
                onChangeText={accountNum}
              />
            </Layout>
          </Layout>
          <Layout style={styles.rowContainer}>
            <Text style={styles.infoTitle}>예금주 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="예금주를 적어주세요"
                value={accountOwnerInput}
                onChangeText={accountOwner}
              />
            </Layout>
          </Layout>
        </Layout>

        <Layout style={styles.withdrawContainer}>
          <Button
            onPress={() => {
              try {
                _twoOptionAlertHandler();
              } catch (error) {
                console.log('Failed to withdraw');
                Toast.show('탈퇴 실패');
              }
            }}
            status="danger"
            style={styles.withdrawButton}
            textStyle={styles.withdrawButtonText}>
            회원 탈퇴
          </Button>
        </Layout>

        <Modal
          //isVisible Props에 State 값을 물려주어 On/off control
          isVisible={modalAddAddrVisible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <Layout>
            <Postcode
              style={{width: 350, height: 600}}
              jsOptions={{animated: true}}
              onSelected={(addrResult) => {
                let addrFull = JSON.stringify(addrResult.jibunAddress).replace(
                  /\"/gi,
                  '',
                );
                if (addrFull == '') {
                  addrFull = JSON.stringify(
                    addrResult.autoJibunAddress,
                  ).replace(/\"/gi, '');
                }
                setAddrFull(addrFull);
                let addr = addrFull.split(' ', 3).join(' ');
                setAddrCompact(addr);
                axios
                  .get(tmap_FullTextGeocodingUrl + addrFull)
                  .then((responseJSON) => {
                    let tmapResponse = JSON.stringify(
                      responseJSON.request._response,
                    );
                    tmapResponse = tmapResponse.substring(
                      1,
                      tmapResponse.length - 1,
                    ); // 따옴표 삭제
                    tmapResponse = tmapResponse.replace(/\\/gi, ''); // '\'문자 replaceall
                    tmapResponse = JSON.parse(tmapResponse);

                    let coordinate = tmapResponse.coordinateInfo.coordinate[0];
                    let lat = JSON.stringify(coordinate.lat).replace(
                      /\"/gi,
                      '',
                    ); //latitude 위도
                    let lon = JSON.stringify(coordinate.lon).replace(
                      /\"/gi,
                      '',
                    ); //longitude 경도

                    console.log('하차지 주소 :', addrFull);
                    console.log('변환된 위도 :', lat);
                    console.log('변환된 경도 :', lon);

                    setAddr_lat(lat);
                    setAddr_lon(lon);

                    console.log('startAddrCordVal :', lat, lon);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                setmodalAddAddrVisible(false);
              }}
            />
            <Button
              onPress={() => {
                setmodalAddAddrVisible(false);
              }}>
              뒤로 돌아가기
            </Button>
          </Layout>
        </Modal>

        <Modal
          //isVisible Props에 State 값을 물려주어 On/off control
          isVisible={modalAddEndAddrVisible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <Layout>
            <Postcode
              style={{width: 350, height: 600}}
              jsOptions={{animated: true}}
              onSelected={(addrResult) => {
                let addrFull = JSON.stringify(addrResult.jibunAddress).replace(
                  /\"/gi,
                  '',
                );
                if (addrFull == '') {
                  addrFull = JSON.stringify(
                    addrResult.autoJibunAddress,
                  ).replace(/\"/gi, '');
                }
                setEndAddrFull(addrFull);
                let addr = addrFull.split(' ', 3).join(' ');
                setEndAddrCompact(addr);
                axios
                  .get(tmap_FullTextGeocodingUrl + addrFull)
                  .then((responseJSON) => {
                    let tmapResponse = JSON.stringify(
                      responseJSON.request._response,
                    );
                    tmapResponse = tmapResponse.substring(
                      1,
                      tmapResponse.length - 1,
                    ); // 따옴표 삭제
                    tmapResponse = tmapResponse.replace(/\\/gi, ''); // '\'문자 replaceall
                    tmapResponse = JSON.parse(tmapResponse);

                    let coordinate = tmapResponse.coordinateInfo.coordinate[0];
                    let lat = JSON.stringify(coordinate.lat).replace(
                      /\"/gi,
                      '',
                    ); //latitude 위도
                    let lon = JSON.stringify(coordinate.lon).replace(
                      /\"/gi,
                      '',
                    ); //longitude 경도

                    console.log('하차지 주소 :', addrFull);
                    console.log('변환된 위도 :', lat);
                    console.log('변환된 경도 :', lon);

                    setEndAddr_lat(lat);
                    setEndAddr_lon(lon);

                    console.log('endAddrCordVal :', lat, lon);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                setmodalAddEndAddrVisible(false);
              }}
            />
            <Button
              onPress={() => {
                setmodalAddEndAddrVisible(false);
              }}>
              뒤로 돌아가기
            </Button>
          </Layout>
        </Modal>
      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  Button: {
    width: RFPercentage(14),
    height: RFPercentage(5),
    borderRadius: 8,
  },
  ButtonText: {
    fontSize: RFPercentage(1.5),
  },
  withdrawButton: {
    width: RFPercentage(16),
    height: RFPercentage(6),
    borderRadius: 8,
  },
  withdrawButtonText: {
    fontSize: RFPercentage(1.8),
  },
  titleStyles: {
    paddingHorizontal: 20,
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  Subtitle: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    lineHeight: 25
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderColor: '#20232a',
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    borderColor: '#20232a',
    justifyContent: 'space-between',
  },
  rowContainer: {
    paddingVertical: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectContainer: {
    flex: 1,
  },
  pickerItem: {
    color: 'black',
    fontWeight: 'bold',
  },
  infoTitle: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: RFPercentage(2.2),
    fontWeight: 'bold',
  },
  withdrawContainer: {
    flex: 1,
    alignItems: 'center',
    borderColor: '#20232a',
    justifyContent: 'space-between',
  },
  iconSize: {
    width: 32,
    height: 32,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 5,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 8,
  },
});
