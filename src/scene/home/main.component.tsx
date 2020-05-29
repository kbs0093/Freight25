import React, {useState} from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {LayoutElement, Text, ViewPager} from '@ui-kitten/components';
import {OwnerScreenProps} from '../../navigation/home.navigator';
import {MainScreenProps} from '../../navigation/home.navigator';
import {AppRoute} from '../../navigation/app-routes';

export const MainScreen = (props: MainScreenProps): LayoutElement => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const clickButtonType = () => {
    props.navigation.navigate(AppRoute.SEARCH);
  };

  const clickCheck = () => {
    props.navigation.navigate(AppRoute.CHECK);
  };

  return (
    <React.Fragment>
      <View style={styles.viewForm}>
        <TouchableOpacity onPress={clickButtonType}>
          <Image
            style={styles.Button}
            source={require('../../assets/SearchButton-round.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={clickCheck}>
          <Image
            style={styles.Button}
            source={require('../../assets/CheckButton-round.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={{backgroundColor: 'white'}}>
        <Text style={styles.adtitle}> 스폰서 광고 </Text>
      </View>

      <View style={{backgroundColor: 'white', alignItems: 'center', flex: 1}}>
        <Image
          style={styles.adImage}
          source={require('../../assets/AD/ad.jpg')}
        />
      </View>
    </React.Fragment>
  );
};

export const OwnerScreen = (props: OwnerScreenProps): LayoutElement => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const clickButtonType = () => {
    props.navigation.navigate(AppRoute.APPLY);
  };
  const clickCheck = () => {
    props.navigation.navigate(AppRoute.CHECK);
  };

  return (
    <React.Fragment>
      <View style={styles.viewForm}>
        <TouchableOpacity onPress={clickButtonType}>
          <Image
            style={styles.Button}
            source={require('../../assets/ApplyButton.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={clickCheck}>
          <Image
            style={styles.Button}
            source={require('../../assets/CheckButton-round.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={{backgroundColor: 'white'}}>
        <Text style={styles.adtitle}> 스폰서 광고 </Text>
      </View>

      <View style={{backgroundColor: 'white', alignItems: 'center', flex: 1}}>
        <Image
          style={styles.adImage}
          source={require('../../assets/AD/ad.jpg')}
        />
      </View>
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
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Button: {
    width: 355,
    height: 150,
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
