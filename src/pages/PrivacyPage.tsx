import React from 'react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F0C] text-[#E0E0E0] p-8 font-mono">
      <div className="max-w-3xl mx-auto mt-12 bg-[#121814] p-8 border border-[#1A231C] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-[#4ADE80]">Privacy Policy</h1>
        <p className="mb-4 text-sm text-[#A0AAB2]">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">1. Introduction</h2>
            <p>Welcome to QuriosNow. We are committed to protecting your privacy and ensuring that your personal information is handled safely and responsibly. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">2. Information We Collect</h2>
            <p><strong>Locally Processed Data:</strong> QuriosNow is designed as a local-first application. When you upload documents (CSV, PDF, etc.) for processing or querying, all data processing, including AI models, runs entirely within your browser. We do not upload your documents to our servers.</p>
            <p className="mt-2"><strong>Usage Data:</strong> We may collect standard analytics data (such as IP addresses, browser types, and usage patterns) to improve our service, ensure security, and display relevant advertisements via Google AdSense.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">3. Cookies and Advertising</h2>
            <p>We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">4. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Analyze usage trends to enhance user experience.</li>
              <li>Display targeted advertisements (through Google AdSense).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">5. Data Security</h2>
            <p>Since your primary data (uploaded documents) never leaves your browser, it remains as secure as your own device. We implement industry-standard security measures for our website infrastructure to protect against unauthorized access or alteration of any collected usage data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@quriosnow.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
