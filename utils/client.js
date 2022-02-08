import sanityClient from '@sanity/client';
import config from './config';

export default sanityClient({
  projectId: config.projectId,
  dataset: config.dataset,
  useCdn: true,
});
