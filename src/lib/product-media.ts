export function extractUploadedImageUrls(formData: FormData): string[] {
  const values = formData.getAll('image_url') as string[];
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

export function pickPrimaryImageUrl(formData: FormData): string | null {
  return extractUploadedImageUrls(formData)[0] || null;
}
