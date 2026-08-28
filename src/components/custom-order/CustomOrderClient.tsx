'use client';

import { useState } from 'react';
import { MessageCircle, Sparkles, CheckCircle2, Send, Clock, ShieldCheck, Palette, Layers, HelpCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { submitCustomOrder } from '@/lib/actions/custom-order';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const TARGET_WHATSAPP_NUMBER = '94782525156';

export default function CustomOrderClient() {
  const [loading, setLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    whatsapp: '',
    email: '',
    character_name: '',
    size: 'Standard (~15cm)',
    paint_type: 'Full Hand-Painted & Shaded',
    required_date: '',
    budget: 'Rs. 5,000 - 10,000',
    description: '',
  });

  const generateWhatsAppMessage = (data: typeof formValues) => {
    return `✨ *NEW CUSTOM 3D PRINT ORDER REQUEST* ✨
━━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${data.name}
📱 *WhatsApp Number:* ${data.whatsapp}
${data.email ? `📧 *Email:* ${data.email}\n` : ''}🎭 *Character / Figure:* ${data.character_name}
📏 *Preferred Size:* ${data.size || 'Standard'}
🎨 *Paint & Finish:* ${data.paint_type || 'Painted'}
📅 *Needed By:* ${data.required_date ? data.required_date : 'Flexible'}
💰 *Target Budget:* ${data.budget || 'Flexible'}
${data.description ? `\n📝 *Details / Notes:*\n${data.description}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━
🌐 *Sent via MiniVersePrints Website*`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const message = generateWhatsAppMessage(formValues);
    const encodedText = encodeURIComponent(message);
    const url = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodedText}`;

    setSubmittedMessage(message);
    setWhatsappUrl(url);

    try {
      await submitCustomOrder(formData);
    } catch {
      // Ignore background submission error
    } finally {
      setLoading(false);
      // Automatically open WhatsApp in a new tab
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Success Modal / Banner */}
      {whatsappUrl && (
        <div className="bg-[#FAF6F0] border-2 border-green-500/40 rounded-3xl p-6 md:p-8 animate-fade-in shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Ready to Send via WhatsApp
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F150E]">
                Your Custom Order Details Are Ready!
              </h2>
              <p className="text-[#6E5A4B] text-sm max-w-xl leading-relaxed">
                We prepared your custom order summary for our WhatsApp desk at{' '}
                <strong className="text-[#1F150E] font-bold">{WHATSAPP_NUMBER}</strong>. If WhatsApp did not open automatically, click the button below to send your request.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold shadow-md">
                  <MessageCircle className="w-5 h-5 mr-2" /> Open WhatsApp Chat
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setWhatsappUrl(null);
                  setSubmittedMessage(null);
                }}
                className="border-[#D5C5B5] text-[#1F150E]"
              >
                New Request
              </Button>
            </div>
          </div>

          {submittedMessage && (
            <div className="mt-6 pt-6 border-t border-[#D5C5B5]">
              <p className="text-xs font-bold text-[#6E5A4B] uppercase tracking-wider mb-2">Message Summary</p>
              <pre className="bg-[#EFE7DC] rounded-2xl p-4 text-xs font-mono text-[#1F150E] whitespace-pre-wrap border border-[#D5C5B5]">
                {submittedMessage}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Main Order Form and Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-8 bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-[#D5C5B5]">
            <div className="w-12 h-12 rounded-2xl bg-[#F5E3D3] flex items-center justify-center text-[#A34E17]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1F150E]">Custom 3D Print Request Form</h2>
              <p className="text-xs md:text-sm text-[#6E5A4B] mt-0.5">Fill out your specifications below to receive an instant WhatsApp quote</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A34E17]">
                <span className="w-5 h-5 rounded-full bg-[#A34E17]/15 text-[#A34E17] flex items-center justify-center text-[11px]">1</span>
                <span>Your Contact Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="name"
                  name="name"
                  label="Your Full Name *"
                  placeholder="e.g., Sahan Dhanujaya"
                  required
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                />
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  label="Your WhatsApp Number *"
                  placeholder="e.g., 078 123 4567"
                  required
                  value={formValues.whatsapp}
                  onChange={(e) => setFormValues({ ...formValues, whatsapp: e.target.value })}
                />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address (Optional)"
                placeholder="e.g., yourname@example.com"
                value={formValues.email}
                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
              />
            </div>

            {/* Step 2: Model & Figure Details */}
            <div className="space-y-4 pt-6 border-t border-[#D5C5B5]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A34E17]">
                <span className="w-5 h-5 rounded-full bg-[#A34E17]/15 text-[#A34E17] flex items-center justify-center text-[11px]">2</span>
                <span>Figure & Specification Details</span>
              </div>
              <Input
                id="character_name"
                name="character_name"
                label="Figure / Character Name *"
                placeholder="e.g., Goku Ultra Instinct, Custom Funko of Me, Iron Man Helmet"
                required
                value={formValues.character_name}
                onChange={(e) => setFormValues({ ...formValues, character_name: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  id="size"
                  name="size"
                  label="Preferred Size / Scale"
                  value={formValues.size}
                  onChange={(e) => setFormValues({ ...formValues, size: e.target.value })}
                  options={[
                    { value: 'Mini (~8-10cm)', label: 'Mini (~8-10cm) - Great for desks & gifts' },
                    { value: 'Standard (~15cm)', label: 'Standard (~15cm) - Most popular' },
                    { value: 'Large (~20-25cm)', label: 'Large (~20-25cm) - High impact display' },
                    { value: 'Giant (~30cm+)', label: 'Giant (~30cm+) - Centerpiece statue' },
                    { value: 'Custom Dimensions', label: 'Custom Specific Dimensions' },
                  ]}
                />

                <Select
                  id="paint_type"
                  name="paint_type"
                  label="Paint Finish"
                  value={formValues.paint_type}
                  onChange={(e) => setFormValues({ ...formValues, paint_type: e.target.value })}
                  options={[
                    { value: 'Full Hand-Painted & Shaded', label: 'Full Hand-Painted & Shaded' },
                    { value: 'Raw Unpainted High-Detail Resin', label: 'Raw Unpainted Resin (Grey / Primer)' },
                    { value: 'Raw Single-Color PLA', label: 'Raw PLA (Black / White / Silk)' },
                    { value: 'Metallic & Wash Finish', label: 'Metallic Bronze / Silver Wash' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  id="budget"
                  name="budget"
                  label="Estimated Budget Range"
                  value={formValues.budget}
                  onChange={(e) => setFormValues({ ...formValues, budget: e.target.value })}
                  options={[
                    { value: 'Under Rs. 3,000', label: 'Under Rs. 3,000 (Minis / Keychains)' },
                    { value: 'Rs. 3,000 - 6,000', label: 'Rs. 3,000 - 6,000 (Standard figures / busts)' },
                    { value: 'Rs. 6,000 - 12,000', label: 'Rs. 6,000 - 12,000 (Detailed painted statues)' },
                    { value: 'Rs. 12,000+', label: 'Rs. 12,000+ (Large scale custom figures)' },
                    { value: 'Flexible / Open to Quote', label: 'Flexible / Open to quotation' },
                  ]}
                />

                <Input
                  id="required_date"
                  name="required_date"
                  type="date"
                  label="Needed By Date (Optional)"
                  value={formValues.required_date}
                  onChange={(e) => setFormValues({ ...formValues, required_date: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-[#1F150E] mb-1.5">
                  Detailed Description & Reference Notes
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[#EFE7DC] hover:bg-white focus:bg-white border border-[#D5C5B5] text-[#1F150E] placeholder-[#8C7969] focus:outline-none focus:ring-2 focus:ring-[#A34E17]/30 focus:border-[#A34E17] text-sm leading-relaxed transition-all shadow-2xs"
                  placeholder="Provide reference links (Google Drive, Pinterest, STL link), pose preferences, or any specific details..."
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                />
                <p className="text-xs text-[#6E5A4B] mt-1.5 flex items-center gap-1 font-medium">
                  💡 <span>Tip: You can also attach photos directly in WhatsApp once the chat opens!</span>
                </p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                'Processing Order...'
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit & Send to WhatsApp (+94 78 252 5156)
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Sidebar Info & Trust Badges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-6 md:p-8 space-y-5 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-[#1F150E] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#A34E17]" /> How It Works
            </h3>
            <ol className="space-y-4 text-xs text-[#6E5A4B]">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5E3D3] text-[#A34E17] font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <div>
                  <strong className="text-[#1F150E] font-bold block text-sm">Submit Your Request</strong>
                  Fill the form with character details or reference photos.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5E3D3] text-[#A34E17] font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <div>
                  <strong className="text-[#1F150E] font-bold block text-sm">Instant WhatsApp Quote</strong>
                  We review your 3D model, scale, and provide exact pricing & timeline.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5E3D3] text-[#A34E17] font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <div>
                  <strong className="text-[#1F150E] font-bold block text-sm">3D Print & Hand Paint</strong>
                  We print in high-detail resin/PLA and hand-paint to perfection.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5E3D3] text-[#A34E17] font-bold flex items-center justify-center flex-shrink-0 text-xs">4</span>
                <div>
                  <strong className="text-[#1F150E] font-bold block text-sm">Island-wide Delivery</strong>
                  Secure packaging and fast doorstep delivery across Sri Lanka.
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-[#1F150E] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" /> MiniVerse Quality
            </h3>
            <ul className="space-y-3 text-xs text-[#6E5A4B]">
              <li className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#A34E17]" /> High-precision 8K resin & PLA printing
              </li>
              <li className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-[#A34E17]" /> Custom airbrush & acrylic hand-painting
              </li>
              <li className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#A34E17]" /> Free 3D model sourcing & consultation
              </li>
            </ul>
          </div>

          <div className="bg-[#E4D7C7] border border-[#D5C5B5] rounded-3xl p-6 text-center space-y-3 shadow-xs">
            <h4 className="font-serif font-bold text-[#1F150E]">Prefer to message directly?</h4>
            <p className="text-xs text-[#6E5A4B]">
              Chat directly with our studio on WhatsApp for fast answers.
            </p>
            <a
              href={`https://wa.me/${TARGET_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold">
                <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp ({WHATSAPP_NUMBER})
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
