import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import {
  Button,
  LayoutElement,
} from '@ui-kitten/components';
import {StopoverADScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';


export const StopoverADScreen = (props: StopoverADScreenProps): LayoutElement => {

  const ApplyButton = () => {
    props.navigation.navigate(AppRoute.STOPOVER);
  };

  const DenyButton = () => {
    props.navigation.navigate(AppRoute.HOME);
  };

  return (
    <React.Fragment>
      <View style={{backgroundColor: 'white', alignItems: 'center', flex: 3}}>
        <Image style={styles.adImage} source={require('../../assets/StopoverAD.jpg')}/>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: 'white', flex: 1}}>
        <View style={{flex: 1}}> 
          <Button style={{margin: 8}} onPress={ApplyButton} status='success'>수 락</Button>
        </View>
        <View style={{flex: 1}}>
          <Button style={{margin: 8}} onPress={DenyButton} status='danger'>거 부</Button>
        </View>
      </View>
    </React.Fragment>
  ); 
  
};

const styles = StyleSheet.create({
  adImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderRadius: 15
  },
  icon2:{
    justifyContent: 'center',
    width: 20,
    height: 15,
  },
});
