import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth-session';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Admin Studio Login - MiniVersePrints',
  description: 'Sign in to MiniVersePrints Admin Studio',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-[#EFE7DC] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6E5A4B] hover:text-[#1F150E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Site
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-8 sm:p-10 shadow-[0_20px_50px_rgba(44,31,22,0.12)] space-y-8">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-md border border-[#D5C5B5] mx-auto">
              <Image
                src="/images/logo.png"
                alt="MiniVersePrints Logo"
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E3D3] text-[#A34E17] text-[10px] font-bold uppercase tracking-widest mb-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Studio Portal
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F150E]">
                Admin Sign In
              </h1>
              <p className="text-xs text-[#6E5A4B] mt-1">
                Enter your credentials to manage gallery, orders, and reviews.
              </p>
            </div>
          </div>

          {/* Form */}
          <AdminLoginForm />
        </div>

        {/* Studio Footer */}
        <p className="text-center text-[11px] text-[#8C7969]">
          &copy; {new Date().getFullYear()} MiniVersePrints Sri Lanka. All administrative actions logged.
        </p>
      </div>
    </div>
  );
}
