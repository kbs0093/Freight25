import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRoute} from './app-routes';
import {CheckScreen} from '../scene/checkFreight';
import {DetailCheckScreen} from '../scene/checkFreight';
import {TopTapBar} from '../component/toptabbar';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const CheckNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.CHECK_MAIN} component={CheckScreen} />
    <Stack.Screen name={AppRoute.CHECK_DETAIL} component={DetailCheckScreen} />
  </TopTab.Navigator>
);
