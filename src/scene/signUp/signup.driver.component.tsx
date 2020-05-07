import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Picker
} from 'react-native';
import {
  LayoutElement, 
  Divider,
  Select,
  Button,
  Input,  
} from '@ui-kitten/components';
import { SignupDriverScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const serverUrl = 'http://49.50.162.128:8000/';

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const weightData = [
  { text: '1 톤'},
  { text: '1.4 톤' },
  { text: '2.5 톤' },
  { text: '5 톤' },
  { text: '11-15 톤' },
  { text: '18 톤' },
  { text: '25 톤' },
];

const typeData = [
  { text: '카고' },
  { text: '탑차' },
  { text: '냉동' },
  { text: '냉장' },
];

const bankData = [
  { text: '국민은행' },
  { text: 'SC제일은행' },
  { text: '하나은행' },
  { text: '농협' },
];

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
    // 분기화면이 생길 시 각 분기화면에서 타입에 맞게 처리되도록 해야 함
    //firebase jwt
    var accessToken;
    AsyncStorage.getItem('accessToken', (error,result)=>{
      if(error){
        console.log(error);
      }
      else{
        accessToken = result;
        axios
          .post(serverUrl+"verifyToken", {token: accessToken})
          .then((response) => {
            let firebaseToken = JSON.stringify(response.data.firebase_token);
            auth().signInWithCustomToken(firebaseToken);
            //getProfile이 아닌 fb auth로부터 정보갱신하는게 나을지
            //getProfile();
            //AsyncStorage.setItem('fbToken', JSON.stringify(firebaseToken));
            console.log("currentAuth uid: "+auth().currentUser?.uid);

            //auth리스너와 uid를 이용한 db 저장 부분
            auth().onAuthStateChanged(function(user){
              if(user){
                //현재 로그인된 auth 본인만 접근가능하도록 규칙테스트 완료
                var ref = firestore().collection('drivers').doc(user.uid);
                //var ref = firestore().collection('drivers').doc('1338327542');
                
                if(user != null){
                  console.log("firestore target uid: "+auth().currentUser?.uid);
                  try {
                    ref.update({carNum: carNumInput.value, 
                      manNum:manNumInput.value, 
                      accountNum: accountNumInput.value, 
                      phoneNum:phoneNumInput.value,
                      });
                    props.navigation.navigate(AppRoute.HOME);
                  } catch (error) {
                    //오류 toast 출력 혹은 뒤로 가기 필요할 것 같습니다.
                    console.log(error);
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
              <View style={{flex: 3}}>
                <Picker
                  selectedValue={TonValue}
                  onValueChange={(itemValue, itemIndex) => setTonValue(itemValue)}
                >
                  <Picker.Item label="1 톤" value="1"/>
                  <Picker.Item label="2.5 톤" value="2.5"/>
                  <Picker.Item label="5 톤" value="5"/>
                  <Picker.Item label="11-15 톤" value="15"/>
                  <Picker.Item label="25 톤" value="25"/>
                </Picker>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>차량 유형 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Picker
                  selectedValue={TypeValue}
                  onValueChange={(itemValue, itemIndex) => setTypeValue(itemValue)}
                >
                  <Picker.Item label="카고" value="cargo"/>
                  <Picker.Item label="윙카" value="wing"/>
                  <Picker.Item label="냉동" value="ice"/>
                  <Picker.Item label="냉장" value="superice"/>
                </Picker>
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
                <Picker
                  selectedValue={BankValue}
                  onValueChange={(itemValue, itemIndex) => setBankValue(itemValue)}
                >
                  <Picker.Item label="국민" value="kukmin"/>
                  <Picker.Item label="신한" value="shinhan"/>
                  <Picker.Item label="농협" value="nonghyeob"/>
                  <Picker.Item label="SC제일" value="SC"/>
                  <Picker.Item label="하나" value="hana"/>
                </Picker>
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