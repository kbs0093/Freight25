import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Linking,
} from 'react-native';
import {
  LayoutElement,
} from '@ui-kitten/components';
import { SearchScreenProps } from '../../navigation/search.navigator';
import { AppRoute } from '../../navigation/app-routes';

export const SearchScreen = (props: SearchScreenProps): LayoutElement => {
    return (
        <React.Fragment>
          <View style={styles.viewForm}>
            <Text>화물 검색화면입니다</Text>
          </View>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    viewForm: {
      flex: 4,
      justifyContent: "center",
      alignItems: "center",
    },
});