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
import { SignupOwnerScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const bankData = [
  { text: '국민은행' },
  { text: 'SC제일은행' },
  { text: '하나은행' },
  { text: '농협' },
];


export const SignupOwnerScreen = (props: SignupOwnerScreenProps): LayoutElement => {

  const manNumInput = useInputState();
  const accountNumInput = useInputState();
  const phoneNumInput = useInputState();

  const [selectedOption1, setSelectedOption1] = React.useState(null);
  const [selectedOption2, setSelectedOption2] = React.useState(null);
  const [selectedOption3, setSelectedOption3] = React.useState(null);

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
                  placeholder='사업자 등록번호를 적으세요'
                  size='small'
                  {...manNumInput}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>사업자 등록증 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Text style={styles.textStyle}>세부 사항</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailTitle}>
                <Text style={styles.textStyle}>전화번호 :</Text>
              </View>
              <View style={{flex: 3 }}>
                <Input
                  style={styles.input}
                  placeholder='핸드폰 전화번호를 적어주세요'
                  size='small'
                  {...phoneNumInput}
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