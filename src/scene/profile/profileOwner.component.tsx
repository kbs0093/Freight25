import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
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
import {Value} from 'react-native-reanimated';

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return {value, onChangeText: setValue};
};

const useSelectState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return {value, onSelect: setValue, selectedOption: value};
};

let userType;

async function getType() {
  try {
    const value = await AsyncStorage.getItem('userType');
    if (value !== null) {
      userType = value;
      console.log(userType);
    }
  } catch (error) {}
}
getType();

export const ProfileOwnerScreen = (
  props: ProfileOwnerScreenProps,
): LayoutElement => {
  const [TonValue, setTonValue] = React.useState('');
  const [TypeValue, setTypeValue] = React.useState('');
  const [BankValue, setBankValue] = React.useState('');
  const [nameInput, name] = React.useState('');
  const [phoneNumInput, phoneNum] = React.useState('');
  const [accountNumInput, accountNum] = React.useState('');
  const [accountOwnerInput, accountOwner] = React.useState('');
  const [carNumInput, carNum] = React.useState('');
  const [manNumInput, manNum] = React.useState('');
  const [companyNameInput, companyName] = React.useState('');

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.Subtitle}>화주 정보 수정</Text>
          <Button
            onPress={() => {
              console.log(nameInput);
              Toast.showSuccess('수정 완료');
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
              <Input
                placeholder="성명을 적어주세요"
                value={nameInput}
                onChangeText={name}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>전화 번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="-를 빼고 입력하세요"
                value={phoneNumInput}
                onChangeText={phoneNum}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>사업자등록번호: </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="사업자 등록번호를 입력하세요"
                value={manNumInput}
                onChangeText={manNum}
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
              <Input
                placeholder="업체명을 적어주세요"
                value={companyNameInput}
                onChangeText={companyName}
              />
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
              <Input
                placeholder="-를 뺴고 입력하세요"
                value={accountNumInput}
                onChangeText={accountNum}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>예금주 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder="예금주를 적어주세요"
                value={accountOwnerInput}
                onChangeText={accountOwner}
              />
            </Layout>
          </View>
        </View>
      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  Button: {
    width: RFPercentage(12),
    height: RFPercentage(6),
    borderRadius: 8,
  },
  ButtonText: {
    fontSize: RFPercentage(1.6),
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
    paddingVertical: 10,
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
    paddingVertical: 10,
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
