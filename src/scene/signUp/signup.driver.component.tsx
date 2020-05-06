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
  { text: '1 톤' },
  { text: '1.4 톤' },
  { text: '2.5 톤' },
  { text: '5 톤' },
  { text: '11 - 15 톤' },
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
  const carNumInput = useInputState();
  const manNumInput = useInputState();
  const accountNumInput = useInputState();
  const phoneNumInput = useInputState();

  const [selectedOption1, setSelectedOption1] = React.useState(null);
  const [selectedOption2, setSelectedOption2] = React.useState(null);
  const [selectedOption3, setSelectedOption3] = React.useState(null);
  
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
            //서버 users 저장 or 수정?
            //getProfile();
            AsyncStorage.setItem('fbToken', JSON.stringify(firebaseToken));
            //uid를 이용한 db 저장 부분
            var ref = firestore().collection('drivers').doc(auth().currentUser?.uid);
            var user = auth().currentUser;
            if(user != null)
              console.log("uid: "+auth().currentUser?.uid);
            ref.set({carNum: carNumInput, manNum:manNumInput, accountNum: accountNumInput, phoneNum:phoneNumInput});
            props.navigation.navigate(AppRoute.HOME);
          })
          .catch((error) => {
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
                  {...carNumInput}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>차량 톤수 :</Text>
              </View>
              <View style={{flex: 3}}>
                <Select
                  style={styles.input}
                  data={weightData}
                  size='small'
                  placeholder='차량 톤수를 선택하세요'
                  selectedOption={selectedOption1}
                  onSelect={setSelectedOption1}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>차량 유형 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Select
                    style={styles.input}
                    data={typeData}
                    size='small'
                    placeholder='카고 / 탑차 등 유형을 선택'
                    selectedOption={selectedOption2}
                    onSelect={setSelectedOption2}
                  />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>차량 등록증 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Text style={styles.textStyle}>세부 사항</Text>
              </View>
            </View>
            <Divider style={{backgroundColor: 'black'}}/>
          </View>

          <View style={{flex: 3}}> 
            <Text style={styles.textStyle}>개인 정보</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>사업자 등록번호 :</Text>
              </View>
              <View style={{flex: 3}}>
                <Input
                  style={styles.input}
                  placeholder=''
                  size='small'
                  {...manNumInput}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>사업자등록증 :</Text>
              </View>
              <View style={{flex: 3}}>
               
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>거래 은행 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Select
                  style={styles.input}
                  data={bankData}
                  size='small'
                  placeholder='은행을 선택하세요'
                  selectedOption={selectedOption3}
                  onSelect={setSelectedOption3}
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
                  placeholder=''
                  size='small'
                  {...accountNumInput}
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
                  placeholder=''
                  size='small'
                  {...phoneNumInput}
                />
              </View>
            </View>
            <Divider style={{backgroundColor: 'black'}}/>
          </View>
          
          <View style={{flex: 2,flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>            
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