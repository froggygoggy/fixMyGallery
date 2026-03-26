import { CleanupMode, QuotaPeriod, QuotaType } from '../types/cleanup';

export interface PlanSettings {
  mode: CleanupMode;
  quotaType: QuotaType;
  quotaValue: number;
  period: QuotaPeriod;
}
