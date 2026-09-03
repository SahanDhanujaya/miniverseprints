'use client';

import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function CustomOrderPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const { error } = await (await supabase).from('custom_orders').insert(data);
    if (error) {
      console.error('Error creating custom order:', error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 pb-12"
    >
      <Breadcrumb items={[{ label: 'Custom Order' }]} />
      <h1 className="text-3xl font-bold mb-2">Custom Order Request</h1>
      <p className="text-foreground-muted mb-6">Tell us about your dream figure and we will make it happen!</p>

      <form className="space-y-4 bg-background-card rounded-2xl border border-border p-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="name" name="name" label="Your Name" required />
          <Input id="email" name="email" type="email" label="Email" required />
        </div>

        <Input id="whatsapp" name="whatsapp" type="tel" label="WhatsApp Number" placeholder="07X XXX XXXX" required />
        <Input id="character_name" name="character_name" label="Character / Figure Name" required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="size" name="size" label="Preferred Size" placeholder="e.g., 15cm, 25cm" />
          <Select
            id="paint_type"
            name="paint_type"
            label="Paint Type"
            options={[
              { value: 'unpainted', label: 'Unpainted' },
              { value: 'painted', label: 'Painted' }
            ]}
            placeholder="Select"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="required_date" name="required_date" type="date" label="Required Date" />
          <Input id="budget" name="budget" label="Budget Range" placeholder="e.g., Rs. 5,000 - 15,000" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1.5">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="Describe what you want in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1.5">Reference Images</label>
          <input
            name="reference_images"
            type="file"
            multiple
            accept="image/*"
            className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-accent file:text-black hover:file:bg-accent-hover"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="agree_terms" required className="accent-accent" />
          I agree to the terms and conditions
        </label>

        <Button type="submit" size="lg" className="w-full text-black!">Submit Custom Order Request</Button>
      </form>
    </motion.div>
  );
}