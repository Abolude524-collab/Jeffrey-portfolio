import "dotenv/config";
import mongoose from "mongoose";

const SOURCE_MONGODB_URI =
  process.env.SOURCE_MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio_cms";
const TARGET_MONGODB_URI = process.env.TARGET_MONGODB_URI || process.env.MONGODB_URI;

if (!TARGET_MONGODB_URI) {
  console.error("Missing TARGET_MONGODB_URI or MONGODB_URI in environment.");
  process.exit(1);
}

function parseDbName(uri, fallback) {
  try {
    const parsed = new URL(uri);
    const name = parsed.pathname.replace(/^\//, "").trim();
    return name || fallback;
  } catch {
    return fallback;
  }
}

async function run() {
  const sourceDbName = parseDbName(SOURCE_MONGODB_URI, "portfolio_cms");
  const targetDbName = parseDbName(TARGET_MONGODB_URI, sourceDbName || "portfolio_cms");

  console.log(`Source DB: ${sourceDbName}`);
  console.log(`Target DB: ${targetDbName}`);

  const sourceConn = await mongoose.createConnection(SOURCE_MONGODB_URI, {
    dbName: sourceDbName,
  }).asPromise();

  const targetConn = await mongoose.createConnection(TARGET_MONGODB_URI, {
    dbName: targetDbName,
  }).asPromise();

  try {
    const sourceCollectionsMeta = await sourceConn.db
      .listCollections({}, { nameOnly: true })
      .toArray();

    const collectionNames = sourceCollectionsMeta
      .map((col) => col.name)
      .filter((name) => !name.startsWith("system."));

    if (collectionNames.length === 0) {
      console.log("No collections found in source DB.");
      return;
    }

    for (const name of collectionNames) {
      const sourceCol = sourceConn.db.collection(name);
      const targetCol = targetConn.db.collection(name);

      const sourceDocs = await sourceCol.find({}).toArray();
      if (sourceDocs.length === 0) {
        console.log(`${name}: source empty, skipped.`);
        continue;
      }

      const ops = sourceDocs.map((doc) => ({
        replaceOne: {
          filter: { _id: doc._id },
          replacement: doc,
          upsert: true,
        },
      }));

      await targetCol.bulkWrite(ops, { ordered: false });

      const sourceCount = await sourceCol.countDocuments();
      const targetCount = await targetCol.countDocuments();

      console.log(`${name}: copied ${sourceDocs.length}, source=${sourceCount}, target=${targetCount}`);
    }

    console.log("Migration completed successfully.");
  } finally {
    await sourceConn.close();
    await targetConn.close();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error?.message || error);
  process.exit(1);
});
