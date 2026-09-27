import type { TimeSinceBreakup, Timing } from '../types/quiz';

const TIMING_BY_TIME: Record<TimeSinceBreakup, Timing> = {
  less_7_days: 'EARLY',
  '1_4_weeks': 'RECENT',
  '1_3_months': 'MEDIUM',
  '3_6_months': 'LONG',
  '6_12_months': 'LONG',
  more_1_year: 'LONG',
};

export function deriveTiming(time?: TimeSinceBreakup): Timing | undefined {
  return time ? TIMING_BY_TIME[time] : undefined;
}
