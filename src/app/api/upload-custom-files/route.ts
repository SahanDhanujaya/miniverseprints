import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ fileUrls: [] });
    }

    const supabase = createAdminClient();
    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Create a unique clean path
      const fileExt = file.name.split('.').pop() || 'tmp';
      const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `custom-inquiries/${cleanFileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to public storage bucket
      const { error: uploadError } = await supabase.storage
        .from('custom-inquiries')
        .upload(filePath, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true,
        });

      if (uploadError) {
        console.error(`[Upload Error] ${file.name}:`, uploadError.message);
        continue;
      }

      // Generate public URL
      const { data: publicData } = supabase.storage
        .from('custom-inquiries')
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        uploadedUrls.push(publicData.publicUrl);
      }
    }

    return NextResponse.json({ fileUrls: uploadedUrls });
  } catch (error: any) {
    console.error('[API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to upload files', fileUrls: [] },
      { status: 500 }
    );
  }
}