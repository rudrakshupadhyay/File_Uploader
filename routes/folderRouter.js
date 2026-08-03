import { Router } from "express";

const router = Router();

router.get("/:id", (req, res) => {
  res.render("filesPage", { fileListSize: 0, user: req.user });
});

export default router;
