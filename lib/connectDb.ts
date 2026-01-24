import mongoose from "mongoose";

export function mongooseConnect(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  return mongoose.connect(uri);
}
