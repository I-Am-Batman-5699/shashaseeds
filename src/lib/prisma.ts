import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  let instance: PrismaClient;
  return instance ?? (instance = new PrismaClient());
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type prismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if(process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
