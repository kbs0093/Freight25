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

import Modal from 'react-native-modal'
import Postcode from 'react-native-daum-postcode'
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

const freightStartDate = [
  { text: '당일 상차(당상)'},
  { text: '내일 상차(내상)'},
]

const freightEndDate = [
  { text: '당일 도착(당착)'},
  { text: '내일 도착'},
]
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

  //State를 이용하여 Modal을 제어함
  const [modalStartAddrVisible, setmodalStartAddrVisible] = useState<boolean>(false);
  const [modalEndAddrVisible, setmodalEndAddrVisible] = useState<boolean>(false);

  //Output을 State로 받아서 화면에 표출하거나 정보 값으로 활용
  const [modalStartAddrOutput, setmodalStartAddrOutput] = useState<string>("주소를 선택/변경해주세요");
  const [modalEndAddrOutput, setmodalEndAddrOutput] = useState<string>("주소를 선택/변경해주세요");

  // 당상/당착/내상/내착
  const [selectedStartDateOption, setSelectedStartDateOption] = React.useState(null);
  const [selectedEndDateOption, setSelectedEndDateOption] = React.useState(null);

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
            <Text style={styles.infoTitle}>상차지 : {modalStartAddrOutput}</Text>
            <Button 
              appearance='outline' 
              size='small'
              onPress={() => {
                setmodalStartAddrVisible(true);
              }}
            >변경</Button>
          </View>
          <View style={styles.rowContainerWithLine}>
            <Text style={styles.infoTitle}>상차일 : </Text>
            <Layout style={styles.selectContainer}>
              <Select
                placeholder='선택'
                basic
                data={freightStartDate}
                selectedOption={selectedStartDateOption}
                onSelect={setSelectedStartDateOption}
              />
            </Layout>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>하차지 : {modalEndAddrOutput}</Text>
            <Button 
              appearance='outline'
              size='small'
              onPress={() => {
                setmodalEndAddrVisible(true);
              }}
            >변경</Button>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>하차일 : </Text>
            <Layout style={styles.selectContainer}>
              <Select
                placeholder='선택'
                basic
                data={freightEndDate}
                selectedOption={selectedEndDateOption}
                onSelect={setSelectedEndDateOption}
              />
            </Layout>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>화물 정보</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.infoTitle}>차량 정보 : </Text>
            <Layout style={styles.selectContainer}>
              <Select
                placeholder='톤수'
                data={carSize}
                selectedOption={selectedCarSizeOption}
                onSelect={setSelectedCarSizeOption}
              />
            </Layout>
            <Layout style={styles.selectContainer}>
              <Select
                placeholder='타입'
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
                placeholder='독차/혼적 여부 선택'
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
              placeholder='숫자로 입력'
              value={volumeValue}
              onChangeText={nextValue => setVolumeValue(nextValue)}
            />
            <Layout style={styles.selectContainer}>
              <Select
                placeholder='단위'
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

        <Modal
          //isVisible Props에 State 값을 물려주어 On/off control
          isVisible={modalStartAddrVisible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <View>
            <Postcode
              style={{width: 350, height: 600}}
              jsOptions={{ animated: true }}
              onSelected={(startAddrResult) => {
                setmodalStartAddrOutput(JSON.stringify(startAddrResult.address).replace(/\"/gi, ""))
                setmodalStartAddrVisible(false)
              }}
            />
            <Button
              onPress={() => {
                setmodalStartAddrVisible(false)
              }}>
            뒤로 돌아가기</Button>
          </View>
        </Modal>

        <Modal
          //isVisible Props에 State 값을 물려주어 On/off control
          isVisible={modalEndAddrVisible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
          <View>
            <Postcode
              style={{width: 350, height: 600}}
              jsOptions={{ animated: true }}
              onSelected={(endAddrResult) => {
                setmodalEndAddrOutput(JSON.stringify(endAddrResult.address).replace(/\"/gi, ""))
                setmodalEndAddrVisible(false)
              }}
            />
            <Button
              onPress={() => {
                setmodalEndAddrVisible(false)
              }}>
            뒤로 돌아가기</Button>
          </View>
        </Modal>

        

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

  lineStyle:{
    borderWidth: 0.5,
    borderColor:'black',
    margin:10,
  },

  
});