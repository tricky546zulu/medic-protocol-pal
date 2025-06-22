
export const CACHE_NAMES = {
  SERVICE_WORKER: 'sk-ems-meds-v1',
} as const;

export const LOCAL_STORAGE_KEYS = {
  RECENT_SEARCHES: 'medication-recent-searches',
  USER_PREFERENCES: 'user-preferences',
} as const;

export const QUERY_STALE_TIME = {
  MEDICATIONS: 5 * 60 * 1000, // 5 minutes
  USER_DATA: 2 * 60 * 1000, // 2 minutes
  STATIC_DATA: 10 * 60 * 1000, // 10 minutes
} as const;
