import * as Express from "express";
import authRouters from "./authorization.routes";
import roleRouters from "./roles.routes";
import userRouters from "./users.routes";
import categoryRouters from "./categories.routes";

const router = Express.Router();

router.use("/auth", authRouters);
router.use('/users', userRouters);
router.use("/roles", roleRouters);
// router.use('/permissions');
router.use('/profile');

// router.use('/books');
// router.use('/author');
router.use('/categories', categoryRouters);

// router.use('/members');

// router.use('/borrow');
// router.use('/reports');

export default router;
