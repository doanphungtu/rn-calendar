import React, { memo, useMemo } from 'react';
import {
  Pressable,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { styles } from '../styles';
import type { DayRenderProps, RangeValue, SelectionMode } from '../types';
import { sameDay, todayDateRef } from '../utils/dateUtils';

const Day = ({
  date,
  onPress,
  renderDay,
  dayStyle,
  dayTextStyle,
  select,
  mode,
}: {
  date: Date | null;
  onPress: (d: Date) => void;
  renderDay?: (date: Date, props: DayRenderProps) => React.ReactNode;
  dayStyle?: ViewStyle;
  dayTextStyle?: TextStyle;
  select?: RangeValue;
  mode: SelectionMode;
}) => {
  if (!date) return <View style={[styles.dayCellEmpty]} />;

  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const normalizedStartDate = select?.start
    ? new Date(
        select.start.getFullYear(),
        select.start.getMonth(),
        select.start.getDate()
      )
    : null;
  const normalizedEndDate = select?.end
    ? new Date(
        select.end.getFullYear(),
        select.end.getMonth(),
        select.end.getDate()
      )
    : null;

  const selectStartTime = normalizedStartDate?.getTime() ?? null;
  const selectEndTime = normalizedEndDate?.getTime() ?? null;
  const dateTime = normalizedDate.getTime();
  const isToday = sameDay(date, todayDateRef);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const props = useMemo<DayRenderProps>(() => {
    let isSelected = false;
    let isInRange = false;
    let isDisabled = false;
    let isRangeStart = false;
    let isRangeEnd = false;

    if (mode === 'single') {
      isSelected = !!selectStartTime && dateTime === selectStartTime;
    } else {
      if (selectStartTime && selectEndTime) {
        if (dateTime >= selectStartTime && dateTime <= selectEndTime) {
          isInRange = true;
        }
        isRangeStart = dateTime === selectStartTime;
        isRangeEnd = dateTime === selectEndTime;
        isSelected = isRangeStart || isRangeEnd;
      } else if (selectStartTime) {
        isRangeStart = dateTime === selectStartTime;
        isSelected = isRangeStart;
      }
    }

    return {
      isToday,
      isSelected,
      isInRange,
      isDisabled,
      isRangeStart,
      isRangeEnd,
    };
  }, [dateTime, mode, selectStartTime, selectEndTime, isToday]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cellStyle: ViewStyle[] = useMemo(() => {
    const s: ViewStyle[] = [styles.dayCell];
    if (dayStyle) {
      s.push(dayStyle);
    }

    if (props.isToday && props.isInRange) {
      s.push({ borderColor: 'transparent' });
    }

    if (props.isRangeStart && !props.isRangeEnd) {
      s.push(styles.rangeStart);
    } else if (props.isRangeEnd && !props.isRangeStart) {
      s.push(styles.rangeEnd);
    } else if (props.isInRange && !props.isRangeStart && !props.isRangeEnd) {
      s.push(styles.dayInRange);
    }

    if (props.isSelected) {
      s.push(styles.daySelected);
      if (props.isRangeStart && props.isRangeEnd) {
        s.push(styles.daySelectedSingleOrOneDayRange);
      }
    }

    return s;
  }, [
    dayStyle,
    props.isToday,
    props.isInRange,
    props.isRangeStart,
    props.isRangeEnd,
    props.isSelected,
  ]);

  const content = renderDay ? (
    renderDay(date, props)
  ) : (
    <Text
      style={[
        styles.dayText,
        dayTextStyle,
        isToday ? styles.dayTextToday : null,
        props.isInRange ? styles.dayTextInRange : null,
        props.isSelected ? styles.dayTextSelected : null,
      ]}
    >
      {date.getDate()}
    </Text>
  );

  return (
    <Pressable
      onPress={props.isDisabled ? undefined : () => onPress(date)}
      style={cellStyle}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)', borderless: false }}
      disabled={props.isDisabled}
      unstable_pressDelay={0}
    >
      {content}
    </Pressable>
  );
};

const areEqual = (
  prevProps: {
    date: Date | null;
    onPress: (d: Date) => void;
    renderDay?: (date: Date, props: DayRenderProps) => React.ReactNode;
    dayStyle?: ViewStyle;
    dayTextStyle?: TextStyle;
    select?: RangeValue;
    mode: SelectionMode;
  },
  nextProps: {
    date: Date | null;
    onPress: (d: Date) => void;
    renderDay?: (date: Date, props: DayRenderProps) => React.ReactNode;
    dayStyle?: ViewStyle;
    dayTextStyle?: TextStyle;
    select?: RangeValue;
    mode: SelectionMode;
  }
) => {
  if (prevProps.date !== nextProps.date) {
    const prevTime = prevProps.date?.getTime() ?? null;
    const nextTime = nextProps.date?.getTime() ?? null;
    if (prevTime !== nextTime) return false;
  }

  if (prevProps.mode !== nextProps.mode) return false;

  if (prevProps.select !== nextProps.select) {
    const date = nextProps.date;
    if (!date) return true;

    const prevSelect = prevProps.select;
    const nextSelect = nextProps.select;

    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const normalizeDate = (d: Date | null | undefined) => {
      if (!d) return null;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };

    const prevStartTime = normalizeDate(prevSelect?.start);
    const nextStartTime = normalizeDate(nextSelect?.start);
    const prevEndTime = normalizeDate(prevSelect?.end);
    const nextEndTime = normalizeDate(nextSelect?.end);
    const dateTime = normalizedDate.getTime();

    if (prevStartTime !== nextStartTime || prevEndTime !== nextEndTime) {
      const wasInRange =
        prevStartTime !== null &&
        prevEndTime !== null &&
        dateTime >= prevStartTime &&
        dateTime <= prevEndTime;

      const isInRange =
        nextStartTime !== null &&
        nextEndTime !== null &&
        dateTime >= nextStartTime &&
        dateTime <= nextEndTime;

      const wasStartOrEnd =
        dateTime === prevStartTime || dateTime === prevEndTime;
      const isStartOrEnd =
        dateTime === nextStartTime || dateTime === nextEndTime;

      if (wasInRange !== isInRange || wasStartOrEnd !== isStartOrEnd) {
        return false;
      }
    }
  }

  if (
    prevProps.dayStyle !== nextProps.dayStyle ||
    prevProps.dayTextStyle !== nextProps.dayTextStyle
  ) {
    return false;
  }

  if (
    prevProps.onPress !== nextProps.onPress ||
    prevProps.renderDay !== nextProps.renderDay
  ) {
    return false;
  }

  return true;
};

export default memo(Day, areEqual);
