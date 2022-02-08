import { useContext, useEffect, useState } from 'react';
import { Alert, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import Layout from '../components/Layout';
import client from '../utils/client.js';
import { urlForThumbnail } from '../utils/image';

export default function Home() {
  const router = useRouter();
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });
    router.push('/cart');
  };
  const [state, setState] = useState({
    products: [],
    error: '',
    loading: true,
  });
  const { loading, products, error } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"] `);
        setState({ products, loading: false });
      } catch (err) {
        setState({ error: err.message, loading: false });
      }
    };
    fetchData();
  }, []);
  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
}
