import React, { memo, useMemo } from 'react';
import { Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { styles } from '../styles';
import type { DayRenderProps, RangeValue, SelectionMode } from '../types';
import Day from './Day';

type Props = {
  year: number;
  month: number;
  matrix: (Date | null)[][];
  onDayPress: (d: Date) => void;
  locale?: string;
  monthHeaderStyle?: ViewStyle;
  monthHeaderTextStyle?: TextStyle;
  renderDay?: (date: Date, props: DayRenderProps) => React.ReactNode;
  dayStyle?: ViewStyle;
  dayTextStyle?: TextStyle;
  weekStartsOn: 0 | 1;
  select?: RangeValue;
  mode: SelectionMode;
};

const Month = (props: Props) => {
  const {
    year,
    month,
    matrix,
    onDayPress,
    locale,
    monthHeaderStyle,
    monthHeaderTextStyle,
    renderDay,
    dayStyle,
    dayTextStyle,
    weekStartsOn,
    select,
    mode,
  } = props;

  const monthDate = useMemo(() => {
    return new Date(year, month, 1);
  }, [month, year]);

  const title = useMemo(() => {
    return monthDate.toLocaleString(locale || undefined, {
      month: 'long',
      year: 'numeric',
    });
  }, [locale, monthDate]);

  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale || 'en-US', {
      weekday: 'short',
    });
    const localDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(2023, 10, 5 + i);
      localDays.push(formatter.format(date));
    }
    const rotated = localDays
      .slice(weekStartsOn)
      .concat(localDays.slice(0, weekStartsOn));
    return rotated;
  }, [locale, weekStartsOn]);

  return (
    <View style={styles.monthContainer}>
      <View style={[styles.monthHeader, monthHeaderStyle]}>
        <Text style={[styles.monthHeaderText, monthHeaderTextStyle]}>
          {title}
        </Text>
      </View>
      <View style={styles.weekDaysRow}>
        {weekdays.map((d) => (
          <Text key={d} style={styles.weekDayText}>
            {d}
          </Text>
        ))}
      </View>
      {matrix.map((week, wi) => (
        <View style={styles.weekRow} key={wi}>
          {week.map((date, di) => (
            <Day
              key={date ? date.getTime() : `empty-${wi}-${di}`}
              date={date}
              onPress={onDayPress}
              renderDay={renderDay}
              dayStyle={dayStyle}
              dayTextStyle={dayTextStyle}
              select={select}
              mode={mode}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (
    prevProps.year !== nextProps.year ||
    prevProps.month !== nextProps.month
  ) {
    return false;
  }

  if (prevProps.matrix !== nextProps.matrix) {
    return false;
  }

  if (prevProps.mode !== nextProps.mode) {
    return false;
  }

  if (prevProps.select !== nextProps.select) {
    const prevSelect = prevProps.select;
    const nextSelect = nextProps.select;

    const prevStartTime = prevSelect?.start?.getTime() ?? null;
    const nextStartTime = nextSelect?.start?.getTime() ?? null;
    const prevEndTime = prevSelect?.end?.getTime() ?? null;
    const nextEndTime = nextSelect?.end?.getTime() ?? null;

    if (prevStartTime !== nextStartTime || prevEndTime !== nextEndTime) {
      return false;
    }
  }

  if (
    prevProps.locale !== nextProps.locale ||
    prevProps.weekStartsOn !== nextProps.weekStartsOn
  ) {
    return false;
  }

  if (
    prevProps.monthHeaderStyle !== nextProps.monthHeaderStyle ||
    prevProps.monthHeaderTextStyle !== nextProps.monthHeaderTextStyle ||
    prevProps.dayStyle !== nextProps.dayStyle ||
    prevProps.dayTextStyle !== nextProps.dayTextStyle
  ) {
    return false;
  }

  if (
    prevProps.onDayPress !== nextProps.onDayPress ||
    prevProps.renderDay !== nextProps.renderDay
  ) {
    return false;
  }

  return true;
};

export default memo(Month, areEqual);
