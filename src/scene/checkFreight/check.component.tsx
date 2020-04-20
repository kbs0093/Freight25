import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  LayoutElement,
  TopNavigationAction,
  TopNavigation,
  OverflowMenu,
} from '@ui-kitten/components';
import {CheckScreenProps} from '../../navigation/check.navigator';
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

export const CheckScreen = (props: CheckScreenProps): LayoutElement => {
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
      <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
    </OverflowMenu>
  );

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <TopNavigation
        title="  화물 25"
        titleStyle={styles.titleStyles}
        rightControls={renderMenuAction()}
      />
      <View style={styles.viewForm}>
        <Text>화물 확인화면입니다</Text>
      </View>
      <View style={styles.totalInfoText}>
        <Text>총 운행 거리</Text>
        <Text>총 운행 운임</Text>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  viewForm: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyles: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalInfoText: {
    fontSize: 30,
    flex: 1,
    fontWeight: 'bold',
    fontStyle: 'normal',
    alignItems: 'center',
  },
});
