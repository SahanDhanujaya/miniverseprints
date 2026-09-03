'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { MessageCircle, Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    characterName: '',
    size: '',
    paintType: 'unpainted',
    budget: '',
    description: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    let fileUrls: string[] = [];

    // Step 1: Upload physical files if selected
    if (files.length > 0) {
      try {
        const payload = new FormData();
        files.forEach((file) => payload.append('files', file));

        const res = await fetch('/api/upload-custom-files', {
          method: 'POST',
          body: payload,
        });

        const data = await res.json();
        if (data.fileUrls && Array.isArray(data.fileUrls)) {
          fileUrls = data.fileUrls;
        }
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }

    // Step 2: Format clean, single-instance WhatsApp message
    const formattedFilesText =
      fileUrls.length > 0
        ? fileUrls.map((url, i) => `• File ${i + 1}: ${url}`).join('\n')
        : '_No files attached (Will send directly in chat)_';

    const messageLines = [
      '😜 *NEW CUSTOM 3D PRINT INQUIRY*',
      '',
      `🟢 *Client Name:* ${formData.name.trim() || 'Not provided'}`,
      `🟢 *Model / Character:* ${formData.characterName.trim()}`,
      `🟢 *Preferred Size:* ${formData.size.trim() || 'Standard / Unspecified'}`,
      `🟢 *Finish Style:* ${formData.paintType}`,
      `🟢 *Target Budget:* ${formData.budget.trim() || 'Flexible'}`,
      '',
      `📑 *Project Description:*`,
      `${formData.description.trim() || 'None provided.'}`,
      '',
      `🔗 *Attached Model/Reference Files:*`,
      formattedFilesText,
    ];

    const cleanMessage = messageLines.join('\n');
    const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(cleanMessage)}`;

    setIsSubmitting(false);

    // Open WhatsApp in a clean window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 pb-16 pt-6"
    >
      <Breadcrumb items={[{ label: 'Custom Order' }]} />

      <div className="my-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Custom Commission Request
        </h1>
        <p className="text-foreground-muted text-sm leading-relaxed">
          Submit your custom request specifications below. Files will be stored securely and sent directly to our studio on WhatsApp.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-zinc-950/80 rounded-2xl border border-white/10 p-6 md:p-8 backdrop-blur-md shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="name"
            name="name"
            label="Your Name"
            placeholder="Sahan Dhanujaya"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            id="characterName"
            name="characterName"
            label="Character / Item Name"
            placeholder="Batman Bust, Custom Keychain"
            value={formData.characterName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="size"
            name="size"
            label="Preferred Size/Scale"
            placeholder="e.g., 25cm"
            value={formData.size}
            onChange={handleInputChange}
          />
          <Select
            id="paintType"
            name="paintType"
            label="Finish Type"
            value={formData.paintType}
            onChange={handleInputChange}
            options={[
              { value: 'unpainted', label: 'Raw Resin / Unpainted' },
              { value: 'painted', label: 'Full Hand-Painted Finish' },
              { value: 'primer', label: 'Primed Gray Only' },
            ]}
          />
          <Input
            id="budget"
            name="budget"
            label="Budget Target"
            placeholder="e.g., Rs. 5,000"
            value={formData.budget}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1.5">
            Project Description & Details
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
            placeholder="Describe colors, poses, deadlines, or specific details..."
          />
        </div>

        {/* File Attachment Upload Zone */}
        <div className="border-2 border-dashed border-white/15 rounded-xl p-5 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
          <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-sm font-semibold text-white hover:underline">
              Choose reference photos or 3D files
            </span>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.stl,.obj,.3mf,.zip"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-zinc-500 mt-1">
            Accepts `.STL`, `.OBJ`, `.3MF`, `.ZIP`, or Images
          </p>

          {files.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                Selected Attachments ({files.length}):
              </span>
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/5"
                >
                  <FileText className="w-3.5 h-3.5 text-white/70" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-[10px] text-zinc-500 ml-auto">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 rounded border-white/10 bg-black accent-white cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-zinc-400 cursor-pointer">
            I agree to finalize project details and pricing on WhatsApp.
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-[0_0_25px_rgba(34,197,94,0.2)] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Uploading Files...
            </>
          ) : (
            <>
              <MessageCircle className="w-5 h-5 fill-current" />
              Send Inquiry on WhatsApp
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}