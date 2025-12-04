import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routing/hooks';
import { SubCategoryCreateView } from 'src/sections/category/form';

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => router.push('/admin/subcategory');
  const handleCancel = () => router.push('/admin/subcategory');

  return (
    <>
      <title>{`Create SubCategory - ${CONFIG.appName}`}</title>
    <SubCategoryCreateView onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
