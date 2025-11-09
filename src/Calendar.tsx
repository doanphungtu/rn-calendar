import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Text } from 'react-native';
import Month from './components/Month';
import { styles } from './styles';
import type { CalendarProps } from './types';
import {
  clamp,
  compareDay,
  generateMonthMatrix,
  monthKey,
} from './utils/dateUtils';

export const Calendar = (props: CalendarProps) => {
  const {
    mode = 'single',
    value,
    onChange,
    startYear,
    endYear,
    locale,
    weekStartsOn = 0,
    renderDay,
    dayStyle,
    dayTextStyle,
    monthHeaderStyle,
    monthHeaderTextStyle,
    preloadMonthCount = 2,
  } = props;

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const today = useMemo(() => new Date(), []);
  const base = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today]
  );

  const currentYear = base.getFullYear();
  const defaultStartYear = startYear ?? currentYear - 3;
  const defaultEndYear = endYear ?? currentYear + 3;

  const months: { year: number; month: number }[] = useMemo(() => {
    const arr: { year: number; month: number }[] = [];
    const startY = Math.min(defaultStartYear, defaultEndYear);
    const endY = Math.max(defaultStartYear, defaultEndYear);

    for (let y = startY; y <= endY; y++) {
      for (let m = 0; m < 12; m++) arr.push({ year: y, month: m });
    }
    return arr;
  }, [defaultStartYear, defaultEndYear]);

  const initialIndex = useMemo(
    () =>
      months.findIndex(
        (it) => it.year === base.getFullYear() && it.month === base.getMonth()
      ),
    [months, base]
  );

  const matrixCache = useMemo(
    () => new Map<string, (Date | null)[][]>(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weekStartsOn]
  );

  const computeMatrix = useCallback(
    (year: number, month: number) => {
      const key = monthKey(year, month);
      const cached = matrixCache.get(key);
      if (cached) return cached;
      const m = generateMonthMatrix(year, month, weekStartsOn);
      matrixCache.set(key, m);
      return m;
    },
    [weekStartsOn, matrixCache]
  );

  useEffect(() => {
    if (initialIndex < 0) return;
    const center = initialIndex;
    for (let i = -preloadMonthCount; i <= preloadMonthCount; i++) {
      const idx = clamp(center + i, 0, months.length - 1);
      const it = months[idx];
      if (it) computeMatrix(it.year, it.month);
    }
  }, [initialIndex, months, preloadMonthCount, computeMatrix]);

  const handleSelect = useCallback(
    (d: Date) => {
      const dateSelected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const currentValue = valueRef.current;
      let newVal: any;

      if (mode === 'single') {
        newVal = {
          start: dateSelected,
          end: dateSelected,
        };
      } else {
        if (
          (!currentValue?.start && !currentValue?.end) ||
          (!!currentValue?.start && !!currentValue?.end)
        ) {
          newVal = { start: dateSelected, end: undefined };
        } else if (currentValue?.start && !currentValue?.end) {
          if (compareDay(dateSelected, currentValue.start) < 0) {
            newVal = { start: dateSelected, end: currentValue.start };
          } else {
            newVal = { start: currentValue.start, end: dateSelected };
          }
        } else {
          newVal = { start: dateSelected, end: undefined };
        }
      }
      onChange?.(newVal);
    },
    [mode, onChange]
  );

  const monthProps = useMemo(
    () => ({
      locale,
      monthHeaderStyle,
      monthHeaderTextStyle,
      renderDay,
      dayStyle,
      dayTextStyle,
      weekStartsOn,
      onDayPress: handleSelect,
      mode,
    }),
    [
      locale,
      monthHeaderStyle,
      monthHeaderTextStyle,
      renderDay,
      dayStyle,
      dayTextStyle,
      weekStartsOn,
      handleSelect,
      mode,
    ]
  );

  const renderItem = useCallback(
    ({ item }: { item: { year: number; month: number } }) => {
      const matrix = computeMatrix(item.year, item.month);
      return (
        <Month
          year={item.year}
          month={item.month}
          matrix={matrix}
          onDayPress={monthProps.onDayPress}
          locale={monthProps.locale}
          monthHeaderStyle={monthProps.monthHeaderStyle}
          monthHeaderTextStyle={monthProps.monthHeaderTextStyle}
          renderDay={monthProps.renderDay}
          dayStyle={monthProps.dayStyle}
          dayTextStyle={monthProps.dayTextStyle}
          weekStartsOn={monthProps.weekStartsOn}
          select={value}
          mode={monthProps.mode}
        />
      );
    },
    [computeMatrix, monthProps, value]
  );

  const keyExtractor = useCallback(
    (item: { year: number; month: number }) => monthKey(item.year, item.month),
    []
  );

  const monthHeight = 320;
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: monthHeight,
      offset: monthHeight * index,
      index,
    }),
    [monthHeight]
  );

  return (
    <FlatList
      data={months}
      initialScrollIndex={initialIndex < 0 ? 0 : initialIndex}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={2}
      windowSize={5}
      updateCellsBatchingPeriod={50}
      initialNumToRender={2}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<Text>No months available.</Text>}
      style={styles.calendarList}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
    />
  );
};
