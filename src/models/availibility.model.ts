/** Stub: replace with Prisma when availability is migrated */
export const Availability = {
  findAll: () => Promise.resolve([] as any[]),
  findByName: (_name: string) => Promise.resolve([] as any[]),
  findDayAvailability: (_id: number, _day: string) => Promise.resolve(null as any),
  updateDayAvailability: (_id: number, _existingId: number, _data: any) => Promise.resolve(null as any),
};
