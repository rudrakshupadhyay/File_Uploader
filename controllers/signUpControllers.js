import { insertIntoDb, uniqueUsername } from "../models/script.js";
import { body, validationResult, matchedData } from "express-validator";

const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .custom(uniqueUsername),

  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters.")
    .matches(/^[A-Za-z\s'-]+$/)
    .withMessage(
      "First name can only contain letters, spaces, hyphens, and apostrophes.",
    ),

  body("lastname")
    .optional({ values: "falsy" }) // skips validation if missing, null, undefined, or ""
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters.")
    .matches(/^[A-Za-z\s'-]+$/)
    .withMessage(
      "Last name can only contain letters, spaces, hyphens, and apostrophes.",
    ),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/,
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
];

export const putDetailsInDb = [
  ...validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("signUpform", { errors: errors.array(), data: req.body });
    }

    const data = matchedData(req);
    await insertIntoDb(data);
    res.redirect("/login");
  },
];


