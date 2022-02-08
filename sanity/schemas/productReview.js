export default {
  title: 'Product Review',
  name: 'productReview',
  type: 'object',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Rating',
      name: 'rating',
      type: 'number',
    },
    {
      title: 'Comment',
      name: 'comment',
      type: 'string',
    },
    {
      title: 'Time',
      name: 'createdAt',
      type: 'datetime',
    },
  ],
};
