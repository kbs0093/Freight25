import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  LayoutElement, TopNavigation,
  Button, Layout, Select, Input,
} from '@ui-kitten/components';
import { ApplyScreenProps } from '../../navigation/apply.navigator';
import { AppRoute } from '../../navigation/app-routes';

const carSize = [
  { text: '1톤' },
  { text: '2.5톤' },
  { text: '5톤' },
  { text: '10톤 이상' },
];
const carType = [
  { text: '탑' },
  { text: '냉장' },
];
const driveType = [
  { text: '독차'},
  { text: '혼적'},
];

const freightType = [
  { text: '파레트'},
];

export const ApplyScreen = (props: ApplyScreenProps): LayoutElement => {

  const [selectedCarSizeOption, setSelectedCarSizeOption] = React.useState(null);
  const [selectedCarTypeOption, setSelectedCarTypeOption] = React.useState(null);
  const [selectedDriveOption, setSelectedDriveOption] = React.useState(null);
  
  const [weightValue, setWeightValue] = React.useState('');
  const [volumeValue, setVolumeValue] = React.useState('');
  const [selectedFreightTypeOption, setSelectedFreightTypeOption] = React.useState(null);

  const [freightLoadTypeValue, setFreightLoadTypeValue] = React.useState('');
  const [descValue, setDescValue] = React.useState('');

  const [distValue, setDistValue] = React.useState('');
  const [expenseValue, setExpenseValue] = React.useState('');

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <TopNavigation
        title="화물 25"
        titleStyle={styles.titleStyles}
      />
      <ScrollView>
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>위치 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>상차지 : 서울시 서초구 반포동 55-2</Text>
            <Button appearance='outline' size='small'>변경</Button>
          </View>
          <View style={styles.rowContainerWithLine}>
            <Text style={styles.infoTitle}>시간 : </Text>
            <Button appearance='outline' size='small'>변경</Button>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>하차지 : 서울시 서초구 반포동 55-2</Text>
            <Button appearance='outline' size='small'>변경</Button>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>시간 : </Text>
            <Text style={styles.infoTitle}>06시 00분</Text>
            <Text style={styles.infoTitle}>유형 : </Text>
            <Text style={styles.infoTitle}>내착</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>화물 정보</Text>
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
                placeholder='화물 무게를 입력하세요'
                value={weightValue}
                onChangeText={nextValue => setWeightValue(nextValue)}
              />
            </Layout>
            <Text style={styles.infoTitle}> 톤</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 크기 : </Text>
            <Input
              placeholder=''
              value={volumeValue}
              onChangeText={nextValue => setVolumeValue(nextValue)}
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
                placeholder='ex) 지게차 / 기사 인력 필요'
                value={freightLoadTypeValue}
                onChangeText={nextValue => setFreightLoadTypeValue(nextValue)}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>화물 설명 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='화물 설명을 입력하세요'
                value={descValue}
                onChangeText={nextValue => setDescValue(nextValue)}
              />
            </Layout>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>요금 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>총 운행거리 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='운행 거리를 입력하세요'
                value={distValue}
                onChangeText={nextValue => setDistValue(nextValue)}
              />
            </Layout>
            <Text style={styles.infoTitle}>km</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>요금 : </Text>
            <Layout style={styles.selectContainer}>
              <Input
                placeholder='화물 요금을 입력하세요'
                value={expenseValue}
                onChangeText={nextValue => setExpenseValue(nextValue)}
              />
            </Layout>

            <Text style={styles.infoTitle}> 원</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>지불 : 인수증</Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>상차지 반경 30km 내에 00대의 차량이 있습니다</Text>
          
          <View style={styles.buttonsContainer}>
            <Button style={styles.IconButton} status='danger'>취소</Button>
            <Button style={styles.IconButton} >등록</Button>
          </View>
        </View>

      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  IconButton: {
    width: 150,
    height: 50,
    margin: 10,
  },
  descInputHolder: {
    width: 250,
    height: 50,
    margin: 10,
  },
  selectContainer:{
    flex: 1,
  },
  titleStyles: {
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainerWithLine: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems:'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignItems: 'flex-start',
    borderColor: '#20232a',
    borderWidth: 1,
    justifyContent: 'space-between',
  },

  infoTitle: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    //fontSize: RFPercentage(2),
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
  },    
});