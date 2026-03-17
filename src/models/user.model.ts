/** Stub: User is now accessed via PrismaService in auth.service. This stub exists for users.service. */
export const User = {
  findAll: () => Promise.resolve([] as any[]),
  findOne: (_id: number) => Promise.resolve(null as any),
  Create: (data: any) => Promise.resolve(data),
  Update: (_id: number, data: any) => Promise.resolve(data),
  Delete: (_id: number) => Promise.resolve(null as any),
};
