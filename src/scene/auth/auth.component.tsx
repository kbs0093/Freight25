import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  ImageBackground,
  StyleSheet,
  View,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  Input,
  InputElement,
  InputProps,
  Button,
  CheckBox,
  Layout,
  LayoutElement,
} from '@ui-kitten/components';
import {AuthScreenProps} from '../../navigation/auth.navigator';
import {AppRoute} from '../../navigation/app-routes';
import KakaoLogins from '@react-native-seoul/kakao-login';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-tiny-toast';
import {CommonActions} from '@react-navigation/native';

import messaging from '@react-native-firebase/messaging'
if (!KakaoLogins) {
  console.error('Module is Not Linked');
}
const serverUrl = 'http://49.50.162.50:8000/';

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};

const TOKEN_EMPTY = 'token has not fetched';
const PROFILE_EMPTY = {
  id: 'profile has not fetched',
  email: 'profile has not fetched',
  profile_image_url: '',
};

const HomeNavigate = CommonActions.reset({
  index: 0,
  routes: [{name: AppRoute.HOME}],
});

const OwnerNavigate = CommonActions.reset({
  index: 0,
  routes: [{name: AppRoute.OWNER}],
});

const SignupNavigate = CommonActions.reset({
  index: 0,
  routes: [{name: AppRoute.SIGNUP}],
});



const isAndroid = (Platform.OS === 'android')

export const AuthScreen = (props: AuthScreenProps): LayoutElement => {
  var messageToken = ''
  useEffect(() => {
    messaging()
    .hasPermission()
    .then(enabled => {       
      if (enabled) {
      } else {
        messaging()
        .requestPermission()
        .then()
        .catch(err => {
          if (!isAndroid) {
            Linking.canOpenURL('app-settings:')
              .then(supported => {
                Linking.openURL('app-settings:');
              })
              .catch(error => {});
          }
        });
      }
      messaging().getToken().then(token => {
        messageToken = token
        AsyncStorage.setItem('messageToken', token)})
    })
    .catch();
  }, []);

  const [token, setToken] = useState(TOKEN_EMPTY);
  const [profile, setProfile] = useState(PROFILE_EMPTY);

  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const kakaoLogin = () => {
    logCallback('Login Start', setLoginLoading(true));
    KakaoLogins.login()
      .then((result) => {
        axios
          .post(serverUrl+"confirmUid", {token: JSON.stringify(result.accessToken)})
          .then((response) => {
            parseInt(result.accessToken)
            let uidRegistered = JSON.stringify(response.data.register);
             //등록된 uid인 경우 (true)
            if(uidRegistered == 'true'){
              //현재 인증된 uid로 발행된 fbToken 이용하여 auth() 갱신
              const toastLoading = Toast.showLoading('Loading...');
              let firebaseToken = JSON.stringify(response.data.firebase_token);
              AsyncStorage.setItem('fbToken', JSON.stringify(firebaseToken));
              AsyncStorage.setItem('accessToken', JSON.stringify(result.accessToken));
              auth().signInWithCustomToken(firebaseToken).then((value) => {
                var user = auth().currentUser;
                if(user){
                  //현재 로그인된 auth 본인만 접근가능하도록 규칙테스트 완료
                  var ref = firestore().collection('drivers').doc(user.uid);
                  ref.get().then(function(doc) {
                    if(doc.exists){
                      if(messageToken != ''){
                        console.log('메시지토큰 :',messageToken)
                        ref.update({
                          messageToken : messageToken
                        })
                      }
                      AsyncStorage.setItem('userUID', user.uid).then(() =>{
                        console.log(user.uid+" Async Storage 등록 완료");                 
                      });
                      AsyncStorage.setItem('userType', 'driver')
                      .then( ()=>{
                        console.log("auth AsyncStorage Type: driver");
                        console.log(user.uid+" succeeded in loging / auth Stage");
                      });
                      Toast.hide(toastLoading);
                      props.navigation.dispatch(HomeNavigate);
                    }
                    else{
                      AsyncStorage.setItem('userUID', user.uid).then(() =>{
                        console.log(user.uid+" Async Storage 등록 완료");                 
                      });
                      AsyncStorage.setItem('userType', 'owner')
                      .then(()=>{
                        var ref = firestore().collection('owners').doc(user.uid);
                        if(messageToken != ''){
                          ref.update({
                            messageToken : messageToken
                          })
                        }
                        console.log("auth AsyncStorage Type: owner");
                        console.log(user.uid+" succeeded in loging / auth Stage");
                      });
                      Toast.hide(toastLoading);
                      props.navigation.dispatch(OwnerNavigate);
                    } 
                  })
                }
              });
            }
             //미등록된 uid인 경우 (false)
            else if(uidRegistered == 'false'){
              console.log("uidRegistered: "+uidRegistered);
              const user = auth().currentUser;
              console.log(JSON.stringify(result.accessToken));
              //분기화면이 생길 시 각 분기화면에서 타입에 맞게 처리되도록 해야 함
              //분기에 대한 변수도 같이 주고 서버에서 기사와 화주 collection을 구분하여 만들도록 함 
              AsyncStorage.setItem('accessToken', JSON.stringify(result.accessToken));
              //여기서 분기가 발생해야 합니다
              props.navigation.dispatch(SignupNavigate);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        if (err.code === 'E_CANCELLED_OPERATION') {
          logCallback(`Login Cancelled:${err.message}`, setLoginLoading(false));
        } else {
          logCallback(
            `Login Failed:${err.code} ${err.message}`,
            setLoginLoading(false),
          );
        }
      });
  };

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <ImageBackground
        style={styles.appBar}
        source={require('../../assets/image-background.png')}>
        <View style={styles.viewForm}>
          <View style={styles.empty1} />
          <Button
            style={styles.btnKakaoLogin}
            status="basic"
            onPress={kakaoLogin}>
            카카오톡 로그인
          </Button>
        </View>
      </ImageBackground>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flex: 1,
  },
  viewForm: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty1: {
    marginVertical: 50,
  },
  btnKakaoLogin: {
    width: 280,
    marginVertical: 10,
    backgroundColor: '#F8E71C',
    borderColor: '#F8E71C',
  },
});
