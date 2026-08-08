import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { VscArrowLeft } from 'react-icons/vsc';

export function TermsPage() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen bg-[#0B0F0C] text-[#E0E0E0] p-8 font-mono relative">
      <button 
        onClick={() => setView('landing')} 
        className="absolute top-8 left-8 flex items-center gap-2 text-crt-muted hover:text-crt-green transition-colors"
      >
        <VscArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="max-w-3xl mx-auto mt-12 bg-[#121814] p-8 border border-[#1A231C] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-[#4ADE80]">Terms of Service</h1>
        <p className="mb-4 text-sm text-[#A0AAB2]">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">1. Acceptance of Terms</h2>
            <p>By accessing and using QuriosNow ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">2. Description of Service</h2>
            <p>QuriosNow provides a browser-based tool for uploading and querying data files (such as CSV, PDF, and DOCX) using local AI models. The processing happens entirely on your device, ensuring privacy and security of your documents.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">3. User Responsibilities</h2>
            <p>You agree to use the Service only for lawful purposes. You are responsible for all data and documents you process using QuriosNow. Because data processing is local, we cannot recover lost data if you close your browser or clear your cache.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">4. Intellectual Property</h2>
            <p>The QuriosNow service, including its original content, features, and functionality, are owned by QuriosNow and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">5. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the Service. Local processing relies on your device's capabilities and internet browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">6. Limitation of Liability</h2>
            <p>In no event shall QuriosNow or its developers be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">7. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
