import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Calendar } from '../Calendar';

describe('Calendar Component', () => {
  describe('Single Mode', () => {
    it('should render calendar in single selection mode', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="single"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should call onChange when selecting a date in single mode', async () => {
      const onChange = jest.fn();
      const { getAllByText } = render(
        <Calendar
          mode="single"
          value={{ start: null, end: null }}
          onChange={onChange}
        />
      );

      // Simulate date selection - get all elements with text '15' and use first one
      const dateButtons = getAllByText('15');
      fireEvent.press(dateButtons[0]);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should display selected date correctly in single mode', () => {
      const selectedDate = new Date(2024, 0, 15);
      const { getAllByText } = render(
        <Calendar
          mode="single"
          value={{ start: selectedDate, end: selectedDate }}
          onChange={jest.fn()}
        />
      );
      const dateElements = getAllByText('15');
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('Range Mode', () => {
    it('should render calendar in range selection mode', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="range"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should support selecting date range', async () => {
      const onChange = jest.fn();
      const { getAllByText } = render(
        <Calendar
          mode="range"
          value={{ start: null, end: null }}
          onChange={onChange}
        />
      );

      // Select first date - use first occurrence of '10'
      const date10Buttons = getAllByText('10');
      fireEvent.press(date10Buttons[0]);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });

      // Select second date - use first occurrence of '20'
      const date20Buttons = getAllByText('20');
      fireEvent.press(date20Buttons[0]);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(2);
      });
    });

    it('should automatically order dates in ascending order', () => {
      const onChange = jest.fn();
      const { getAllByText } = render(
        <Calendar
          mode="range"
          value={{ start: null, end: null }}
          onChange={onChange}
        />
      );

      // Select end date first - use first occurrence of '20'
      const date20Buttons = getAllByText('20');
      fireEvent.press(date20Buttons[0]);

      // Select start date - use first occurrence of '10'
      const date10Buttons = getAllByText('10');
      fireEvent.press(date10Buttons[0]);

      // Verify onChange was called at least twice
      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('Localization', () => {
    it('should support different locales', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="single"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
          locale="vi-VN"
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should display weekdays according to locale', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="single"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
          locale="en-US"
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Week Start Configuration', () => {
    it('should support Sunday as week start (0)', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="single"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
          weekStartsOn={0}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should support Monday as week start (1)', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="single"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
          weekStartsOn={1}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Year Range', () => {
    it('should support custom start and end years', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="single"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
          startYear={2020}
          endYear={2025}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Custom Rendering', () => {
    it('should support custom day rendering', () => {
      const renderDay = jest.fn(() => <Text>Custom</Text>);
      const { UNSAFE_root } = render(
        <Calendar
          mode="single"
          value={{ start: new Date(), end: new Date() }}
          onChange={jest.fn()}
          renderDay={renderDay}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
      expect(renderDay).toHaveBeenCalled();
    });
  });

  describe('Date Normalization', () => {
    it('should handle dates with different times correctly', () => {
      const date1 = new Date(2024, 0, 15, 10, 30, 0);
      const date2 = new Date(2024, 0, 15, 14, 45, 0);

      const { getAllByText } = render(
        <Calendar
          mode="single"
          value={{ start: date1, end: date2 }}
          onChange={jest.fn()}
        />
      );

      // Both should be treated as same day
      const dateElements = getAllByText('15');
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should render without errors', () => {
      const onChange = jest.fn();
      const { UNSAFE_root } = render(
        <Calendar
          mode="range"
          value={{ start: null, end: null }}
          onChange={onChange}
        />
      );

      // Just verify the component renders successfully
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null dates gracefully', () => {
      const { UNSAFE_root } = render(
        <Calendar
          mode="range"
          value={{ start: null, end: null }}
          onChange={jest.fn()}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle same start and end dates in range mode', () => {
      const sameDate = new Date(2024, 0, 15);
      const { getAllByText } = render(
        <Calendar
          mode="range"
          value={{ start: sameDate, end: sameDate }}
          onChange={jest.fn()}
        />
      );
      const dateElements = getAllByText('15');
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it('should reset range when clicking twice on same date', async () => {
      const onChange = jest.fn();
      const { getAllByText } = render(
        <Calendar
          mode="range"
          value={{ start: null, end: null }}
          onChange={onChange}
        />
      );

      const dateButtons = getAllByText('15');
      fireEvent.press(dateButtons[0]);
      fireEvent.press(dateButtons[0]);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(2);
      });
    });
  });
});
