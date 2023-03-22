import React from 'react';
import {Text} from 'react-native-paper';
import {ScrollView} from 'react-native';
import {ScrollScreen} from '../components';
import {UserSleepData} from '../state/sleep';

interface Props {
  data: UserSleepData;
}

const SleepReportScreen = ({data}: Props) => {
  return (
    <ScrollScreen>
      <ScrollView>
        <Text variant="headlineMedium">Sleep Report Screen</Text>
        <Text variant="bodyLarge">{JSON.stringify(data)}</Text>
      </ScrollView>
    </ScrollScreen>
  );
};

export default SleepReportScreen;
