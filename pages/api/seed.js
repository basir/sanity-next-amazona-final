import nc from 'next-connect';
import axios from 'axios';
import sampleData from '../../utils/data';
import config from '../../utils/config';

const handler = nc();

handler.get(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;

  try {
    const deleteMutations = [
      {
        delete: {
          query: "*[_type == 'product']",
        },
      },
    ];
    const { data: deleteData } = await axios.post(
      `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}`,
      { mutations: deleteMutations },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${tokenWithWriteAccess}`,
        },
      }
    );

    const createMutations = sampleData.products.map((x) => ({
      create: {
        _type: 'product',
        name: x.name,
        category: x.category,
        price: x.price,
        brand: x.brand,
        rating: x.rating,
        numReviews: x.numReviews,
        countInStock: x.countInStock,
        description: x.description,
      },
    }));
    const { data } = await axios.post(
      `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}`,
      { mutations: createMutations },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${tokenWithWriteAccess}`,
        },
      }
    );
    res.send({ data, deleteData });
  } catch (error) {
    console.log(error.response);
    res.status(500).send({ message: error.message });
  }
});

export default handler;
