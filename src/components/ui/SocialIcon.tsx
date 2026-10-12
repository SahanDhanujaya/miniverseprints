type SocialIconName = 'facebook' | 'instagram' | 'tiktok';

export default function SocialIcon({ name, className = '' }: { name: SocialIconName; className?: string }) {
  if (name === 'facebook') {
    return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M13.5 21v-7h2.35l.35-2.75H13.5v-1.76c0-.8.22-1.34 1.38-1.34h1.48V5.7c-.26-.04-1.14-.12-2.17-.12-2.15 0-3.62 1.31-3.62 3.72v1.95H8.14V14h2.43v7h2.93Z" /></svg>;
  }

  if (name === 'instagram') {
    return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  }

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M14.2 3h3.05c.22 1.42 1.01 2.45 2.75 2.85v3.08c-1.18-.03-2.08-.3-2.83-.77v6.2c0 3.7-2.57 5.64-5.61 5.64-2.78 0-4.56-1.73-4.56-4.18 0-2.7 2.2-4.56 5.2-4.56.33 0 .66.03.98.09v3.01a2.9 2.9 0 0 0-.8-.12c-1.36 0-2.32.67-2.32 1.62 0 .76.58 1.25 1.48 1.25 1.06 0 1.75-.72 1.75-2.25V3h.91Z" /></svg>;
}
