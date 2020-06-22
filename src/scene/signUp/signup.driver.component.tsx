import React, {useState, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {
  LayoutElement, 
  Divider,
  Button,
  Input,  
} from '@ui-kitten/components';
import { SignupDriverScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CommonActions } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-tiny-toast';

const isAndroid = Platform.OS === 'android';

const HomeNavigate = CommonActions.reset({
  index: 0,
  routes: [{name: AppRoute.HOME}],
});


const serverUrl = 'http://49.50.162.128:8000/';

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

export const SignupDriverScreen = (props: SignupDriverScreenProps): LayoutElement => {
   
   
  const [nameInput, name] = React.useState('');
  const [accountOwnerInput, accountOwner] = React.useState('');
  const [carNumInput, carNum] = React.useState('');
  const [manNumInput, manNum] = React.useState('');
  const [accountNumInput, accountNum] = React.useState('');
  const [phoneNumInput, phoneNum] = React.useState('');

  const [TonValue, setTonValue] = React.useState('');
  const [TypeValue, setTypeValue] = React.useState('');
  const [BankValue, setBankValue] = React.useState('');  

  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: AppRoute.SIGNUP}]
  });

  
  const getProfile = () => {
    logCallback('Get Profile Start', setProfileLoading(true));
  

    KakaoLogins.getProfile()
      .then((result) => {
        setProfile(result);
        logCallback(`Get Profile Finished`, setProfileLoading(true));
        AsyncStorage.setItem('email', JSON.stringify(result.email));
        AsyncStorage.setItem('nickname', JSON.stringify(result.nickname));
        AsyncStorage.setItem('userType', 'driver');
        {
          /*유저타입이 owner일 경우 화주 / driver 일 경우 화물차기사 입니다 테스트 시 사용하세요,  향후 이메일을 서버로 보내고 타입을 받아올 생각입니다*/
        }
      })
      .catch((err) => {
        logCallback(
          `Get Profile Failed:${err.code} ${err.message}`,
          setProfileLoading(false),
        );
      });
  };
 
  const regDriver = () => {
    //분기화면이 생길 시 각 분기화면에서 타입에 맞게 처리되도록 해야 함
    //firebase jwt
    const toastLoading = Toast.showLoading('Loading...');
    var accessToken;
    AsyncStorage.getItem('accessToken', (error,result)=>{
      if(error){
        console.log(error);
      }
      else{
        accessToken = result;
        axios
          .post(serverUrl+"verifyToken", {token: accessToken, type: "drivers"})
          .then((response) => {
            let firebaseToken = JSON.stringify(response.data.firebase_token);
            //getProfile이 아닌 fb auth로부터 정보갱신해야할 것 같은데 논의가 필요합니다.
            //getProfile();
            AsyncStorage.setItem('fbToken', JSON.stringify(firebaseToken));
            auth().signInWithCustomToken(firebaseToken)
            .then( (value) => {
              var user = auth().currentUser;
              console.log("currentAuth uid: "+user?.uid);
              //auth리스너와 uid를 이용한 db 저장 부분
              //현재 로그인된 auth 본인만 접근가능하도록 규칙테스트 완료
              var ref = firestore().collection('drivers').doc(user?.uid);
              if(user != null){
                console.log("firestore target uid: "+user.uid);
                try {
                  ref.update({
                    name: nameInput,
                    accountOwner: accountOwnerInput,
                    carNumber: carNumInput, 
                    companyNumber: manNumInput, 
                    accountNumber: accountNumInput, 
                    tel: phoneNumInput,
                    carTon: TonValue,
                    caryType: TypeValue,
                    bankName: BankValue,
                    timeStampSignup: new Date()
                  });
                  Toast.hide(toastLoading);
                  Toast.showSuccess('회원가입이 완료되었습니다.');
                  AsyncStorage.setItem('userType', 'driver');
                  console.log(user.uid+" succeeded in loging / signup Stage");
                  props.navigation.dispatch(HomeNavigate);
                } 
                catch (error) {
                  //오류 toast 출력 혹은 뒤로 가기 필요할 것 같습니다.
                  console.log(error);
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
            <Text style={{fontWeight: 'bold', fontSize: 20, margin: 10}}>화물차 기사 회원가입</Text>
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
                <Text style={styles.textStyle}>사업자 번호 :</Text>
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
            <Divider style={{backgroundColor: 'black'}}/>
          </View>


          <View> 
            <Text style={styles.textStyle}>차량 정보</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>차량 번호 :</Text>
              </View>
              <View style={{flex: 3}}>
                <Input
                  style={styles.input}
                  placeholder='차량 번호판 번호를 적어주세요'
                  size='small'
                  value={carNumInput}
                  onChangeText={carNum}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>차량 톤수 :</Text>
              </View>
              <View style={{flex: 3, justifyContent:'center', alignItems:'center'}}>
                <RNPickerSelect
                  onValueChange={(itemValue, itemIndex) => setTonValue(itemValue)}
                  placeholder={{
                    label: '차량 톤수를 선택하세요',
                    value: null,
                  }}
                  style={{
                    placeholder:{
                      color: 'black'
                    }
                  }}
                  useNativeAndroidPickerStyle={isAndroid? true: false}
                  items={[
                    { label: '1 톤', value: '1'},
                    { label: '2.5 톤' ,value: '2.5'},
                    { label: '5 톤' ,value: '5'},
                    { label: '11-15 톤' ,value: '11-15'},
                    { label: '18 톤' ,value: '18'},
                    { label: '25 톤' ,value: '25'},
                  ]}
                />          
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>차량 유형 :</Text>
              </View>
              <View style={{flex: 3, justifyContent:'center', alignItems:'center'}}>
                <RNPickerSelect
                    onValueChange={(itemValue, itemIndex) => setTypeValue(itemValue)}
                    placeholder={{
                      label: '차량 유형을 선택하세요',
                      value: null,
                    }}
                    style={{
                      placeholder:{
                        color: 'black'
                      }
                    }}
                    useNativeAndroidPickerStyle={isAndroid? true: false}
                    items={[
                      {label: '카고', value: 'cargo'},
                      { label: '탑차' ,value: 'top'},
                      { label: '윙바디' ,value: 'wing'},
                      {label: '냉동', value: 'superice'},
                      {label: '냉장', value: 'ice'},
                    ]}
                  />
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
              <View style={{flex: 3, justifyContent:'center', alignItems:'center'}}>
                <RNPickerSelect
                  onValueChange={(itemValue, itemIndex) => setBankValue(itemValue)}
                  placeholder={{
                    label: '은행을 선택하세요',
                    value: null,
                  }}
                  style={{
                    placeholder:{
                      color: 'black'
                    }
                  }}
                  useNativeAndroidPickerStyle={isAndroid? true: false}
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
              <Text>{carNum}</Text>  
              <Button style={{margin: 30}} status='danger' size='large' onPress={() => props.navigation.goBack()}>돌아가기</Button>
              <Button style={{margin: 30}} status='primary' size='large' onPress={regDriver}>회원가입</Button>
          </View>
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