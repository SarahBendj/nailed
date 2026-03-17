/** Stub: replace with Prisma when booking is migrated */
export const Booking = {
  Create: (data: any) => Promise.resolve(data),
  findOne: (_id: number) => Promise.resolve(null as any),
  findExistingSlot: (_salonId: number, _date: string, _start: string, _end: string) => Promise.resolve(null as any),
  findBySalonId: (_id: number) => Promise.resolve([] as any[]),
  findByClientId: (_id: number) => Promise.resolve([] as any[]),
  checkIfCancelled: (_id: number) => Promise.resolve(false),
  Update: (_id: number, data: any) => Promise.resolve(data),
  Delete: (_id: number) => Promise.resolve(null as any),
  DeleteFree: () => Promise.resolve(null as any),
  cancelReservations: (_id: number, _status: string) => Promise.resolve(null as any),
  releaseOldReservations: () => Promise.resolve([] as any[]),
  findCancelled: () => Promise.resolve([] as any[]),
  releaseCancelledReservations: () => Promise.resolve(),
};
