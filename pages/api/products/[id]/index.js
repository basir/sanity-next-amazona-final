import nc from 'next-connect';
import sanityClient from '../../../../utils/client.js';

const handler = nc();

handler.get(async (req, res) => {
  const product = await sanityClient.fetch(
    `*[_type == "product" && _id == $id][0]`,
    { id: req.query.id }
  );
  res.send(product);
});

export default handler;
