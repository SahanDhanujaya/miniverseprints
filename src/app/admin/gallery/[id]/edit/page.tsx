import { notFound } from 'next/navigation';
import GalleryForm from '../../GalleryForm';
import { getGalleryItemById } from '@/lib/gallery-data';

export const metadata = {
  title: 'Edit Gallery Work - Admin',
};

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getGalleryItemById(id);

  if (!item) {
    notFound();
  }

  return <GalleryForm initialData={item} isEdit={true} />;
}
