import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { SearchScreen} from '../scene/searchFreight'
import { TopTapBar } from '../component/toptabbar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const SearchNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.SEARCH_MAIN} component={SearchScreen}/>
  </TopTab.Navigator>
);


