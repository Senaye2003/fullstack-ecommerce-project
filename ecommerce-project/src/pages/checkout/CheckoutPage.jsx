import axios from "axios";
import { useState, useEffect } from "react";
import { PaymentSummary } from "./PaymentSummary";
import { CheckoutHeader } from "./CheckoutHeader";
import { OrderSummary } from "./orderSummary";
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
          <OrderSummary cart={cart} deliveryOptions={deliveryOptions}/>
          <PaymentSummary paymentSummary={paymentSummary}/>
          
        </div>
      </div>
    </>
  );
}
