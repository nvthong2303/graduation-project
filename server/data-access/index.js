import * as models from "../models";

import makeOrdersDb from "./orders.db";

const ordersDb = makeOrdersDb(models);

export {
    ordersDb,
  ...
};