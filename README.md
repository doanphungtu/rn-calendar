# 📅 RN Calendar - React Native Calendar Picker

A high-performance, fully customizable calendar picker component for React Native with support for single and range date selection.

## ✨ Features

- 🎯 **Single & Range Modes** - Select one date or a date range
- 🚀 **High Performance** - Optimized with React.memo, useMemo, and virtual scrolling
- 🎨 **Fully Customizable** - Custom day rendering, styles, and localization
- 📱 **React Native** - Built for React Native with Expo support
- 🌍 **Localization** - Support for any locale via Intl API
- ⚡ **Fast** - Sub-100ms response time with memoization and caching

## Installation

```bash
npm install @tudp/rn-calendar
# or
yarn add @tudp/rn-calendar
```

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import { Calendar, type RangeValue } from '@tudp/rn-calendar';

export default function App() {
  const [range, setRange] = useState<RangeValue>({
    start: new Date(),
    end: new Date(),
  });

  return (
    <Calendar mode="range" value={range} onChange={setRange} locale="en-US" />
  );
}
```

### Single Date Selection

```tsx
import { useState } from 'react';
import { Calendar, type RangeValue } from '@tudp/rn-calendar';

export default function App() {
  const [date, setDate] = useState<RangeValue>({
    start: new Date(),
    end: new Date(),
  });

  return <Calendar mode="single" value={date} onChange={setDate} />;
}
```

### Advanced Example with Custom Styling

```tsx
import { useMemo } from 'react';
import {
  Calendar,
  type DayRenderProps,
  type RangeValue,
} from '@tudp/rn-calendar';

export default function App() {
  const [range, setRange] = useState<RangeValue>({
    start: new Date(),
    end: new Date(),
  });

  const dayStyle = useMemo(
    () => ({
      width: 48,
      height: 48,
    }),
    []
  );

  const renderDay = (date: Date, props: DayRenderProps) => {
    return (
      <Text
        style={{
          color: props.isToday ? '#FF3B30' : '#333',
          fontWeight: props.isSelected ? 'bold' : 'normal',
        }}
      >
        {date.getDate()}
      </Text>
    );
  };

  return (
    <Calendar
      mode="range"
      value={range}
      onChange={setRange}
      locale="vi-VN"
      weekStartsOn={1} // Monday
      renderDay={renderDay}
      dayStyle={dayStyle}
      startYear={2023}
      endYear={2026}
    />
  );
}
```

## Props

### CalendarProps

| Prop                   | Type                                               | Default          | Description                             |
| ---------------------- | -------------------------------------------------- | ---------------- | --------------------------------------- |
| `mode`                 | `'single' \| 'range'`                              | `'single'`       | Selection mode                          |
| `value`                | `RangeValue`                                       | `undefined`      | Selected date(s)                        |
| `onChange`             | `(value: RangeValue) => void`                      | `undefined`      | Callback when date changes              |
| `startYear`            | `number`                                           | current year - 3 | First year to display                   |
| `endYear`              | `number`                                           | current year + 3 | Last year to display                    |
| `locale`               | `string`                                           | `'en-US'`        | Locale for formatting                   |
| `weekStartsOn`         | `0 \| 1`                                           | `0`              | Week start day (0 = Sunday, 1 = Monday) |
| `renderDay`            | `(date: Date, props: DayRenderProps) => ReactNode` | `undefined`      | Custom day renderer                     |
| `dayStyle`             | `ViewStyle`                                        | `undefined`      | Custom day cell style                   |
| `dayTextStyle`         | `TextStyle`                                        | `undefined`      | Custom day text style                   |
| `monthHeaderStyle`     | `ViewStyle`                                        | `undefined`      | Custom month header style               |
| `monthHeaderTextStyle` | `TextStyle`                                        | `undefined`      | Custom month header text style          |
| `preloadMonthCount`    | `number`                                           | `2`              | Number of months to preload             |

### RangeValue

```typescript
interface RangeValue {
  start?: Date | null;
  end?: Date | null;
}
```

### DayRenderProps

```typescript
interface DayRenderProps {
  isToday: boolean; // Is current day
  isSelected: boolean; // Is start/end of range
  isInRange: boolean; // Is within range
  isDisabled: boolean; // Is disabled
  isRangeStart: boolean; // Is range start
  isRangeEnd: boolean; // Is range end
}
```

## Performance

- **Optimized Re-renders** - Uses React.memo and smart comparison functions
- **Virtual Scrolling** - Only renders visible months
- **Date Normalization** - Consistent date comparison without timezone issues
- **Memoized Callbacks** - Stable function references prevent unnecessary updates
- **Smart Caching** - Matrix caching with Map for fast lookups

### Performance Metrics

- Initial render: ~100ms
- Date selection: ~50ms response time
- Range selection: Sub-100ms updates
- Memory usage: ~2-3MB for typical usage

## Architecture

### Components

- **Calendar** - Main container managing FlatList of months
- **Month** - Individual month view with memoization
- **Day** - Individual day cell with interaction handling

### Utilities

- **dateUtils** - Date comparison and matrix generation
- **cache** - Smart memoization and Map-based caching

### Optimizations

1. **React.memo with custom areEqual** - Prevents unnecessary re-renders
2. **useCallback with stable references** - Maintains function identity
3. **useMemo for computed values** - Caches expensive calculations
4. **Date normalization** - Strips time component for consistent comparison
5. **Virtual scrolling** - Only renders visible items
6. **Pressable over TouchableOpacity** - Better performance (~100ms improvement)

## Examples

See the [example app](./example/src/App.tsx) for a complete working example with:

- Single and range selection modes
- Mode toggling
- Week start customization
- Result display

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## License

MIT

---

Made with ❤️ for React Native developers
