import AdminLoginForm from '@/components/auth/AdminLoginForm';
import Link from 'next/link';
import AdminIpGate from '@/components/admin/AdminIpGate';

export const metadata = {
  title: 'Admin Login',
  description: 'Administrator login for MiniVersePrints',
};

export default function AdminLoginPage() {
  const allowedIp = process.env.ADMIN_ALLOWED_IPS || '';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-card rounded-2xl border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Admin Sign In</h1>
          <p className="text-foreground-muted text-center mb-8">Sign in with an administrator account</p>
          <AdminIpGate allowedIp={allowedIp}>
            <AdminLoginForm />
            <p className="mt-6 text-center text-sm text-foreground-muted">
              Back to the <Link href="/" className="text-accent hover:underline">store</Link>
            </p>
          </AdminIpGate>
        </div>
      </div>
    </div>
  );
}
