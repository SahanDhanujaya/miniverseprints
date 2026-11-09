'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { getMediaUrl, PLACEHOLDER_IMAGE } from '@/lib/media-url';

type MediaImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
  transformWidth?: number;
};

export default function MediaImage({ src, transformWidth = 640, onError, ...props }: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? PLACEHOLDER_IMAGE : getMediaUrl(src, transformWidth);

  return (
    <Image
      {...props}
      alt={props.alt ?? ''}
      src={imageSrc}
      unoptimized
      onError={(event) => {
        if (!failed) setFailed(true);
        onError?.(event);
      }}
    />
  );
}
