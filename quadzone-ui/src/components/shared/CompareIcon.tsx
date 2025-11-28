import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../contexts/CompareContext';

interface CompareIconProps {
  className?: string;
}

const CompareIcon: React.FC<CompareIconProps> = ({ className = '' }) => {
  const { compareProducts } = useCompare();

  return (
    <Link
      to="/compare"
      className={`text-gray-6 font-size-13 d-flex align-items-center ${className}`}
      tabIndex={0}
    >
      <i className="ec ec-compare mr-1 font-size-15"></i>

      {/* Text giống hệt mẫu */}
      Compare

      {/* Badge số lượng sản phẩm */}
      {compareProducts.length > 0 && (
        <span
          className="badge badge-primary position-absolute"
          style={{ top: '-5px', right: '-5px' }}
        >
          {compareProducts.length}
        </span>
      )}
    </Link>
  );
};

export default CompareIcon;
