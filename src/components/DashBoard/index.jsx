import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

import "./index.css";

const apiConstants = {
  success: "SUCCESS",
  failed: "FAILED",
  inProgress: "IN_PROGRESS",
  initial: "INITIAL",
};

const apiUrl = "https://stakehub-production.up.railway.app";

const DashBoard = () => {
  const [orders, setOrders] = useState({
    pendingBuyerOrders: [],
    pendingSellerOrders: [],
    completedOrders: [],
  });
  const [apiStatus, setApiStatus] = useState(apiConstants.initial);

  const renderDashBoard = () => {
    switch (apiStatus) {
      case apiConstants.inProgress:
        return renderLoader();
      case apiConstants.success:
        return renderSuccessView();
      case apiConstants.failed:
        return renderFailureView();
    }
  };

  const renderLoader = () => {
    return (
      <p className="spinner">
        <Spinner animation="border" role="status"></Spinner> Fetching Details...
      </p>
    );
  };

  const deleteCompletedOrderItem = async (id) => {
    const url = `${apiUrl}/completed_orders/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const updatedCompletedOrders = orders?.completedOrders?.filter(
          (value) => value.id !== id
        );

        setOrders((prev) => ({
          ...prev,
          completedOrders: updatedCompletedOrders,
        }));
      } else {
        console.log("Error while deleting:", response);
      }
    } catch (e) {
      console.log("Error while deleting:", e);
    }
  };

  const renderSuccessView = () => {
    const recentOrder = orders?.completedOrders?.at(-1);

    return (
      <>
        <h1>Order Details</h1>
        <div className="recent-order">
          <p>Recent order : </p>
          {recentOrder && <p>Price: {recentOrder.price} </p>}
          {recentOrder && <p>Quantity: {recentOrder.qty} </p>}
        </div>
        <h2 className="pending-orders-heading">Pending Orders</h2>
        <div className="pending-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Buyer Price</th>
                <th>Buyer Quntity</th>
              </tr>
            </thead>

            <tbody>
              {orders?.pendingBuyerOrders?.map((order, index) => {
                return (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.buyerPrice}</td>
                    <td>{order.buyerQty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Seller Price</th>
                <th>Seller Quantity</th>
              </tr>
            </thead>

            <tbody>
              {orders?.pendingSellerOrders?.map((order, index) => {
                return (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.sellerPrice}</td>
                    <td>{order.sellerQty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h2 className="completed-orders-heading">Completed Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody className="completed-order-body">
            {orders?.completedOrders?.map((order, index) => {
              return (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.price}</td>
                  <td>{order.qty}</td>
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={() => deleteCompletedOrderItem(order.id)}
                  >
                    X
                  </button>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  const renderFailureView = () => {
    return <div>Failed</div>;
  };

  const fetchData = async () => {
    setApiStatus(apiConstants.inProgress);
    const url = `${apiUrl}/orders`;

    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setApiStatus(apiConstants.success);
        const { pendingBuyerOrders, pendingSellerOrders, completedOrders } =
          data;

        const updatedPendingBuyerOrders = pendingBuyerOrders.map((order) => {
          return {
            id: order.id,
            buyerQty: order.buyer_qty,
            buyerPrice: order.buyer_price,
          };
        });
        const updatedPendingSellerOrders = pendingSellerOrders.map((order) => {
          return {
            id: order.id,
            sellerQty: order.seller_qty,
            sellerPrice: order.seller_price,
          };
        });

        setOrders({
          completedOrders,
          pendingBuyerOrders: updatedPendingBuyerOrders,
          pendingSellerOrders: updatedPendingSellerOrders,
        });
      } else {
        setApiStatus(apiConstants.failed);
      }
    } catch (e) {
      setApiStatus(apiConstants.failed);
      console.log("Network Error :", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div className="order-details">{renderDashBoard()}</div>;
};

export default DashBoard;
