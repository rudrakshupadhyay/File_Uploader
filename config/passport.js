import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export const ls = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        folders: true,
        files: true,
      },
    });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export async function ds(id, done) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        folders: {
          include: {
            files: true, // files inside each folder
          },
        },
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
