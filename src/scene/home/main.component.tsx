import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Image,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import {
  Input,
  InputElement,
  InputProps,
  Button,
  CheckBox,
  Layout,
  LayoutElement,
  Icon, Text, TopNavigation, TopNavigationAction, OverflowMenu
} from '@ui-kitten/components';
import { MainScreenProps } from '../../navigation/home.navigator';
import { AppRoute } from '../../navigation/app-routes';
import { BackIcon, MenuIcon, InfoIcon, LogoutIcon, MAPIcon, PHONEIcon, NOTEIcon} from '../../assets/icons'
import auth from '@react-native-firebase/auth'
import KakaoLogins from '@react-native-seoul/kakao-login';

let email;
let nickname;
let userType;

AsyncStorage.getItem('email', (err, result) => { email = result });
AsyncStorage.getItem('nickname', (err, result) => { nickname = result });
AsyncStorage.getItem('userType', (err, result) => { userType = result });

{/*위 명령어를 통해 닉네임, 유저타입, 이메일 주소를 가져옵니다 "" 가 추가되어있으므로 파싱해야 합니다*/}


export const MainScreen = (props: MainScreenProps): LayoutElement => {

  var ButtonType = (userType == "owner") 
    ? require('../../assets/ApplyButton.png') 
    : require('../../assets/SearchButton-round.png');
  const [menuVisible, setMenuVisible] = React.useState(false);

  const menuData = [
    {
      title: `${nickname} 님 환영합니다`,
    },
    {
      title: '버전 정보 확인',
      icon: InfoIcon,
    },
    {
      title: '로그아웃',
      icon: LogoutIcon,
    },
  ];

  const kakaoLogout = () => {
    console.log('Logout Start');
    KakaoLogins.logout()
      .then(result => {
        console.log(`Logout Finished:${result}`);
      })
      .catch(err => {
        console.log(
          `Logout Failed:${err.code} ${err.message}`
        );
      });
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onMenuItemSelect = (index) => {
    setMenuVisible(false);
    console.log(index);
    if(index == 2){   {/*0,1,2 의 순서로 진행됩니다 로그 아웃 기능 구현*/}
      AsyncStorage.clear();
      kakaoLogout();
      auth().signOut;
      
      props.navigation.navigate(AppRoute.AUTH);
      console.log("Logout Success");
    }
  };

  const renderMenuAction = () => (
    <OverflowMenu
      visible={menuVisible}
      data={menuData}
      onSelect={onMenuItemSelect}
      onBackdropPress={toggleMenu}>
      <TopNavigationAction
        icon={MenuIcon}
        onPress={toggleMenu}
      />
    </OverflowMenu>
  );

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon}/>
  );

  const clickButtonType = () => {
    (userType == "owner") 
      ? props.navigation.navigate(AppRoute.APPLY) 
      : props.navigation.navigate(AppRoute.SEARCH);      
  };

  const clickCheck = () => {
    props.navigation.navigate(AppRoute.CHECK);
  };

  const clickHistory = () => {
    props.navigation.navigate(AppRoute.HISTORY);
  };

    return (
        <React.Fragment>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <TopNavigation
            title='   화물 25'
            titleStyle={styles.titleStyles}
            rightControls={renderMenuAction()}
          />
          <ScrollView>
          <View style={styles.viewForm}>
            <TouchableOpacity onPress={clickButtonType}>
              <Image style={styles.Button} source={ButtonType}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={clickCheck}>
              <Image style={styles.Button} source={require('../../assets/CheckButton-round.png')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={clickHistory}>
              <Image style={styles.Button} source={require('../../assets/HistoryButton.png')}/>
            </TouchableOpacity>                     
            <Button style={styles.IconButton} textStyle={styles.IconButtonText} status='basic' size='giant' icon={MAPIcon}>네비게이션으로 연결</Button>
            <Button style={styles.IconButton} textStyle={styles.IconButtonText} status='basic' size='giant' icon={PHONEIcon}>화주와 통화 연결</Button>
            <Button style={styles.IconButton} textStyle={styles.IconButtonText} status='basic' size='giant' icon={NOTEIcon}>이 달의 매출확인</Button>
            <View style={styles.empty} />
          </View>
          </ScrollView>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    viewForm: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: "flex-start",
      alignItems:'center',
    },
    Button: {
      width: 355,
      height: 150,
      margin: 10,
      borderRadius: 5,
    },
    titleStyles: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    IconButton: {
      width: 355,
      height: 50,
      margin: 10,
    },
    IconButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    empty:{
      marginVertical: 20,
    },
});