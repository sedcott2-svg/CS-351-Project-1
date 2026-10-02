import formatCredits from "./formatCredits";

function ProductCard({ product, onSelect }) {
  return (
    <button className="card product-card h-100 w-100 p-3 text-start" type="button" onClick={onSelect}>
      <img
        className="img-fluid rounded mb-3"
        src={product.thumbnail}
        alt={product.name}
        loading="lazy"
      />
      <span className="small text-body-secondary">ID: {product.id}</span>
      <span className="h5 mb-0">{product.name}</span>
      <span className="fw-semibold">{formatCredits(product.price)} {product.currency}</span>
    </button>
  );
}

export default ProductCard;