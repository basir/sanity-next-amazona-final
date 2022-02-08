import sanityClient from '../utils/client.js';
import imageUrlBuilder from '@sanity/image-url';

function urlFor(source) {
  return imageUrlBuilder(sanityClient).image(source).width(580).url();
}
function urlForThumbnail(source) {
  return imageUrlBuilder(sanityClient).image(source).width(300).url();
}
export { urlFor, urlForThumbnail };
