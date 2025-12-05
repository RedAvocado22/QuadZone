// components/shared/WishlistButton.tsx

import React, { useState } from 'react';
import { useWishlist } from '../../contexts/WishListContext';
import { useUser } from '../../hooks/useUser';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = '',
  showText = false,
  size = 'md',
  variant = 'icon',
}: WishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to use wishlist');
      navigate('/login', { state: { from: globalThis.window?.location.pathname } });
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
        toast.info('Removed from wishlist ❤️‍🩹');
      } else {
        await addToWishlist(productId);
        toast.success('Added to wishlist ❤️');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = (): string => {
    if (loading) return 'Loading...';
    if (inWishlist) return 'In Wishlist';
    return 'Add to Wishlist';
  };

  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'font-size-16',
    md: 'font-size-22',
    lg: 'font-size-32',
  };

  const buttonBaseClass =
    variant === 'icon'
      ? `btn btn-icon ${inWishlist ? 'btn-danger' : 'btn-outline-danger'}`
      : `${inWishlist ? 'btn btn-danger' : 'btn btn-outline-danger'}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`${buttonBaseClass} ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      data-toggle="tooltip"
      data-placement="top"
    >
      <i
        className={`ec ${
          inWishlist ? 'ec-favorites text-white' : 'ec-favorites text-danger'
        } ${sizeClasses[size]}`}
      ></i>

      {showText && (
        <span className="ml-2">{getButtonText()}</span>
      )}
    </button>
  );
};

export default WishlistButton;
