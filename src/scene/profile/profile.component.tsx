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
  Select,
  TopNavigationAction,
  TopNavigation,
  OverflowMenu,
  Button,
  styled,
  Icon,
  Layout,
  Input,
} from '@ui-kitten/components';
import {ProfileScreenProps} from '../../navigation/profile.navigator';
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

let email;
let nickname;
let userType;

AsyncStorage.getItem('email', (err, result) => {
  email = result;
});
AsyncStorage.getItem('nickname', (err, result) => {
  nickname = result;
});
AsyncStorage.getItem('userType', (err, result) => {
  userType = result;
});

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return {value, onChangeText: setValue};
};

const carSize = [
  {text: '1톤'},
  {text: '2.5톤'},
  {text: '5톤'},
  {text: '10톤 이상'},
];
const carType = [{text: '탑'}, {text: '냉장'}];
const driveType = [{text: '독차'}, {text: '혼적'}];

const freightType = [{text: '파레트'}];

export const ProfileScreen = (props: ProfileScreenProps): LayoutElement => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const [selectedCarSizeOption, setSelectedCarSizeOption] = React.useState(
    null,
  );
  const [selectedCarTypeOption, setSelectedCarTypeOption] = React.useState(
    null,
  );
  const [selectedDriveOption, setSelectedDriveOption] = React.useState(null);
  const [weightValue, setWeightValue] = React.useState('');
  const [volumeValue, setVolumeValue] = React.useState('');
  const [
    selectedFreightTypeOption,
    setSelectedFreightTypeOption,
  ] = React.useState(null);
  const [freightLoadTypeValue, setFreightLoadTypeValue] = React.useState('');
  const [descValue, setDescValue] = React.useState('');

  const carNumInput = useInputState();
  const manNumInput = useInputState();
  const accountNumInput = useInputState();

  const menuData = [
    {
      title: '버전 정보 확인',
      icon: InfoIcon,
    },
    {
      title: '개인 정보 수정',
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
    if (index == 1) {
      {
        /*0,1,2 의 순서로 진행됩니다 로그 아웃 기능 구현*/
      }
      //auth().signOut;
      props.navigation.navigate(AppRoute.PROFILE);
      console.log('Logout Success');
    }
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

  if (userType == 'owner') {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        <TopNavigation
          title="화물 25"
          titleStyle={styles.titleStyles}
          rightControls={renderMenuAction()}
        />
        <Text>화주 개인정보 수정 화면</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.Subtitle}>개인정보 설정 및 수정</Text>
        </View>
      </React.Fragment>
    );
  } else if (userType == 'driver') {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        <TopNavigation
          title="화물 25"
          titleStyle={styles.titleStyles}
          rightControls={renderMenuAction()}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.Subtitle}>화물차 기사 정보 수정</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>화물 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>차량 정보 : </Text>
            <Layout style={styles.selectContainer}>
              <Select
                data={carSize}
                selectedOption={selectedCarSizeOption}
                onSelect={setSelectedCarSizeOption}
              />
            </Layout>
            <Layout style={styles.selectContainer}>
              <Select
                data={carType}
                selectedOption={selectedCarTypeOption}
                onSelect={setSelectedCarTypeOption}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>운행 방식 : </Text>
            <Layout style={styles.selectContainer}>
              <Select
                data={driveType}
                selectedOption={selectedDriveOption}
                onSelect={setSelectedDriveOption}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 무게 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="화물 무게를 입력하세요"
                value={weightValue}
                onChangeText={(nextValue) => setWeightValue(nextValue)}
              />
            </Layout>
            <Text style={styles.infoTitle}> 톤</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 크기 : </Text>
            <Input
              placeholder=""
              value={volumeValue}
              onChangeText={(nextValue) => setVolumeValue(nextValue)}
            />
            <Layout style={styles.selectContainer}>
              <Select
                data={freightType}
                selectedOption={selectedFreightTypeOption}
                onSelect={setSelectedFreightTypeOption}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>적재 방식 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="ex) 지게차 / 기사 인력 필요"
                value={freightLoadTypeValue}
                onChangeText={(nextValue) => setFreightLoadTypeValue(nextValue)}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 설명 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="화물 설명을 입력하세요"
                value={descValue}
                onChangeText={(nextValue) => setDescValue(nextValue)}
              />
            </Layout>
          </View>
        </View>

        <View style={styles.lineStyle} />
        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>개인 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>차량 번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="ex) 00구 0000" {...carNumInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>사업자등록번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="사업자등록번호를 입력하세요"
                {...manNumInput}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>계좌번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="계좌번호를 입력하세요" {...accountNumInput} />
            </Layout>
          </View>
        </View>
      </React.Fragment>
    );
  }
};

const styles = StyleSheet.create({
  viewForm: {
    fontSize: RFPercentage(2),
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  Button: {
    width: RFPercentage(10),
    height: RFPercentage(0.5),
    borderRadius: 8,
  },
  ButtonText: {
    fontSize: RFPercentage(1.8),
  },
  titleStyles: {
    paddingHorizontal: 20,
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  Subtitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderColor: '#20232a',
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    borderColor: '#20232a',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectContainer: {
    flex: 1,
  },
  infoTitle: {
    paddingVertical: 2,
    paddingHorizontal: 30,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  iconSize: {
    width: 32,
    height: 32,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  },
});
