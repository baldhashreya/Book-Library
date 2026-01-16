import * as Express from "express";
import authRouters from "./authorization.routes";
import roleRouters from "./roles.routes";
import userRouters from "./users.routes";
import categoryRouters from "./categories.routes";
import authorRouters from "./author.routes";
import profileRouters from "./profile.routes";
import bookRouters from "./book.routes";

const router = Express.Router();

router.use("/auth", authRouters);
router.use("/users", userRouters);
router.use("/roles", roleRouters);
// router.use('/permissions');
router.use("/profile", profileRouters);

router.use("/books", bookRouters);
router.use("/author", authorRouters);
router.use("/categories", categoryRouters);

// router.use('/members');

// router.use('/borrow');
// router.use('/reports');

export default router;
