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
              <Button style={{margin: 30}} status='primary' size='large'>회원가입</Button>
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