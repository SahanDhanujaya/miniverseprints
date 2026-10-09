export function extractUploadedImageUrls(formData: FormData): string[] {
  const values = formData.getAll('image_url') as string[];
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

export function resolveImageUrlInput(formData: FormData): string | null | undefined {
  const uploadedUrls = extractUploadedImageUrls(formData);
  if (uploadedUrls.length > 0) return uploadedUrls[0];
  return formData.has('image_url') ? null : undefined;
}

export function pickPrimaryImageUrl(formData: FormData): string | null {
  const primary = resolveImageUrlInput(formData);
  return primary ?? null;
}
