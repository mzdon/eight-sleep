import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration, getIntervalDataPointsWithinDuration} from '../utils';
import Card from './Card';

export interface TemperatureCardProps {
  duration: Duration;
  sleepData: UserSleepData | null;
}

interface Data {
  bed: [string, [string, number][]][];
  room: [string, [string, number][]][];
}

function determineData(
  sleepData: UserSleepData | null,
  duration: Duration,
): Data {
  const timeseries = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'timeseries',
  );
  let data: Data = {bed: [], room: []};
  return timeseries.reduce((curr, next) => {
    return {
      bed: [...curr.bed, [next[0], next[1].tempBedC]],
      room: [...curr.room, [next[0], next[1].tempRoomC]],
    };
  }, data);
}

const TemperatureCard = ({sleepData, duration}: TemperatureCardProps) => {
  const {bed, room} = determineData(sleepData, duration);
  return (
    <Card>
      <Text variant="headlineSmall">Tempurature</Text>
      <Text>
        {!bed.length && !room.length ? 'No data!' : JSON.stringify({bed, room})}
      </Text>
    </Card>
  );
};

export default TemperatureCard;
