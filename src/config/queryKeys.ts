
export const queryKeys = {
  medications: {
    all: ['medications'] as const,
    list: () => [...queryKeys.medications.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.medications.all, 'detail', id] as const,
  },
  dosing: {
    all: ['dosing'] as const,
    byMedication: (medicationId: string) => [...queryKeys.dosing.all, 'medication', medicationId] as const,
    allDosing: () => [...queryKeys.dosing.all, 'all-dosing'] as const,
  },
  indications: {
    all: ['indications'] as const,
    byMedication: (medicationId: string) => [...queryKeys.indications.all, 'medication', medicationId] as const,
    allIndications: () => [...queryKeys.indications.all, 'all-indications'] as const,
  },
  favorites: {
    all: ['favorites'] as const,
    byUser: (userId: string) => [...queryKeys.favorites.all, 'user', userId] as const,
  },
} as const;
