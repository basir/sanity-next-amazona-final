// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import product from './product';
import productReview from './productReview';
import orderItem from './orderItem';
import order from './order';
import paymentResult from './paymentResult';
import shippingAddress from './shippingAddress';
import user from './user';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Your types here! */
    user,
    product,
    productReview,
    order,
    orderItem,
    paymentResult,
    shippingAddress,
  ]),
});
