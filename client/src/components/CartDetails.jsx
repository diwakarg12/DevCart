import { useEffect, useState } from "react";
import "./cartstyle.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeToCart,
  removeSingleIteams,
  emptycartIteam,
} from "../redux/features/cartSlice";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const CartDetails = () => {
  const { carts } = useSelector((state) => state.allCart);

  const [totalprice, setPrice] = useState(0);
  const [totalquantity, setTotalQuantity] = useState(0);

  const dispatch = useDispatch();

  // add to cart
  const handleIncrement = (e) => {
    dispatch(addToCart(e));
  };

  // remove to cart
  const handleDecrement = (e) => {
    dispatch(removeToCart(e));
    toast.success("Item Remove From Your Cart");
  };

  // remove single item
  const handleSingleDecrement = (e) => {
    dispatch(removeSingleIteams(e));
  };

  // empty cart
  const emptycart = () => {
    dispatch(emptycartIteam());
    toast.success("Your Cart is Empty");
  };

  // count total price
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const total = () => {
    let totalprice = 0;
    carts.map((ele) => {
      totalprice = ele.price * ele.qnty + totalprice;
    });
    setPrice(totalprice);
  };

  // count total quantity
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const countquantity = () => {
    let totalquantity = 0;
    carts.map((ele) => {
      totalquantity = ele.qnty + totalquantity;
    });
    setTotalQuantity(totalquantity);
  };

  useEffect(() => {
    total();
  }, [total]);

  useEffect(() => {
    countquantity();
  }, [countquantity]);

  //make payment through stripe
  const makePayment = async () => {
    console.log(import.meta.env.VITE_STRIPE_KEY);
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);

    const body = {
      products: carts,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      "http://localhost:4000/api/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "0",
        }}
      >
        <div
          className="cardsdetails"
          style={{
            marginTop: "3rem",
            marginBottom: "3rem",
          }}
        >
          <div className="card">
            <div
              className="card-header"
              style={{ backgroundColor: "#343a40", padding: "1rem" }}
            >
              <div className="card-header-flex">
                <h5
                  className="text-white m-0"
                  style={{ color: "#ffffff", margin: "0px" }}
                >
                  Cart Calculation{carts.length > 0 ? `(${carts.length})` : ""}
                </h5>
                {carts.length > 0 ? (
                  <button
                    className="btn btn-danger"
                    style={{
                      marginTop: "0",
                      fontSize: "0.875rem",
                      padding: "0.25rem 0.5rem",
                      fontWeight: "400",
                    }}
                    onClick={emptycart}
                  >
                    <i className="fa fa-trash-alt mr-2"></i>
                    <span>EmptyCart</span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="card-body p-0">
              {carts.length === 0 ? (
                <table
                  className="table cart-table"
                  style={{ marginBottom: "0" }}
                >
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <div className="cart-empty">
                          <i className="fa fa-shopping-cart"></i>
                          <p>Your Cart Is Empty</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="table cart-table mb-0 table-responsive-sm">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th style={{ textAlign: "right" }}>
                        {" "}
                        <span id="amount" className="amount">
                          Total Amount
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ width: "100%" }}>
                    {carts.map((data, index) => {
                      return (
                        <div key={index}>
                          <tr>
                            <td>
                              <button
                                className="prdct-delete"
                                onClick={() => handleDecrement(data.id)}
                              >
                                <i className="fa fa-trash-alt"></i>
                              </button>
                            </td>
                            <td>
                              <div className="product-img" style={{}}>
                                <img src={data.imgdata} alt="" />
                              </div>
                            </td>
                            <td>
                              <div className="product-name">
                                <p>{data.dish}</p>
                              </div>
                            </td>
                            <td>{data.price}</td>
                            <td>
                              <div className="prdct-qty-container">
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={
                                    data.qnty <= 1
                                      ? () => handleDecrement(data.id)
                                      : () => handleSingleDecrement(data)
                                  }
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                                <input
                                  type="text"
                                  className="qty-input-box"
                                  value={data.qnty}
                                  disabled
                                  name=""
                                  id=""
                                />
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={() => handleIncrement(data)}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="text-right">
                              ₹ {data.qnty * data.price}
                            </td>
                          </tr>
                        </div>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>&nbsp;</th>
                      <th colSpan={2}>&nbsp;</th>
                      <th>
                        Items In Cart{" "}
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            marginRight: "0.5rem",
                          }}
                        >
                          :
                        </span>
                        <span className="text-danger">{totalquantity}</span>
                      </th>
                      <th style={{ textAlign: "right" }}>
                        Total Price
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            marginRight: "0.5rem",
                          }}
                        >
                          :
                        </span>
                        <span className="text-danger">₹ {totalprice}</span>
                      </th>
                      <th style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-success"
                          type="button"
                          onClick={makePayment}
                        >
                          Checkout
                        </button>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
