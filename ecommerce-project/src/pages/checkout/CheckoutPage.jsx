import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { formatMoney } from "../../utils/money";
import { CheckoutHeader } from "./CheckoutHeader";
import "./CheckoutPage.css";

export function CheckoutPage({ cart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    axios
      .get("/api/delivery-options?expand=estimatedDeliveryTime")
      .then((response) => {
        setDeliveryOptions(response.data);
      });

    axios.get("/api/payment-summary").then((response) => {
      setPaymentSummary(response.data);
    });
  }, []);
  return (
    <>
      <title>Checkout</title>
      <CheckoutHeader />
      <div className="checkout-page">
        <div class="page-title">Review your order</div>

        <div class="checkout-grid">
          <div class="order-summary">
            {deliveryOptions.length > 0 &&
              cart.map((cartItem) => {
                const selectedDeliveryOption = deliveryOptions.find(
                  (deliveryOptions) => {
                    return deliveryOptions.id === cartItem.deliveryOptionId;
                  }
                );
                return (
                  <>
                    <div key={cartItem.productId} class="cart-item-container">
                      <div class="delivery-date">
                        Delivery date:{" "}
                        {dayjs(
                          selectedDeliveryOption.estimatedDeliveryTimeMs
                        ).format("dddd, MMMM D")}
                      </div>

                      <div class="cart-item-details-grid">
                        <img
                          class="product-image"
                          src={cartItem.product.image}
                        />

                        <div class="cart-item-details">
                          <div class="product-name">
                            {cartItem.product.name}
                          </div>
                          <div class="product-price">
                            ${formatMoney(cartItem.product.priceCents)}
                          </div>
                          <div class="product-quantity">
                            <span>
                              Quantity:{" "}
                              <span class="quantity-label">
                                {cartItem.quantity}
                              </span>
                            </span>
                            <span class="update-quantity-link link-primary">
                              Update
                            </span>
                            <span class="delete-quantity-link link-primary">
                              Delete
                            </span>
                          </div>
                        </div>

                        <div class="delivery-options">
                          <div class="delivery-options-title">
                            Choose a delivery option:
                          </div>
                          {deliveryOptions.map((deliveryOption) => {
                            let priceString = "FREE Shipping";

                            if (deliveryOption.priceCents > 0) {
                              priceString = `${formatMoney(
                                deliveryOption.priceCents
                              )} - Shipping`;
                            }
                            return (
                              <div
                                key={deliveryOption.id}
                                class="delivery-option"
                              >
                                <input
                                  type="radio"
                                  checked={
                                    deliveryOption.id ===
                                    cartItem.deliveryOption.id
                                  }
                                  class="delivery-option-input"
                                  name={`delivery-option-${cartItem.productId}`}
                                />
                                <div>
                                  <div class="delivery-option-date">
                                    {dayjs(
                                      deliveryOption.estimatedDeliveryTimeMs
                                    ).format("dddd, MMMM D ")}
                                  </div>
                                  <div class="delivery-option-price">
                                    {priceString}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>

          <div class="payment-summary">
            <div class="payment-summary-title">Payment Summary</div>

            {paymentSummary && (
              <>
                <div class="payment-summary-row">
                  <div>Items ({paymentSummary.totalItems}):</div>
                  <div class="payment-summary-money">
                    {formatMoney(paymentSummary.productCostCents)}
                  </div>
                </div>

                <div class="payment-summary-row">
                  <div>Shipping &amp; handling:</div>
                  <div class="payment-summary-money">
                    {formatMoney(paymentSummary.shippingCostCents)}
                  </div>
                </div>

                <div class="payment-summary-row subtotal-row">
                  <div>Total before tax:</div>
                  <div class="payment-summary-money">
                    {" "}
                    {formatMoney(paymentSummary.totalCostBeforeTaxCents)}
                  </div>
                </div>

                <div class="payment-summary-row">
                  <div>Estimated tax (10%):</div>
                  <div class="payment-summary-money">
                    {formatMoney(paymentSummary.taxCents)}
                  </div>
                </div>

                <div class="payment-summary-row total-row">
                  <div>Order total:</div>
                  <div class="payment-summary-money">
                    {" "}
                    {formatMoney(paymentSummary.totalCostCents)}
                  </div>
                </div>

                <button class="place-order-button button-primary">
                  Place your order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
