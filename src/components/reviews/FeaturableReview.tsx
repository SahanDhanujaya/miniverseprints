'use client';
import Script from 'next/script';
import "react-google-reviews/dist/index.css";

function Reviews() {
  return (
    <div>
      <div
        id="featurable-1f34bc2c-ea93-4d15-8c91-3510578a5ee6"
        data-featurable-async
      ></div>
      <Script
        src="https://cdn.featurable.com/widget/v2/embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

export default Reviews;