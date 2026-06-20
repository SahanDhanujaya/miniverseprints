import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata = { title: 'Forgot Password', description: 'Reset your MiniVersePrints password' };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-card rounded-2xl border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
          <p className="text-foreground-muted text-center mb-8">Enter your email to receive a reset link</p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
