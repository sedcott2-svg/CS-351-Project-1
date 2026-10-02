import ProductCard from "./ProductCard";

function ProductList({ products, onSelectProduct }) {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
      {products.map(product => (
        <div className="col" key={product.id}>
          <ProductCard product={product} onSelect={() => onSelectProduct(product)} />
        </div>
      ))}
    </div>
  );
}

export default ProductList;