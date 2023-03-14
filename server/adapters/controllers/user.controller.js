import {
    postOrder,
    // ...
} from 'use-cases/orders';

import {
    postPaymentLink
} from 'use-cases/payments';

export default Object.freeze({
    postOrder: (httpRequest) => postOrder(httpRequest, postPaymentLink),
    // ...
});