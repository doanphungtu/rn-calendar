import { StyleSheet, Dimensions } from 'react-native';

export const DAY_SIZE = 40;
export const BORDER_RADIUS = DAY_SIZE / 2;

export const styles = StyleSheet.create({
  calendarList: {
    flexGrow: 1,
  },
  monthContainer: {
    padding: 12,
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthHeader: {
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthHeaderText: { fontSize: 18, fontWeight: '600' },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: DAY_SIZE,
  },
  weekDayText: {
    width: DAY_SIZE,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  dayCellEmpty: { width: DAY_SIZE, height: DAY_SIZE, opacity: 0 },

  // Range Styles
  dayInRange: {
    backgroundColor: '#E6F0FF',
  },
  rangeStart: {
    backgroundColor: '#E6F0FF',
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
    marginRight: 0,
    paddingRight: 0,
  },
  rangeEnd: {
    backgroundColor: '#E6F0FF',
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    marginLeft: 0,
    paddingLeft: 0,
  },

  // Selected/Single Day Styles
  daySelected: {
    backgroundColor: '#007AFF',
    borderRadius: BORDER_RADIUS,
  },
  daySelectedSingleOrOneDayRange: {
    borderRadius: BORDER_RADIUS,
  },

  // Text Styles
  dayText: { fontSize: 14, color: '#333' },
  dayTextSelected: { color: '#fff' },
  dayTextInRange: { color: '#000' },
  dayTextToday: { color: 'red' },
});
