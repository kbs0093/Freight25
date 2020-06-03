import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRoute} from './app-routes';
import {CheckScreen} from '../scene/checkFreight';
import {DetailCheckOwnerScreen} from '../scene/checkFreight';
import {DetailCheckDriverScreen} from '../scene/checkFreight';
import {DetailCheckStopoverScreen} from '../scene/checkFreight';
import {TopTapBar} from '../component/toptabbar';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const CheckNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.CHECK_MAIN} component={CheckScreen} />
  </TopTab.Navigator>
);
export const CheckDetailOwnerNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen
      name={AppRoute.CHECK_DETAIL_OWNER}
      component={DetailCheckOwnerScreen}
    />
  </TopTab.Navigator>
);
export const CheckDetailDriverNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen
      name={AppRoute.CHECK_DETAIL_DRIVER}
      component={DetailCheckDriverScreen}
    />
  </TopTab.Navigator>
);
export const CheckDetailStopoverNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen
      name={AppRoute.CHECK_DETAIL_DRIVER}
      component={DetailCheckStopoverScreen}
    />
  </TopTab.Navigator>
);
