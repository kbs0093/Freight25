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
import { SignupOwnerScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';


export const SignupOwnerScreen = (props: SignupOwnerScreenProps): LayoutElement => {
  
  const [manNumInput, manNum] = React.useState('');
  const [accountNumInput, accountNum] = React.useState('');
  const [phoneNumInput, phoneNum] = React.useState('');
  const [BankValue, setBankValue] = React.useState('');

    return (
        <React.Fragment>
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <View>
            <Text style={{fontWeight: 'bold', fontSize: 20, margin: 10}}>화주 회원가입</Text>
            <Divider style={{backgroundColor: 'black'}}/>
          </View>
          <ScrollView>
          <View> 
            <Text style={styles.textStyle}>회사 정보</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>회사 주소 :</Text>
              </View>
              <View style={{flex: 3}}>

              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>상차지 주소 :</Text>
              </View>
              <View style={{flex: 3}}>

              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>사업자 등록번호 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Input
                  style={styles.input}
                  placeholder='사업자 등록번호를 입력하세요'
                  size='small'
                  value={manNumInput}
                  onChangeText={manNum}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>전화번호 :</Text>
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
            <Divider style={{backgroundColor: 'black'}}/>
          </View>

          <View style={{flex: 3}}> 
            <Text style={styles.textStyle}>금융 정보</Text>
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
            <Divider style={{backgroundColor: 'black'}}/>
          </View>
          
          <View style={{flex: 2,flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>            
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