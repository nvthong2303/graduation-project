import {
    ordersDb,
    // ...
} from 'data-access';

import Config from 'config';

import makePostOrder from './user';
// ...

const postOrder = makePostOrder({
    ordersDb,
    Config,
    // other injected dependencies ...
});

// Export a service containing all Use Cases ...
const orderService = Object.freeze({
    postOrder,
    // ...
});
export default orderService;

// ... and also every Use Case singularly
export {
    postOrder,
    // ...
};