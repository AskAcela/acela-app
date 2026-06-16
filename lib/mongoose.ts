import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  } | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const activeCache = cached!;
  if (activeCache.conn) return activeCache.conn;

  if (!activeCache.promise) {
    activeCache.promise = mongoose.connect(MONGODB_URI).then(async (m) => {
      // Sync indexes once per process so sparse/unique constraints match the
      // current schema even if the collection already has a stale index.
      const { default: User } = await import("@/models/User");
      await User.syncIndexes();
      return m;
    });
  }

  activeCache.conn = await activeCache.promise;
  return activeCache.conn;
}
