import React from 'react';
import { paymentImages } from '../../../constants/images';

const Copyright = () => {
  return (
    <div className="bg-gray-14 py-2">
      <div className="container">
        <div className="flex-center-between d-block d-md-flex">
          <div className="mb-3 mb-md-0">
            © <a href="/" className="font-weight-bold text-gray-90">Electro</a> - All rights Reserved
          </div>
          <div className="text-md-right">
            {paymentImages.map((img, index) => (
              <span key={index} className="d-inline-block bg-white border rounded p-1">
                <img className="max-width-5" src={img} alt="Payment" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright;

