import { CONFIG } from 'src/config-global';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
import { ProductEditForm } from 'src/sections/product/form/product-edit-form';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (!id) {
    return null;
  }

  return (
    <>
      <title>{`Edit Product - ${CONFIG.appName}`}</title>
      <ProductEditForm productId={id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

