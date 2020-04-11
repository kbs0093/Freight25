import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Image,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
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



export const MainScreen = (props: MainScreenProps): LayoutElement => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const menuData = [
    {
      title: '버전 정보 확인',
      icon: InfoIcon,
    },
    {
      title: '로그아웃',
      icon: LogoutIcon,
    },
  ];

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onMenuItemSelect = (index) => {
    setMenuVisible(false);
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

  const clickSearch = () => {
    props.navigation.navigate(AppRoute.SEARCH);
  };

  const clickCheck = () => {
    props.navigation.navigate(AppRoute.CHECK);
  };

    return (
        <React.Fragment>
          <TopNavigation
            title='   화물 25'
            titleStyle={styles.titleStyles}
            rightControls={renderMenuAction()}
          />
          <View style={styles.viewForm}>
            <TouchableOpacity onPress={clickSearch}>
              <Image style={styles.Button} source={require('../../assets/SearchButton-round.png')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={clickCheck}>
              <Image style={styles.Button} source={require('../../assets/CheckButton-round.png')}/>
            </TouchableOpacity>                     
            <Button style={styles.IconButton} textStyle={styles.IconButtonText} status='basic' size='giant' icon={MAPIcon}>네비게이션으로 연결</Button>
            <Button style={styles.IconButton} textStyle={styles.IconButtonText} status='basic' size='giant' icon={PHONEIcon}>화주와 통화 연결</Button>
            <Button style={styles.IconButton} textStyle={styles.IconButtonText} status='basic' size='giant' icon={NOTEIcon}>이 달의 매출확인</Button>
          </View>

          
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
});