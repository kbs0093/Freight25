import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  Picker,
} from 'react-native';
import {
  LayoutElement,
  Divider,
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
import RNPickerSelect from 'react-native-picker-select';

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

const useSelectState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return {value, onSelect: setValue, selectedOption: value};
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
  const [BankValue, setBankValue] = React.useState('');
  const [TonValue, setTonValue] = React.useState('');
  const [TypeValue, setTypeValue] = React.useState('');

  const nameInput = useInputState();
  const phoneNumInput = useInputState();
  const carNumInput = useInputState();
  const manNumInput = useInputState();
  const accountNumInput = useInputState();
  const companyNameInput = useInputState();

  //if (userType == 'owner') {
  if (1) {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        <View style={styles.titleContainer}>
          <Text style={styles.Subtitle}>화주 정보 수정</Text>
          <Button
            onPress={() => {
              console.log(carNumInput);
            }}
            style={styles.Button}
            textStyle={styles.ButtonText}>
            수정
          </Button>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>개인 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>성 명: </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="성명을 적어주세요" {...nameInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>전화 번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="-를 빼고 입력하세요" {...phoneNumInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>사업자등록번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="사업자 등록번호를 입력하세요"
                {...manNumInput}
              />
            </Layout>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>상 하차지 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>자주 쓰는 주소: </Text>
            <Button style={styles.Button} textStyle={styles.ButtonText}>
              주소검색
            </Button>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>업체명: </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="업체명을 적어주세요" {...companyNameInput} />
            </Layout>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>계좌 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>거래 은행: </Text>
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
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>계좌 번호 : </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="-를 뺴고 입력하세요" {...accountNumInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>예금주 : </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="예금주를 적어주세요" {...accountNumInput} />
            </Layout>
          </View>
        </View>
      </React.Fragment>
    );
  } else if (userType == 'driver') {
    return (
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
        <View style={styles.titleContainer}>
          <Text style={styles.Subtitle}>화물차 기사 정보 수정</Text>
          <Button
            onPress={() => {
              console.log(carNumInput);
              console.log(BankValue);
            }}
            style={styles.Button}
            textStyle={styles.ButtonText}>
            수정
          </Button>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>개인 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>성 명: </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="성명을 적어주세요" {...nameInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>전화 번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="-를 빼고 입력하세요" {...phoneNumInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>사업자등록번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="사업자 등록번호를 입력하세요"
                {...manNumInput}
              />
            </Layout>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>차량 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>차량 번호 : </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="차량 번호를 적어주세요" {...carNumInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>차량 톤수 : </Text>
            <RNPickerSelect
              onValueChange={(itemValue, itemIndex) => setTonValue(itemValue)}
              placeholder={{
                label: '차량 톤수를 선택하세요',
                value: null,
              }}
              useNativeAndroidPickerStyle={false}
              items={[
                {label: '1 톤', value: '1'},
                {label: '2.5 톤', value: '2.5'},
                {label: '5 톤', value: '5'},
                {label: '11-15 톤', value: '15'},
                {label: '25 톤', value: '25'},
              ]}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>차량 유형 : </Text>
            <RNPickerSelect
              onValueChange={(itemValue, itemIndex) => setTypeValue(itemValue)}
              placeholder={{
                label: '차량 유형을 선택하세요',
                value: null,
                fontsize: 12,
              }}
              useNativeAndroidPickerStyle={false}
              items={[
                {label: '카고', value: 'cargo'},
                {label: '윙카', value: 'wing'},
                {label: '냉동', value: 'ice'},
                {label: '냉장', value: 'superice'},
              ]}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.Subtitle}>계좌 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>거래 은행: </Text>
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
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>계좌 번호 : </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="-를 뺴고 입력하세요" {...accountNumInput} />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>예금주 : </Text>
            <Layout style={styles.selectContainer}>
              <Input placeholder="예금주를 적어주세요" {...accountNumInput} />
            </Layout>
          </View>
        </View>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Text>유저 정보를 확인할 수 없습니다 :)</Text>
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
    width: RFPercentage(12),
    height: RFPercentage(0.5),
    borderRadius: 8,
  },
  ButtonText: {
    fontSize: RFPercentage(2),
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
    flex: 0.2,
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
    justifyContent: 'space-between',
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
  pickerItem: {
    color: 'black',
    fontWeight: 'bold',
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
