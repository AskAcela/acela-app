import NextAuth from "next-auth";
import { SessionUser } from "./types";
declare module "next-auth" {
    interface Session {
        user: SessionUser;
    }
}
