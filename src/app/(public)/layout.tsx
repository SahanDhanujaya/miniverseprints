import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Website",
  description: "Your website description",

  verification: {
    google: "HcqQ3K0WL5Q3RfslsF-YzIONBGUpa0T5nO956JGJBVQ",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="relative z-[2]">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <FloatingWhatsApp />
    </>
  );
}
