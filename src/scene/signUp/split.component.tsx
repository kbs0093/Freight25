import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  LayoutElement, 
  Divider,
  Select,
  Button,
  Input,  
} from '@ui-kitten/components';
import { SplitScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';




export const SplitScreen = (props: SplitScreenProps): LayoutElement => {
  const clickOwner = () => {
    props.navigation.navigate(AppRoute.SIGNUP_OWNER_MAIN);
  };
  const clickDriver = () => {
    props.navigation.navigate(AppRoute.SIGNUP_DRIVER_MAIN);
  };

  return(
    <React.Fragment>
      <View style={{backgroundColor: 'white'}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, margin: 10}}>회원가입</Text>
        <Divider style={{backgroundColor: 'black'}}/>
      </View>
      <View style={styles.viewForm}>
        <TouchableOpacity onPress={clickDriver}>
          <Image 
            style={styles.Button} 
            source={require('../../assets/signup_driver_button.jpg')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={clickOwner}>
            <Image
              style={styles.Button}
              source={require('../../assets/signup_owner_button.jpg')}
            />
          </TouchableOpacity>
      </View>
      
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  Button: {
    width: 355,
    height: 200,
    margin: 10,
    borderRadius: 5,
  },
  viewForm: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});