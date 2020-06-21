import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Icon,
  Text,
  Layout,
  LayoutElement,
  Divider,
  Button,
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
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import {ThemeContext} from '../../component/theme-context';

const isAndroid = Platform.OS === 'android';

export const CheckScreen = (props: CheckScreenProps): LayoutElement => {
  const [data, setData] = React.useState([]);
  const [userType, setUserType] = React.useState('');
  const [sorting, setSorting] = React.useState('');
  const themeContext = React.useContext(ThemeContext);

  useEffect(() => {
    requestFirebase();
  }, []);

  useEffect(() => {
    listSort();
  }, []);

  const requestFirebase = async () => {
    var userType;
    try {
      const value = await AsyncStorage.getItem('userType');
      if (value !== null) {
        userType = value;
        setUserType(value);
      }
    } catch (error) {}

    var user = auth().currentUser;

    if (user != null) {
      //var ref = firestore().collection('freights');
      var ref = null;
      if (userType == 'driver') {
        ref = firestore()
          .collection('freights')
          .where('driverId', '==', user.uid);
      } else if ((userType = 'owner')) {
        ref = firestore()
          .collection('freights')
          .where('ownerId', '==', user.uid);
      }

      ref.get().then(async function (querySnapshot) {
        var list = [];

        for (var docCnt in querySnapshot.docs) {
          const doc = querySnapshot.docs[docCnt].data();
          console.log(docCnt + '번째 화물 id: ' + doc.id);

          var freightState = '';
          var isMixed = false;

          if (doc.state == 0) {
            freightState = '배송전';
            docStartDate = new Date(doc.startDay._seconds * 1000);
          } else if (doc.state == 1) {
            freightState = '배송중';
            if (doc.timeStampAssigned == null) {
              docStartDate = new Date(doc.startDay._seconds * 1000);
            } else
              docStartDate = new Date(doc.timeStampAssigned._seconds * 1000);
          } else if (doc.state == 2) {
            freightState = '배송완료';
            if (doc.timeStampAssigned == null) {
              docStartDate = new Date(doc.startDay._seconds * 1000);
            } else
              docStartDate = new Date(doc.timeStampAssigned._seconds * 1000);
          }

          var docStartDate = new Date(doc.startDay._seconds * 1000);
          var docEndDate = new Date(doc.endDay._seconds * 1000);

          var startAddrArray = doc.startAddr.split(' ');
          var endAddrArray = doc.endAddr.split(' ');

          var oppositeFreightId = '';
          if (doc.oppositeFreightId != null) {
            oppositeFreightId = doc.oppositeFreightId;
          }

          list.push({
            id: doc.id, // Freight key?
            oppositeFreightId: oppositeFreightId,
            lastState: freightState, // 0 -> 배송전, 1 -> 배송중, 2 -> 배송완료
            stateNum: doc.state,
            startAddress: doc.startAddr,
            endAddress: doc.endAddr,
            distance: doc.dist,
            startAddrArray: startAddrArray,
            endAddrArray: endAddrArray,

            // Registered Date
            startMonth: docStartDate.getMonth() + 1,
            startDay: docStartDate.getDate(),
            endMonth: docEndDate.getMonth() + 1,
            endDay: docEndDate.getDate(),
            startDayLabel: doc.startDayLabel,
            endDayLabel: doc.endDayLabel,
          });
        }
        setData(list);
      });
    }
  };

  const ClickList = (item) => () => {
    AsyncStorage.setItem('FreightID', item.id);
    AsyncStorage.setItem('OppoFreightID', item.oppositeFreightId);
    if (userType == 'owner') {
      props.navigation.navigate(AppRoute.CHECK_DETAIL_OWNER);
    } else if (userType == 'driver') {
      props.navigation.navigate(AppRoute.CHECK_DETAIL_DRIVER);
    } else {
      console.log('undefined usertype');
    }
  };

  const listSort = () => {
    var value = sorting;
    if (value == '1') {
      console.log(value);
      if (data.startMonth == data.startMonth) {
        data.sort((a, b) => {
          return a.startDay < b.startDay ? 1 : -1;
        });
      } else {
        data.sort((a, b) => {
          return a.startMonth < b.startMonth ? 1 : -1;
        });
      }
    } else if (value == '2') {
      console.log(value);
      if (data.startMonth == data.startMonth) {
        data.sort((a, b) => {
          return a.startDay > b.startDay ? 1 : -1;
        });
      } else {
        data.sort((a, b) => {
          return a.startMonth > b.startMonth ? 1 : -1;
        });
      }
    } else if (value == '3') {
      console.log(value);
      data.sort((a, b) => {
        return a.stateNum > b.stateNum ? 1 : -1;
      });
    }
  };
  listSort();

  const _renderItem = ({item}) => (
    <TouchableOpacity onPress={ClickList(item)}>
      <Layout style={styles.container}>
        <Layout style={styles.geoContainer}>
          <View style={styles.geoInfo1}>
            <View style={styles.geoInfo11}>
              <Text style={styles.geoText}>
                {item.startAddrArray[0]} {item.startAddrArray[1]}
              </Text>
              <Text style={styles.geoText}>{item.startAddrArray[2]}</Text>
            </View>
            <View style={styles.geoInfo12}>
              <Icon
                style={styles.icon}
                fill="#8F9BB3"
                name="arrow-forward-outline"
              />
            </View>
            <View style={styles.geoInfo11}>
              <Text style={styles.geoText}>
                {item.endAddrArray[0]} {item.endAddrArray[1]}
              </Text>
              <Text style={styles.geoText}>{item.endAddrArray[2]}</Text>
            </View>
          </View>
          <View style={styles.geoInfo1}>
            {item.lastState == '배송전' ? (
              <Text style={styles.timeText}>
                {item.startMonth}월 {item.startDay}일 {item.startDayLabel}요일
              </Text>
            ) : (
              <Text style={styles.timeText}>
                {item.startMonth}월 {item.startDay}일 {item.startDayLabel}요일 -{' '}
                {item.endMonth}월 {item.endDay}일 {item.endDayLabel}요일
              </Text>
            )}
          </View>
        </Layout>
        <View style={styles.statusInfo}>
          {item.lastState == '배송중' ? (
            <Text style={styles.badgeTextRed}>{item.lastState}</Text>
          ) : (
            <Text style={styles.badgeText}>{item.lastState}</Text>
          )}
          {item.oppositeFreightId != '' ? (
            <Text style={styles.badgeTextMixed}>경유지 O</Text>
          ) : null}
        </View>
      </Layout>
      <Divider style={{backgroundColor: 'black'}} />
    </TouchableOpacity>
  );

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <Layout
        style={{
          height: '8%',
          flexDirection: 'row',
          backgroundColor: 'white',
        }}>
        <Layout style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, margin: 5}}>
            검색 조건 :
          </Text>
        </Layout>
        <Layout
          style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSorting(value);
              //listSort();
            }}
            placeholder={{
              label: '정렬 순서',
              value: null,
            }}
            useNativeAndroidPickerStyle={isAndroid ? true : false}
            items={[
              {label: '최근 날짜 순', value: '1'},
              {label: '예전 날짜 순', value: '2'},
              {label: '상태별 정렬', value: '3'},
            ]}
            style={{
              placeholder: {
                color: 'orange',
              },
            }}
          />
        </Layout>
      </Layout>
      <Divider style={{backgroundColor: 'black'}} />

      <FlatList
        style={
          themeContext.theme == 'dark'
            ? {backgroundColor: '#222B45'}
            : {backgroundColor: '#FFFFFF'}
        }
        data={data}
        renderItem={_renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
      {/* </ScrollView> */}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  Badge: {
    width: RFPercentage(12),
    height: RFPercentage(4),
    borderRadius: 8,
  },
  badgeText: {
    fontSize: RFPercentage(1.8),
    fontWeight: 'bold',
    color: '#2F80ED',
    //color: 'blue',
  },
  badgeTextMixed: {
    fontSize: RFPercentage(1.8),
    fontWeight: 'bold',
    //color: 'green',
    color: '#9B51E0',
  },

  badgeTextRed: {
    fontSize: RFPercentage(1.8),
    fontWeight: 'bold',
    //color: 'red',
    color: '#EB5757',
  },
  container: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
  },
  geoContainer: {
    flex: 3.5,
    flexDirection: 'column',
  },
  geoInfo1: {
    paddingVertical: 3,
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  geoText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(3),
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.5),
  },
  geoInfo11: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 2,
  },
  geoInfo12: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 0.5,
  },
  statusInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    //borderWidth: 0.5,
  },
  icon: {
    width: 32,
    height: 32,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  },
});
