import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routing/hooks';
import { ProductCreateForm } from 'src/sections/product/form/product-create-form';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <>
      <title>{`Create Product - ${CONFIG.appName}`}</title>
      <ProductCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

