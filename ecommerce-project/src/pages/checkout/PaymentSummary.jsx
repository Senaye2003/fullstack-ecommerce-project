import { formatMoney } from "../../utils/money"
export function PaymentSummary({ paymentSummary }){
    return(
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
    )
}