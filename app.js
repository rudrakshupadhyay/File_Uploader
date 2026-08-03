import express from "express";
import path from "node:path";
import "dotenv/config";
import session from "express-session";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";
import indexRouter from "./routes/indexRoutes.js";
import { ls, ds, ensureAuthenticated } from "./config/passport.js";
import { putDetailsInDb } from "./controllers/signUpControllers.js";
import methodOverride from "method-override";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
const assetPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetPath));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(ls);

// app.use((req, res, next) => {
//   console.log(req.user);
//   next();
// });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(ds);

app.get("/signup", (req, res) => {
  res.render("signUpform", { data: null });
});

app.post("/signup", putDetailsInDb);

app.get("/login", (req, res) => {
  const messages = req.session.messages;
  console.log(messages);
  delete req.session.messages;

  res.render("login", { messages });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

app.use("/", ensureAuthenticated, indexRouter);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
});

app.use((err, req, res, next) => {
    console.error(err.message);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
