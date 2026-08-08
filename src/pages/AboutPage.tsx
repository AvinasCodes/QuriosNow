import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { VscArrowLeft } from 'react-icons/vsc';

export function AboutPage() {
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
        <h1 className="text-3xl font-bold mb-6 text-[#4ADE80]">About QuriosNow</h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">Our Mission</h2>
            <p>At QuriosNow, we believe that interacting with your data shouldn't mean sacrificing your privacy. Our mission is to provide powerful, AI-driven data exploration and document querying tools that run entirely on your local device. We empower users to unlock insights from their spreadsheets and documents securely, instantly, and without the need for complex server infrastructures.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">Why Local-First?</h2>
            <p>Traditional AI tools require you to upload your sensitive documents to remote servers. We saw a better way. By leveraging modern browser technologies like WebGPU and Web Workers, QuriosNow brings the intelligence to your data, rather than sending your data to the cloud. This means zero latency, absolute privacy, and the ability to work completely offline once the application has loaded.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">The Technology</h2>
            <p>QuriosNow combines cutting-edge frontend technologies to deliver a seamless experience:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>In-Browser Embedding Models:</strong> For generating high-quality document representations on the fly.</li>
              <li><strong>IndexedDB Vector Stores:</strong> For fast and efficient similarity search directly within your browser.</li>
              <li><strong>Dynamic Extractors:</strong> Capable of parsing PDFs, Word documents, PowerPoint presentations, and code files entirely client-side.</li>
              <li><strong>Retro Aesthetic UI:</strong> Because exploring data should be as fun as a classic terminal interface, combined with modern usability.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-[#4ADE80]">Get in Touch</h2>
            <p>We are constantly looking to improve and expand our local-first toolset. If you have feedback, feature requests, or just want to say hello, feel free to reach out to us at support@quriosnow.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
