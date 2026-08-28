import GalleryForm from '../GalleryForm';

export const metadata = {
  title: 'Add New Gallery Work - Admin',
};

export default function AddGalleryItemPage() {
  return <GalleryForm isEdit={false} />;
}
