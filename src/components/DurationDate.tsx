import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {
  Duration,
  DurationType,
  getDateFormat,
  getFormattedDuration,
} from '../utils';

export interface DurationDateProps {
  duration: Duration;
  durationType: DurationType;
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

const withTime = false;
const getDisplayText = (
  duration: Duration,
  durationType: DurationType,
): [string, string] => {
  const dateFormat = getDateFormat(withTime);
  const [dayOfWeek, date] = getFormattedDuration(duration, ['ddd', dateFormat]);
  if (durationType === DurationType.WEEK) {
    return [
      `${dayOfWeek[0]} Night - ${dayOfWeek[1]} Night`,
      `${date[0]} - ${date[1]}`,
    ];
  }
  return [`${dayOfWeek[0]} Night`, date[0]];
};

// TODO: make this pressable and display a day/week/date picker for easier date
// traversal
const DurationDate = ({duration, durationType}: DurationDateProps) => {
  const [main, sub] = getDisplayText(duration, durationType);
  return (
    <View style={styles.view}>
      <Text variant="bodyLarge" style={styles.text}>
        {main}
      </Text>
      <Text variant="bodySmall">{sub}</Text>
    </View>
  );
};

export default DurationDate;
