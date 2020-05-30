import React, {useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Button, LayoutElement} from '@ui-kitten/components';
import {StopoverADScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';
import AsyncStorage from '@react-native-community/async-storage';

export class StopoverADScreen extends React.Component<StopoverADScreenProps> {
  constructor(props) {
    super(props);
    // this.getFreightID;
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('FreightID');
      if (value !== null) {
        var freightID = value + '';
        //const freightID = {FrightID: value + ''};
        console.log('value is' + value);
        var url = '49.50.172.39:8000/stopover?freightId=' + value;
        console.log(url);
        var data = fetch(
          'http://49.50.172.39:8000/stopover?freightId=' + value,
          {},
        )
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            // AsyncStorage.setItem('stopover1', response[0].id);
            // AsyncStorage.setItem('stopover2', response[1].id);
            // AsyncStorage.setItem('stopover3', response[2].id);
          });
      }
    } catch (error) {}
  };

  ApplyButton = () => {
    this.props.navigation.navigate(AppRoute.STOPOVER);
  };

  DenyButton = () => {
    this.props.navigation.navigate(AppRoute.HOME);
  };

  render() {
    return (
      <React.Fragment>
        <View style={{backgroundColor: 'white', alignItems: 'center', flex: 3}}>
          <Image
            style={styles.adImage}
            source={require('../../assets/StopoverAD.jpg')}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: 'white',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Button
              style={{margin: 8}}
              onPress={this.ApplyButton}
              status="success">
              수 락
            </Button>
          </View>
          <View style={{flex: 1}}>
            <Button
              style={{margin: 8}}
              onPress={this.DenyButton}
              status="danger">
              거 부
            </Button>
          </View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  adImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderRadius: 15,
  },
  icon2: {
    justifyContent: 'center',
    width: 20,
    height: 15,
  },
});
