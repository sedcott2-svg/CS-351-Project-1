import formatCredits from "./formatCredits";

function ShoppingCart({ items, onQuantityChange, onRemove, onContinueShopping }) {
  const subtotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <section>
      <h1 className="h2 mb-4">Cart</h1>
      {items.length === 0 ? (
        <div className="alert alert-light border empty-cart">
          <p className="mb-3">Your cart is empty.</p>
          <button className="btn btn-primary" type="button" onClick={onContinueShopping}>
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="list-group list-group-flush">
            {items.map(item => {
              const { product, variation, polarity, quantity } = item;
              const itemKey = `${product.id}-${variation || "none"}-${polarity || "none"}`;
              const stock = Number(product.quantityInStock);

              return (
                <li className="list-group-item cart-item py-3" key={itemKey}>
                  <div className="row align-items-center gy-3">
                    <div className="col-md-2">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="cart-thumb"
                      />
                    </div>
                    <div className="col-md-4">
                      <h2 className="h5 mb-1">{product.name}</h2>
                      <p className="text-body-secondary mb-1">{variation || "Standard"}</p>
                      {polarity && <p className="text-body-secondary mb-0">Polarity: {polarity}</p>}
                    </div>
                    <div className="col-md-3">
                      <div className="input-group input-group-sm cart-quantity">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          aria-label={`Decrease ${product.name} quantity`}
                          disabled={quantity <= 1}
                          onClick={() => onQuantityChange(product.id, variation, polarity, quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          className="form-control cart-quantity-input"
                          type="number"
                          min="1"
                          max={stock}
                          step="1"
                          value={quantity}
                          aria-label={`${product.name} quantity`}
                          onChange={event => onQuantityChange(
                            product.id,
                            variation,
                            polarity,
                            event.currentTarget.valueAsNumber,
                          )}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          aria-label={`Increase ${product.name} quantity`}
                          disabled={quantity >= stock}
                          onClick={() => onQuantityChange(product.id, variation, polarity, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-md-end fw-semibold cart-price-block">
                      {formatCredits(Number(product.price) * quantity)} {product.currency}
                    </div>
                    <div className="col-md-1 d-flex justify-content-end align-items-end cart-remove-cell">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => onRemove(product.id, variation, polarity)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="d-flex justify-content-between border-top pt-3 mt-3 fs-5">
            <strong>Subtotal</strong>
            <strong>{formatCredits(subtotal)} Credits</strong>
          </div>
        </>
      )}
    </section>
  );
}

export default ShoppingCart;