import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TextField,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { getError } from '../../utils/error';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Form from '../../components/Form';
import client from '../../utils/client.js';
import { urlFor, urlForThumbnail } from '../../utils/image';

export default function ProductScreen(props) {
  const router = useRouter();
  const {
    state: { userInfo, cart },
    dispatch,
  } = useContext(Store);
  const { slug } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: '',
    reviews: [],
    rating: 0,
    comment: '',
    loadingReviews: true,
    errorReviews: '',
    loadingCreateReview: false,
  });
  const {
    loading,
    product,
    error,
    reviews,
    rating,
    comment,
    // loadingReviews,
    // errorReviews,
  } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    setState({ ...state, loadingCreateReview: true });
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setState({ ...state, loadingCreateReview: false });
      enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      fetchReviews();
    } catch (err) {
      setState({ ...state, loadingCreateReview: false });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setState({ ...state, reviews: data, loadingReview: false });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]`,
          { slug }
        );
        setState({ ...state, product, loading: false });
      } catch (err) {
        setState({ ...state, error: err.message, loading: false });
      }
    };
    fetchData();
    // fetchReviews();
  }, []);

  // if (!product) {
  //   return <Box>Product Not Found</Box>;
  // }
  const addToCartHandler = async () => {
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
        ...{
          _key: product._id,
          name: product.name,
          countInStock: product.countInStock,
          slug: product.slug.current,
          price: product.price,
          image: urlForThumbnail(product.image),
        },
        quantity,
      },
    });
    router.push('/cart');
  };

  return (
    <Layout title={product?.title}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Box sx={classes.section}>
            <NextLink href="/" passHref>
              <Link>
                <Typography>back to products</Typography>
              </Link>
            </NextLink>
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Image
                src={urlFor(product.image)}
                alt={product.title}
                width={640}
                height={640}
                layout="responsive"
              ></Image>
            </Grid>
            <Grid item md={3} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    {product.title}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Category: {product.category}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>Brand: {product.brand}</Typography>
                </ListItem>
                <ListItem>
                  <Rating value={product.rating} readOnly></Rating>
                  <Link href="#reviews">
                    <Typography>({product.numReviews} reviews)</Typography>
                  </Link>
                </ListItem>
                <ListItem>
                  <Typography> Description: {product.description}</Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>${product.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addToCartHandler}
                    >
                      Add to cart
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
          <List>
            <ListItem>
              <Typography name="reviews" id="reviews" variant="h2">
                Customer Reviews
              </Typography>
            </ListItem>
            {reviews.length === 0 && <ListItem>No review</ListItem>}
            {reviews.map((review) => (
              <ListItem key={review._id}>
                <Grid container>
                  <Grid item sx={classes.reviewItem}>
                    <Typography>
                      <strong>{review.name}</strong>
                    </Typography>
                    <Typography>{review.createdAt.substring(0, 10)}</Typography>
                  </Grid>
                  <Grid item>
                    <Rating value={review.rating} readOnly></Rating>
                    <Typography>{review.comment}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
            <ListItem>
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <List>
                    <ListItem>
                      <Typography variant="h2">Leave your review</Typography>
                    </ListItem>
                    <ListItem>
                      <TextField
                        multiline
                        variant="outlined"
                        fullWidth
                        name="review"
                        label="Enter comment"
                        value={comment}
                        onChange={(e) =>
                          setState({ ...state, comment: e.target.value })
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(e) =>
                          setState({ ...state, rating: e.target.value })
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                      >
                        Submit
                      </Button>

                      {loading && <CircularProgress></CircularProgress>}
                    </ListItem>
                  </List>
                </Form>
              ) : (
                <Typography variant="h2">
                  Please{' '}
                  <Link href={`/login?redirect=/product/${product.slug}`}>
                    login
                  </Link>{' '}
                  to write a review
                </Typography>
              )}
            </ListItem>
          </List>
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { slug },
  } = context;

  return {
    props: { slug },
  };
}
