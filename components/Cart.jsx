import React, { useRef } from "react";
import {
  AiOutlineShopping,
  AiOutlineLeft,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineRight,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import Link from "next/link";

import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import getStripe from "../lib/getStripe";

const cart = () => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItens, setShowCart, toggleCartItemQuantity, onRemove } =
    useStateContext();

    const handleCheckout = async () => {
      const stripe = await getStripe();
  
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItens),
      });
  
      if(response.statusCode === 500) return;
      
      const data = await response.json();
  
      toast.loading('Redirecting...');
  
      stripe.redirectToCheckout({ sessionId: data.id });
    }

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItens.length <= 0 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your cart is currently empty</h3>
            <Link href="/">
              <button
                type="button"
                className="btn"
                onClick={() => setShowCart(false)}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItens.length > 0 &&
            cartItens.map((item) => (
              <div className="product" key={item._id}>
                {console.log(item.name)}
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span className="minus" onClick={() => toggleCartItemQuantity(item._id, "dec")}>
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span className="plus" onClick={() => toggleCartItemQuantity(item._id, "inc")}>
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button 
                      type="button" 
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItens.length > 0 && (
          <div  className="cart-bottom">
            <div className="total">
                <h3>SubTotal:</h3>
                <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>Pay With Stripe</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default cart;
