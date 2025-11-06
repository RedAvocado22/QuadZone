import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { defaultImages } from '../../constants/images';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <tr>
      <td className="text-center">
        <a 
          href="#" 
          className="text-gray-32 font-size-26"
          onClick={(e) => {
            e.preventDefault();
            removeFromCart(item.id);
          }}
        >
          ×
        </a>
      </td>
      <td className="d-none d-md-table-cell">
        <Link to={`/product/${item.id}`}>
          <img 
            className="img-fluid max-width-100 p-1 border border-color-1" 
            src={item.image || defaultImages.cart} 
            alt={item.name} 
          />
        </Link>
      </td>
      <td data-title="Product">
        <Link to={`/product/${item.id}`} className="text-gray-90">
          {item.name}
        </Link>
      </td>
      <td data-title="Price">
        <span>${item.price.toFixed(2)}</span>
      </td>
      <td data-title="Quantity">
        <span className="sr-only">Quantity</span>
        <div className="border rounded-pill py-1 width-122 w-xl-80 px-3 border-color-1">
          <div className="js-quantity row align-items-center">
            <div className="col">
              <input 
                className="js-result form-control h-auto border-0 rounded p-0 shadow-none" 
                type="text" 
                value={item.quantity}
                readOnly
              />
            </div>
            <div className="col-auto pr-1">
              <a 
                className="js-minus btn btn-icon btn-xs btn-outline-secondary rounded-circle border-0" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleQuantityChange(item.quantity - 1);
                }}
              >
                <small className="fas fa-minus btn-icon__inner"></small>
              </a>
              <a 
                className="js-plus btn btn-icon btn-xs btn-outline-secondary rounded-circle border-0" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleQuantityChange(item.quantity + 1);
                }}
              >
                <small className="fas fa-plus btn-icon__inner"></small>
              </a>
            </div>
          </div>
        </div>
      </td>
      <td data-title="Total">
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </td>
    </tr>
  );
};

export default CartItem;

