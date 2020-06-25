import React, { useEffect } from 'react';
import {Image, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {LayoutElement, Text, Layout} from '@ui-kitten/components';
import {OwnerScreenProps} from '../../navigation/home.navigator';
import {MainScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-community/async-storage';
const isAndroid = (Platform.OS === 'android')


export const MainScreen = (props: MainScreenProps): LayoutElement => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const clickButtonType = () => {
    props.navigation.navigate(AppRoute.SEARCH);
  };

  const clickCheck = () => {
    props.navigation.navigate(AppRoute.CHECK_MAIN);
  };

  // Push Notification part (background)
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
  // Push Notification part (foreground)
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      var message = JSON.stringify(remoteMessage);
      message = JSON.parse(message)
      var parsed_message = message.notification;
      if (!isAndroid){
        parsed_message = message.data.notification;
      }
      Alert.alert(parsed_message.title ,parsed_message.body);
    });
    return unsubscribe;
  }, []);

  return (
    <React.Fragment>
      <Layout style={styles.viewForm}>
        <TouchableOpacity onPress={clickButtonType} style={styles.Button}>
          <Image
            style={styles.Image}
            source={require('../../assets/SearchButton-round.png')}
          />
        </TouchableOpacity>                      
        <TouchableOpacity onPress={clickCheck} style={styles.Button}>
          <Image
            style={styles.Image}
            source={require('../../assets/CheckButton-round.png')}
          />
        </TouchableOpacity>
             
      </Layout>

      <Layout>
        <Text style={styles.adtitle}> 스폰서 광고 </Text>
      </Layout>

      <Layout style={{alignItems: 'center', flex: 1}}>
        <Image
          style={styles.adImage}
          source={require('../../assets/AD/ad.png')}
        />
      </Layout>
    </React.Fragment>
  );
};

export const OwnerScreen = (props: OwnerScreenProps): LayoutElement => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const clickButtonType = () => {
    props.navigation.navigate(AppRoute.APPLY);
  };
  const clickCheck = () => {
    props.navigation.navigate(AppRoute.CHECK_MAIN);
  };
  
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  if (messaging().isDeviceRegisteredForRemoteMessages) {
    messaging().registerDeviceForRemoteMessages();
  }
  
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    AsyncStorage.setItem('FreightID', remoteMessage.notification.id)
    .then(() => {
      AsyncStorage.setItem('OppoFreightID', remoteMessage.notification.oppositeFreightId)
      .then(() => {
        props.navigation.navigate(AppRoute.CHECK_DETAIL_DRIVER);
      })
    })
  });

  // Push Notification part (foreground)
  useEffect(() => {
      
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      var message = JSON.stringify(remoteMessage);
      message = JSON.parse(message)
      var parsed_message = message.notification;
      if (!isAndroid){
        parsed_message = message.data.notification;
      }
      Alert.alert(parsed_message.title ,parsed_message.body);
    });
    return unsubscribe;
  }, []);

  return (
    <React.Fragment>
      <Layout style={styles.viewForm}>
      <TouchableOpacity onPress={clickButtonType} style={styles.Button}>
          <Image
            style={styles.Image}
            source={require('../../assets/ApplyButton.jpg')}
          />
        </TouchableOpacity>                      
        <TouchableOpacity onPress={clickCheck} style={styles.Button}>
          <Image
            style={styles.Image}
            source={require('../../assets/CheckButton-round.png')}
          />
        </TouchableOpacity>
      </Layout>

      <Layout>
        <Text style={styles.adtitle}> 스폰서 광고 </Text>
      </Layout>

      <Layout style={{alignItems: 'center', flex: 1}}>
        <Image
          style={styles.adImage}
          source={require('../../assets/AD/ad.png')}
        />
      </Layout>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  adImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderRadius: 15,
  },
  adtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 5,
  },
  viewForm: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '45%',
    margin: 10,
    borderRadius: 15,
  },
  Image: {
    width: '90%',
    height: '100%',
    margin: 10,
    borderRadius: 15,
  },
  IconButton: {
    width: 355,
    height: 50,
    margin: 10,
  },
  IconButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  empty: {
    marginVertical: 20,
  },
});
