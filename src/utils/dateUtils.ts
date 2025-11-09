export const todayDateRef = new Date();

export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function compareDay(a: Date, b: Date) {
  const ax = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bx = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return ax - bx;
}

export function monthKey(year: number, month: number) {
  return `${year}-${month}`;
}

// ---------- Month matrix generator ----------
export function generateMonthMatrix(
  year: number,
  month: number,
  weekStartsOn = 0
) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;

  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  for (let i = 0; i < firstWeekday; i++) week.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}
