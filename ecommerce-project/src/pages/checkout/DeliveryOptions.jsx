import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
export function DeliveryOptions({ cartItem, deliveryOptions }) {
  return (
    <div class="delivery-options">
      <div class="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }
        return (
          <div key={deliveryOption.id} class="delivery-option">
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOption.id}
              class="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
            />
            <div>
              <div class="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D "
                )}
              </div>
              <div class="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
