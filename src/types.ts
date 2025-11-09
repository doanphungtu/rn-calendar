import type { ViewStyle, TextStyle } from 'react-native';

export type DateLike = Date | string | number;
export type SelectionMode = 'single' | 'range';

export interface CalendarProps {
  mode?: SelectionMode;
  value?: RangeValue;
  onChange?: (value: RangeValue) => void;
  startYear?: number;
  endYear?: number;
  locale?: string;
  weekStartsOn?: 0 | 1; // 0: Sunday, 1: Monday
  renderDay?: (date: Date, props: DayRenderProps) => React.ReactNode;
  dayStyle?: ViewStyle;
  dayTextStyle?: TextStyle;
  monthHeaderStyle?: ViewStyle;
  monthHeaderTextStyle?: TextStyle;
  preloadMonthCount?: number;
}

export interface DayRenderProps {
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isDisabled: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
}

export interface RangeValue {
  start?: Date | null;
  end?: Date | null;
}
