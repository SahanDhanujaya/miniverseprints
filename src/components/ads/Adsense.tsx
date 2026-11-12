/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from 'next/script';

const ADSENSE_CLIENT = 'ca-pub-4554856508485846';

export default function Adsense() {
  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
