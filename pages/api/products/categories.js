import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  const categories = ['Shirts', 'Pants'];
  // await db.connect();
  // const categories = await Product.find().distinct('category');
  // await db.disconnect();
  res.send(categories);
});

export default handler;
