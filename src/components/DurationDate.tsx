import moment from 'moment';
import React from 'react';
import {Text} from 'react-native-paper';
import {Duration, DurationType, getDateFormat} from '../utils';

export interface DurationDateProps {
  duration: Duration;
  durationType: DurationType;
}

const withTime = false;
const getDisplayText = (
  duration: Duration,
  durationType: DurationType,
): string => {
  const dateFormat = getDateFormat(withTime);
  if (durationType === DurationType.WEEK) {
    return `${moment(duration[0]).format(dateFormat)} - ${moment(
      duration[1],
    ).format(dateFormat)}`;
  }
  return moment(duration[0]).format(dateFormat);
};

// TODO: make this pressable and display a day/week/date picker for easier date traversal
const DurationDate = ({duration, durationType}: DurationDateProps) => {
  const durationText = getDisplayText(duration, durationType);
  return <Text variant="headlineSmall">{durationText}</Text>;
};

export default DurationDate;
