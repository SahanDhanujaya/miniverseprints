import Breadcrumb from '@/components/ui/Breadcrumb';
export const metadata = { title: 'Privacy Policy', description: 'Privacy policy' };
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground-muted">
        <p>At MiniVersePrints, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
        <h2 className="text-foreground">Information We Collect</h2>
        <p>We collect information you provide during registration, checkout, and communication, including name, email, phone, and delivery address.</p>
        <h2 className="text-foreground">How We Use Your Information</h2>
        <p>Your information is used to process orders, deliver products, communicate order updates, and improve our services.</p>
        <h2 className="text-foreground">Data Protection</h2>
        <p>We use secure encryption and follow industry best practices to protect your data. We never share your personal information with third parties for marketing purposes.</p>
      </div>
    </div>
  );
}
