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
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  const activeCache = cached!;
  if (activeCache.conn) return activeCache.conn;

  if (!activeCache.promise) {
    activeCache.promise = mongoose.connect(MONGODB_URI);
  }

  activeCache.conn = await activeCache.promise;

  return activeCache.conn;
}
