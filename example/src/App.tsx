// Example.tsx
import { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Calendar, type RangeValue, type SelectionMode } from '../../src';

export default function App() {
  const [range, setRange] = useState<RangeValue>({
    start: new Date(),
    end: new Date(),
  });
  const [single, setSingle] = useState<RangeValue>({
    start: new Date(),
    end: new Date(),
  });
  const [mode, setMode] = useState<SelectionMode>('range');
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(1);

  const dayStyle = useMemo(() => ({ width: 42, height: 42 }), []);

  const handleChange = useCallback(
    (v: RangeValue) => {
      if (mode === 'single') {
        setSingle(v);
      } else {
        setRange(v);
      }
    },
    [mode]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.appHeader}>🗓️ Custom Calendar Picker</Text>

      {/* --- TOGGLE MODE --- */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            mode === 'single' && styles.toggleActive,
          ]}
          onPress={() => setMode('single')}
        >
          <Text
            style={[
              styles.toggleText,
              mode === 'single' && styles.toggleTextActive,
            ]}
          >
            Single Mode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'range' && styles.toggleActive]}
          onPress={() => setMode('range')}
        >
          <Text
            style={[
              styles.toggleText,
              mode === 'range' && styles.toggleTextActive,
            ]}
          >
            Range Mode
          </Text>
        </TouchableOpacity>
      </View>

      <Calendar
        mode={mode}
        value={mode === 'single' ? single : range}
        onChange={handleChange}
        locale="vi-VN"
        weekStartsOn={weekStartsOn}
        startYear={2023}
        endYear={2026}
        preloadMonthCount={3}
        dayStyle={dayStyle}
      />

      {/* --- DISPLAY RESULTS --- */}
      <View style={styles.resultBox}>
        {mode === 'single' ? (
          <Text style={styles.resultText}>
            Ngày Đơn Lẻ:{' '}
            <Text style={styles.highlight}>
              {single?.start?.toLocaleDateString('vi-VN') ?? 'Chưa chọn'}
            </Text>
          </Text>
        ) : (
          <>
            <Text style={styles.resultText}>
              Ngày Bắt Đầu:{' '}
              <Text style={styles.highlight}>
                {range.start?.toLocaleDateString('vi-VN') ?? '---'}
              </Text>
            </Text>
            <Text style={styles.resultText}>
              Ngày Kết Thúc:{' '}
              <Text style={styles.highlight}>
                {range.end?.toLocaleDateString('vi-VN') ?? '---'}
              </Text>
            </Text>
          </>
        )}
      </View>

      {/* --- CUSTOMIZATION BUTTON --- */}
      <TouchableOpacity
        style={styles.customizeButton}
        onPress={() => setWeekStartsOn(weekStartsOn === 0 ? 1 : 0)}
      >
        <Text style={styles.customizeText}>
          Ngày bắt đầu tuần: {weekStartsOn === 0 ? 'CN' : 'T2'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f0f0', paddingVertical: 60 },
  container: { flex: 1 },
  appHeader: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    padding: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  toggleTextActive: {
    color: '#fff',
  },
  infoText: {
    marginBottom: 10,
    fontSize: 16,
  },
  resultBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '90%',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '700',
    color: '#E91E63',
  },
  customizeButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 6,
  },
  customizeText: {
    color: 'white',
    fontWeight: '600',
  },
});
