import prisma from '@/utils/prisma'

async function checkUser() {
  const count = await prisma.user.count();
  console.log("Users in DB: ", count);
}

checkUser();
