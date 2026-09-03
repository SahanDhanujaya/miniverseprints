"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  bucketPath: string; // e.g. 'models' or 'products' (used as folder inside bucket)
  bucketName?: string; // storage bucket name, default 'public'
  accept?: string;
  multiple?: boolean;
  name: string; // the form field name to set hidden inputs
};

export default function MediaUploader({ bucketPath, bucketName = 'miniverse_bucket', accept = '*/*', multiple = false, name }: Props) {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setErrorMsg('Please sign in as an admin before uploading files.');
        return;
      }

      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = Date.now();
        const path = `${bucketPath}/${timestamp}_${file.name}`;
        const { error } = await supabase.storage.from(bucketName).upload(path, file, { cacheControl: '3600', upsert: false });
        if (error) {
          console.error('Upload error', error.message);
          if (error.message && error.message.toLowerCase().includes('bucket')) {
            setErrorMsg(`Storage bucket '${bucketName}' not found. Create the bucket in Supabase or pass the correct bucketName prop.`);
          } else if (error.message && error.message.toLowerCase().includes('row-level security')) {
            setErrorMsg(`Upload blocked by Supabase storage RLS. Add an admin policy for the '${bucketName}' bucket or sign in with an admin account.`);
          } else {
            setErrorMsg(error.message || 'Upload failed.');
          }
          continue;
        }

        const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
        const publicUrl = data.publicUrl?.trim();
        if (!publicUrl) {
          setErrorMsg('Uploaded file finished but no public URL was produced. Please verify the bucket and file path.');
          continue;
        }

        uploadedUrls.push(publicUrl);
      }
      setUrls(prev => multiple ? [...prev, ...uploadedUrls] : uploadedUrls);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Upload ({bucketPath})</label>
      <input type="file" accept={accept} multiple={multiple} onChange={handleFiles} />
      {uploading && <div className="text-sm text-foreground-muted">Uploading...</div>}
      {errorMsg && <div className="text-sm text-error">{errorMsg}</div>}
      <div className="flex flex-col gap-1">
        {urls.map((u, idx) => (
          <div key={u} className="text-sm text-foreground-muted">{u}
            <input type="hidden" name={name} value={u} />
          </div>
        ))}
      </div>
    </div>
  );
}
