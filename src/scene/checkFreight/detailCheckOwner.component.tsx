import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import {
  Text,
  Layout,
  LayoutElement,
  TopNavigationAction,
  TopNavigation,
  OverflowMenu,
  Icon,
  Button,
  Divider,
} from '@ui-kitten/components';
import {DetailCheckOwnerScreenProps} from '../../navigation/check.navigator';
import AsyncStorage from '@react-native-community/async-storage';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import TextTicker from 'react-native-text-ticker';
import {ThemeContext} from '../../component/theme-context';

const phoneIcon = (style) => <Icon {...style} name="phone-outline" />;
const naviIcon = (style) => <Icon {...style} name="compass-outline" />;
const plusIcon = (style) => <Icon {...style} name="plus-outline" />;
const homeIcon = (style) => <Icon {...style} name="home-outline" />;
const carIcon = (style) => <Icon {...style} name="car-outline" />;

export const DetailCheckOwnerScreen = (
  props: DetailCheckOwnerScreenProps,
): LayoutElement => {
  const [FreightID, setFreightID] = React.useState('');
  const [driverTel, setDriverTel] = React.useState('');
  const [data, setData] = React.useState([]);
  const [lastState, setState] = React.useState([]);

  const themeContext = React.useContext(ThemeContext);

  useEffect(() => {
    requestFirebase();
  }, []);

  const requestFirebase = async () => {
    var freightID;
    try {
      const value = await AsyncStorage.getItem('FreightID');
      if (value !== null) {
        freightID = value;
        setFreightID(value);
      }
    } catch (error) {}

    var user = auth().currentUser;

    if (user != null) {
      var docRef = firestore().collection('freights').doc(freightID);

      docRef.get().then(function (doc) {
        //doc.data()에 상세정보 저장되어 있습니다.
        //화물의 배정 기사 변수: driverId
        //화물 배정 상태 변수: state
        var list = [];

        if (doc.exists) {
          const docs = doc.data();
          console.log('Document data:', docs.id);

          var freightState = '';
          var startAddrArray = docs.startAddr.split(' ');
          var endAddrArray = docs.endAddr.split(' ');
          var docStartDate = '';

          var startAddrFullArray = docs.startAddr_Full.split(' ');
          var endAddrFullArray = docs.endAddr_Full.split(' ');

          var i = 2,
            j = 2;
          var startAddrDetail = '';
          var endAddrDetail = '';
          for (i = 3; i < startAddrFullArray.length; i++) {
            startAddrDetail += startAddrFullArray[i] + ' ';
          }
          for (j = 3; j < endAddrFullArray.length; j++) {
            endAddrDetail += endAddrFullArray[j] + ' ';
          }

          if (docs.state == 0) {
            freightState = '배송전';
            docStartDate = new Date(docs.startDay._seconds * 1000);
          } else if (docs.state == 1) {
            freightState = '배송중';
            if (docs.timeStampAssigned == null) {
              docStartDate = new Date(docs.startDay._seconds * 1000);
            } else
              docStartDate = new Date(docs.timeStampAssigned._seconds * 1000);
          } else if (docs.state == 2) {
            freightState = '배송완료';
            if (docs.timeStampAssigned == null) {
              docStartDate = new Date(docs.startDay._seconds * 1000);
            } else
              docStartDate = new Date(docs.timeStampAssigned._seconds * 1000);
          }
          var moneyprint = docs.expense + '';
          moneyprint = moneyprint
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          list.push({
            key: docs.id,
            lastState: freightState, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
            dist: docs.dist,
            startDate: docs.startDate, // 배송 출발 날짜 -> UI 고치기
            endDate: docs.endDate,
            expense: moneyprint,
            startAddr: docs.startAddr,
            endAddr: docs.endAddr,
            startAddrFullArray: startAddrFullArray,
            endAddrFullArray: endAddrFullArray,
            startAddrArray: startAddrArray,
            endAddrArray: endAddrArray,
            startAddrDetail: startAddrDetail,
            endAddrDetail: endAddrDetail,
            driveOption: docs.driveOption,
            driverTel: docs.driverTel,
            desc: docs.desc,

            startMonth: docStartDate.getMonth() + 1,
            startDay: docStartDate.getDate(),
            startDayLabel: doc.startDayLabel,
            endDayLabel: doc.endDayLabel,
          });
          setData(list);
          setState(freightState);
          setDriverTel(docs.driverTel);
        } else {
          console.log('No such document!');
        }
      });
    }
  };

  const callDriver = () => {
    console.log('Call to the driver');
    console.log(driverTel);
    Linking.openURL(`tel:${driverTel}`);
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const deleteFreight = () => {};

  const _renderItem = ({item}) => (
    <Layout>
      <View style={{flexDirection: 'row'}}>
        {/* <View style={{flex: 1, justifyContent: 'center'}}>
          <View></View>
          <TouchableOpacity onPress={navigateBack}>
            <Icon
              name="arrow-back-outline"
              width={28}
              height={28}
              fill={themeContext.theme == 'dark' ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View> */}
        <View
          style={{
            flex: 3,
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={styles.Subtitle}>화물 내역</Text>
        </View>
        <View
          style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
          {item.lastState == '배송중' ? (
            <Button
              style={styles.Badge}
              appearance="outline"
              status="danger"
              icon={carIcon}
              textStyle={styles.badgeText}>
              {item.lastState}
            </Button>
          ) : (
            <Button
              style={styles.Badge}
              appearance="outline"
              textStyle={styles.badgeText}>
              {item.lastState}
            </Button>
          )}
          {/* <Divider style={{backgroundColor: 'black'}} /> */}
        </View>
      </View>

      <Divider style={{backgroundColor: 'black'}} />

      <View style={styles.geoContainer}>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>
            {item.startAddrArray[0]} {item.startAddrArray[1]}{' '}
          </Text>
          <Text style={styles.geoText}>{item.startAddrArray[2]}</Text>
          <Text style={styles.geoSubText}>{item.startDate}</Text>
        </View>
        <View style={styles.geoInfoContainer}>
          <View>
            <Icon
              style={styles.iconSize}
              fill="#8F9BB3"
              name="arrow-forward-outline"
            />
          </View>
          <View>
            <Text style={styles.geoSubText3}>{item.driveOption}</Text>
          </View>
        </View>
        <View style={styles.geoInfoContainer}>
          <Text style={styles.geoText}>
            {item.endAddrArray[0]} {item.endAddrArray[1]}
          </Text>
          <Text style={styles.geoText}>{item.endAddrArray[2]}</Text>
          <Text style={styles.geoSubText2}>{item.endDate}</Text>
        </View>
      </View>

      <Divider style={{backgroundColor: 'black'}} />

      <View style={styles.freightInfoTotalContainer}>
        <View style={styles.freightInfoHalfContainer} key="1">
          {item.lastState == '배송전' ? (
            <Text style={styles.infoTitle}>등록 날짜:</Text>
          ) : (
            <Text style={styles.infoTitle}>배차 날짜:</Text>
          )}
          {item.lastState == '배송전' ? (
            <Text style={styles.infoTitle}>예상 운행 거리:</Text>
          ) : (
            <Text style={styles.infoTitle}>운행 거리:</Text>
          )}
          <Text style={styles.infoTitle}>운행 운임:</Text>
          <Text style={styles.infoTitle}>운행 방식:</Text>
          <Text style={styles.infoTitle}>상차지 주소:</Text>
          <Text style={styles.infoTitle}>하차지 주소:</Text>
          <Text style={styles.infoTitle}>화물 설명:</Text>
          {item.lastState == '배송중' ? (
            <Text style={styles.infoTitle}>기사 전화번호:</Text>
          ) : null}
        </View>
        <View style={styles.freightInfoHalfRightContainer}>
          <Text style={styles.infoRightTitle}>
            {item.startMonth}월 {item.startDay}일
          </Text>
          <Text style={styles.infoRightTitle}>{item.dist} KM</Text>
          <Text style={styles.infoRightTitle}>{item.expense} 원</Text>
          <Text style={styles.infoRightTitle}>{item.driveOption}</Text>
          <TextTicker
            style={
              themeContext.theme == 'dark'
                ? {fontWeight: 'bold', fontSize: 18, margin: 2, color: 'white'}
                : {fontWeight: 'bold', fontSize: 18, margin: 2, color: 'black'}
            }
            duration={3000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}>
            {item.startAddrFullArray[0]} {item.startAddrFullArray[1]}{' '}
            {item.startAddrFullArray[2]} {item.startAddrDetail}
          </TextTicker>
          <TextTicker
            style={
              themeContext.theme == 'dark'
                ? {fontWeight: 'bold', fontSize: 18, margin: 2, color: 'white'}
                : {fontWeight: 'bold', fontSize: 18, margin: 2, color: 'black'}
            }
            duration={3000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}>
            {item.endAddrFullArray[0]} {item.endAddrFullArray[1]}{' '}
            {item.endAddrFullArray[2]} {item.endAddrDetail}
          </TextTicker>

          <Text style={styles.infoRightTitle}>{item.desc}</Text>
          {item.lastState == '배송중' ? (
            <Text style={styles.infoTitle}>{item.driverTel}</Text>
          ) : null}
        </View>
      </View>
      <Divider style={{backgroundColor: 'black'}} />
    </Layout>
  );

  const renderCallButton = () => {
    var isDisable;
    if (lastState == '배송전') {
      isDisable = true;
    } else if (lastState == '배송중') {
      isDisable = false;
    } else if (lastState == '배송완료') {
      isDisable = false;
    }

    return (
      <Button
        onPress={() => {
          callDriver();
        }}
        style={styles.button}
        status="success"
        icon={phoneIcon}
        disabled={isDisable}
        textStyle={styles.callButtonText}>
        화주 전화
      </Button>
    );
  };

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <Layout style={{flex: 1}}>
        <Layout style={{flex: 4}}>
          <FlatList
            style={
              themeContext.theme == 'dark'
                ? {backgroundColor: '#222B45'}
                : {backgroundColor: '#FFFFFF'}
            }
            data={data}
            renderItem={_renderItem}
          />
        </Layout>

        <Layout style={styles.ButtonContainter}>
          <Layout style={styles.ButtonHalfContainer}>
            {renderCallButton()}
          </Layout>
          <Layout style={{flex: 1, alignItems: 'center'}}>
            <Button status="danger" onPress={deleteFreight}>
              삭제
            </Button>
          </Layout>
          {/* <View style={styles.ButtonHalfContainer}>{reviewButton}</View> */}
        </Layout>

        <View style={{alignItems: 'center', flex: 1.6}}>
          <Image
            style={styles.adImage}
            source={require('../../assets/AD/ad2.jpg')}
          />
        </View>
      </Layout>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  Badge: {
    width: RFPercentage(14),
    height: RFPercentage(6),
    borderRadius: 8,
    margin: 5,
  },
  smallBadge: {
    width: RFPercentage(12),
    height: RFPercentage(2),
  },
  badgeText: {
    fontSize: RFPercentage(2),
  },
  button: {
    width: RFPercentage(28),
    height: RFPercentage(8),
    borderRadius: 8,
  },
  buttonText: {
    fontSize: RFPercentage(1.5),
  },
  callButton: {
    width: RFPercentage(30),
    height: RFPercentage(6),
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: RFPercentage(1.5),
  },
  titleStyles: {
    paddingHorizontal: 20,
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  Subtitle: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
  },
  freightContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  freightInfoTotalContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
  },
  freightInfoHalfContainer: {
    flex: 1,
    paddingRight: 15,
    alignItems: 'flex-end',
  },
  freightInfoHalfRightContainer: {
    flex: 2,
    paddingLeft: 15,
    alignItems: 'flex-start',
  },
  geoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  geoInfoContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  geoText: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
  },
  geoSubText: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    paddingVertical: 15,
    color: '#2F80ED',
  },
  geoSubText2: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    paddingVertical: 15,
    color: '#EB5757',
  },
  geoSubText3: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    paddingVertical: 15,
    color: '#9B51E0',
  },
  infoTitle: {
    paddingVertical: 4,
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
  infoRightTitle: {
    paddingVertical: 4,
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  totalInfoContainer: {
    flexDirection: 'row',
    flex: 1,
    borderColor: '#20232a',
    marginTop: -30,
  },
  totalInfoHalfContainer: {
    flex: 1,
  },
  ButtonContainter: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  ButtonHalfContainer: {
    flex: 2,
    alignItems: 'center',
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
  adImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderRadius: 15,
  },
});
