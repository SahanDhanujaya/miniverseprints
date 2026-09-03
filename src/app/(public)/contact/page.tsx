import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with MiniVersePrints on WhatsApp',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />
      
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
        <p className="text-foreground-muted text-sm max-w-md mx-auto">
          Have questions or want to discuss a custom 3D print order? Reach out directly on WhatsApp for instant inquiries.
        </p>
      </div>

      <div className="bg-background-card rounded-2xl border border-border p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8" />
        </div>

        <div>
          <div className="text-lg font-semibold text-foreground">WhatsApp Direct Line</div>
          <div className="text-sm text-foreground-muted mt-1">+94 78 252 5156</div>
        </div>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button size="lg" className="w-full bg-green-600 hover:bg-green-500 text-white gap-2 font-medium">
            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}