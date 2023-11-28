const ProductDetails = (props) => {
  console.log(props,'props')
}

export async function getStaticPaths() {
  //get products
  const res = await fetch('http://localhost:3000/api/products')
  const products = await res.json()
  
  //ger product id list
  const idList = products.map(product => product.id)

  //convert them into params
  const params = idList.map(id => ({params: {productId: id}}))
  
  return {
      fallback: 'blocking', 
      paths: params,
  };
}

export async function getStaticProps(context) {
  // we have the productId inside the params of context
  const {params} = context
  const productId = params.productId

  //use that productId to get details
  const res = await fetch('http://localhost:3000/api/productDetails?id=' + productId)
  const productDetails = await res.json()

  return {
      props: { productDetails }
  };
}

export default ProductDetails