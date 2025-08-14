import { PrismaClient } from '../node_modules/@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });
    
    console.log('Found users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Created: ${user.createdAt}`);
      console.log('---');
    });
    
    if (users.length === 0) {
      console.log('No users found in the database.');
    }
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();