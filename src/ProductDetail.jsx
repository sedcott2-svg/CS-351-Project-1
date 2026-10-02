import { useState } from "react";
import formatCredits from "./formatCredits";

function ProductDetail({ product, onBack, onAddToCart }) {
  const variations = product.Variation ?? [];
  const polarities = product.polarities ?? [];
  const [selectedVariation, setSelectedVariation] = useState("");
  const [selectedPolarity, setSelectedPolarity] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  function handleAddToCart() {
    const hasPolaritySelection = (product.polarities ?? []).length > 0;
    const added = onAddToCart(product, selectedVariation, selectedPolarity);
    setCartMessage(
      added ? "Added to cart." : "The available stock for this option is already in your cart.",
    );

    if (hasPolaritySelection && selectedPolarity) {
      setCartMessage(`Added ${selectedPolarity} polarity to cart.`);
    }
  }

  return (
    <section className="container py-2">
      <button className="btn btn-outline-secondary mb-4" type="button" onClick={onBack}>
        Back to shop
      </button>
      <div className="row g-4 align-items-start">
        <div className="col-md-5">
          <p className="text-body-secondary text-uppercase small">{product.category} / {product.origin}</p>
          <h1 className="h2">{product.name}</h1>
          <img className="img-fluid rounded border product-detail-image" src={product.image} alt={product.name} />
          <p className="lead">{product.description}</p>
          <div className="mt-3 mb-3" style={{ borderTop: "1px solid rgba(213, 213, 213, 0.35)" }} />
          {polarities.length > 0 && (
            <div className="mb-3">
              <p className="form-label mb-2">Polarities</p>
              <div className="d-flex flex-wrap gap-2">
                {polarities.map(polarity => {
                  const isSelected = selectedPolarity === polarity;

                  return (
                    <button
                      key={polarity}
                      type="button"
                      className="badge rounded-pill border px-3 py-2 text-body-secondary"
                      style={{
                        borderColor: isSelected ? "#4A93B8" : "rgba(74, 147, 184, 0.5)",
                        background: isSelected ? "rgba(74, 147, 184, 0.18)" : "rgba(74, 147, 184, 0.08)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      onClick={() => setSelectedPolarity(polarity)}
                    >
                      <img
                        src={`${polarity}.svg`}
                        alt={polarity}
                        style={{
                          width: "18px",
                          height: "18px",
                          display: "block",
                          filter: "brightness(0) saturate(100%) invert(84%)",
                        }}
                      />
                      {polarity}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="col-md-7">
          <h2 className="h5 mt-4 mb-2">About</h2>
          <div className="mt-3 mb-3" style={{ borderTop: "1px solid rgba(213, 213, 213, 0.35)" }} />
          <p className="text-body-secondary  mb-4" >{product.longDescription}</p>
          <p className="h4 mb-4">{formatCredits(product.price)} {product.currency}</p>
          {variations.length > 0 && (
            <div className="mb-3">
              <label className="form-label" htmlFor="product-variation">Variation</label>
              <select
                className="form-select"
                id="product-variation"
                value={selectedVariation}
                onChange={event => {
                  setSelectedVariation(event.target.value);
                  setCartMessage("");
                }}
              >
                <option value="">Choose a variation</option>
                {variations.map(variation => (
                  <option key={variation} value={variation}>{variation}</option>
                ))}
              </select>
            </div>
          )}
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleAddToCart}
            disabled={(variations.length > 0 && !selectedVariation) || (polarities.length > 0 && !selectedPolarity)}
          >
            Add to cart
          </button>
          <p className="text-success mt-2" role="status" aria-live="polite">{cartMessage}</p>
          <dl className="row mt-4">
            <dt className="col-sm-4">SKU</dt><dd className="col-sm-8">{product.sku}</dd>
            <dt className="col-sm-4">Rating</dt><dd className="col-sm-8">{product.rating} / 5 ({product.numberOfReviews} reviews)</dd>
            <dt className="col-sm-4">In stock</dt><dd className="col-sm-8">{product.quantityInStock}</dd>
            <dt className="col-sm-4">Playstyle</dt><dd className="col-sm-8">{product.playstyle}</dd>
            <dt className="col-sm-4">Health</dt><dd className="col-sm-8">{product.health}</dd>
            <dt className="col-sm-4">Shield</dt><dd className="col-sm-8">{product.shield}</dd>
            <dt className="col-sm-4">Armor</dt><dd className="col-sm-8">{product.armor}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;