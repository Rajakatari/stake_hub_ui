import { useState } from "react";
import "./index.css";

const apiUrl = "https://stakehub-production.up.railway.app";

const OrderForm = () => {
  const [formData, setFormInput] = useState({
    buyerQty: "",
    buyerPrice: "",
    sellerQty: "",
    sellerPrice: "",
  });
  const [isShowPlacedOrderDetails, setIsShowPlacedOrderDetails] =
    useState(false);
  const [orderMessage, setOrderMessage] = useState({
    isShow: false,
    message: "",
  });
  // const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormInput({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setOrderMessage({ isShow: false, message: "" });
  };

  const placeOrder = async () => {
    const { buyerQty, buyerPrice, sellerQty, sellerPrice } = formData;
    console.log(formData);

    // Check if at least two field is filled
    if (
      (buyerQty !== "" && buyerPrice !== "") ||
      (sellerQty !== "" && sellerPrice !== "")
    ) {
      const url = `${apiUrl}/order`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };

      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setIsShowPlacedOrderDetails((prev) => !prev);
          console.log(data);
          setOrderMessage(() => ({
            isShow: true,
            message: "Order placed successfully!",
          }));
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
          setOrderMessage(() => ({ isShow: true, message: errorData.error }));
        }
      } catch (error) {
        console.error("Network error:", error);
        setOrderMessage(() => ({
          isShow: true,
          message: `Network error: ${error}`,
        }));
      }
    } else {
      setOrderMessage(() => ({
        isShow: true,
        message: `At least 2 input field must be filled.`,
      }));
      // alert("At least 2 input field must be filled.");
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder();
  };

  const showOrderDetails = () => {
    const { buyerQty, buyerPrice, sellerQty, sellerPrice } = formData;

    const buyerPriceTag = buyerPrice ? (
      <li>Buyer Price : {buyerPrice}</li>
    ) : null;
    const buyerQtyTag = buyerQty ? <li>Buyer Qty : {buyerQty}</li> : null;
    const sellerQtyTag = sellerQty ? <li>Seller Qty : {sellerQty}</li> : null;
    const sellerPriceTag = sellerPrice ? (
      <li>Seller Price : {sellerPrice}</li>
    ) : null;

    return (
      <ul className="show-message-container">
        {buyerPriceTag}
        {buyerQtyTag}
        {sellerQtyTag}
        {sellerPriceTag}
      </ul>
    );
  };

  const showOrderMessage = () => {
    return <span className="message">*{orderMessage.message}</span>;
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {isShowPlacedOrderDetails && showOrderDetails()}
      <h2>Place Order Form</h2>
      <label>Buyer Quantity</label>
      <input
        type="number"
        name="buyerQty"
        placeholder="Buyer Quantity"
        value={formData.buyerQty}
        onChange={handleInputChange}
      />
      <label>Buyer Price</label>
      <input
        type="number"
        name="buyerPrice"
        placeholder="Buyer Price"
        value={formData.buyerPrice}
        onChange={handleInputChange}
      />
      <label>Seller Quantity</label>
      <input
        type="number"
        name="sellerQty"
        placeholder="Seller Quantity"
        value={formData.sellerQty}
        onChange={handleInputChange}
      />
      <label>Seller Price</label>
      <input
        type="number"
        name="sellerPrice"
        placeholder="Seller Price"
        value={formData.sellerPrice}
        onChange={handleInputChange}
      />
      <button type="submit" className="place-order-btn">
        Place Order
      </button>
      {orderMessage.isShow && showOrderMessage()}
    </form>
  );
};

export default OrderForm;
