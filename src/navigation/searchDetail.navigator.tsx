import React from 'react';
import { AppRoute } from './app-routes';
import { DetailScreen, aloneDetailScreen } from '../scene/searchFreight'
import { TopTapBar } from '../component/toptabbar'
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTab2 = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export const searchDetailNavigator = (): React.ReactElement => (
  <TopTab2.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.SEARCH_DETAIL_MAIN} component={DetailScreen}/>
  </TopTab2.Navigator>
);

export const aloneDetailNavigator = (): React.ReactElement => (
  <TopTab2.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.ALONE_DETAIL_MAIN} component={aloneDetailScreen}/>
  </TopTab2.Navigator>
);
