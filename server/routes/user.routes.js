import express from 'express';

import controller from 'controllers/api/orderController';
import makeExpressCallback from 'routes/make-callback';

const router = express.Router();

router.route('/order').post(makeExpressCallback(controller.postOrder));
router.route('/order/:orderId').get(makeExpressCallback(controller.getOrderById));
// ...

export default router;