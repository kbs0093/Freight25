import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { SearchScreen, DetailScreen } from '../scene/searchFreight'
import { TopTapBar } from '../component/toptabbar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CARIcon, MAPIcon, PersonIcon} from '../assets/icons'

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const Tab = createBottomTabNavigator();


export const SearchNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.SEARCH_MAIN} component={SearchScreen}/>
  </TopTab.Navigator>
);

export const SearchDetailNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.SEARCH_DETAIL_MAIN} component={DetailScreen}/>
  </TopTab.Navigator>
);