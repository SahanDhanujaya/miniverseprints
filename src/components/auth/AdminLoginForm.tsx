'use client';

import { useActionState } from 'react';
import { adminLogin } from '@/lib/actions/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ShieldCheck, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await adminLogin(formData);
      return result;
    },
    null
  );

  return (
    <div className="space-y-6">
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-shake">
          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#6E5A4B] mb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#A34E17]" />
            Admin Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="chaniyarvc@gmail.com"
            defaultValue="chaniyarvc@gmail.com"
            required
            className="w-full bg-[#FAF6F0] focus:bg-white text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#6E5A4B] mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#A34E17]" />
            Admin Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            required
            className="w-full bg-[#FAF6F0] focus:bg-white text-sm"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          className="w-full bg-[#A34E17] hover:bg-[#853D10] text-white font-bold py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
        >
          <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
          <span>Enter Admin Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D5C5B5] text-[11px] text-[#6E5A4B] space-y-1">
        <p className="font-bold text-[#1F150E] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#A34E17]" /> Authorized Studio Access Only
        </p>
        <p>Use your designated administrative credentials to access the MiniVersePrints management dashboard.</p>
      </div>
    </div>
  );
}
