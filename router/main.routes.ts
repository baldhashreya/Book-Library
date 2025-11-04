import { Router } from "express";

const router = Router();

router.use('/auth');
router.use('/users');
router.use('/roles');
router.use('/permissions');
router.use('/profile');

router.use('/books');
router.use('/author');
router.use('/categories');

router.use('/members');

router.use('/borrow');
router.use('/reports');


export default router;