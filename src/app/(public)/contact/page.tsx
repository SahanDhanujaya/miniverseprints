import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';
export const metadata = { title: 'Contact Us', description: 'Get in touch with MiniVersePrints' };
export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-background-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-3"><MessageCircle className="w-5 h-5 text-green-500" /><div><div className="font-medium">WhatsApp</div><div className="text-sm text-foreground-muted">+94 78 252 5156</div></div></div>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-accent" /><div><div className="font-medium">Email</div><div className="text-sm text-foreground-muted">hello@miniverseprints.lk</div></div></div>
            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-accent" /><div><div className="font-medium">Location</div><div className="text-sm text-foreground-muted">Sri Lanka</div></div></div>
          </div>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"><Button className="w-full" size="lg"><MessageCircle className="w-5 h-5" /> Chat on WhatsApp</Button></a>
        </div>
        <div className="bg-background-card rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <Input id="name" name="name" label="Name" required />
            <Input id="email" name="email" type="email" label="Email" required />
            <Input id="subject" name="subject" label="Subject" required />
            <div><label className="block text-sm font-medium text-foreground-muted mb-1.5">Message</label><textarea name="message" rows={4} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" required /></div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
