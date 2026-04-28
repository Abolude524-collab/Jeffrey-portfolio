import { MongoMemoryServer } from 'mongodb-memory-server';

async function startDb() {
  const mongod = await MongoMemoryServer.create({ instance: { port: 27017 }});
  console.log('MongoDB is running on:', mongod.getUri());
}

startDb();
