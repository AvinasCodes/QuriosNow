import { motion } from 'framer-motion';
import { FEATURES } from '@/constants';
import { RetroWindow } from '@/components/ui/RetroWindow';
import {
  VscCloudUpload,
  VscTable,
  VscSymbolMisc,
  VscEdit,
  VscExport,
  VscLock,
} from 'react-icons/vsc';
import type { ReactNode } from 'react';

/* ============================================================
   FeaturesSection — Feature cards grid
   ============================================================ */

const iconMap: Record<string, ReactNode> = {
  upload: <VscCloudUpload size={20} />,
  table: <VscTable size={20} />,
  type: <VscSymbolMisc size={20} />,
  edit: <VscEdit size={20} />,
  export: <VscExport size={20} />,
  lock: <VscLock size={20} />,
};

export function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {/* Section header */}
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-crt-muted tracking-[0.3em] uppercase mb-2">
            ── SYSTEM CAPABILITIES ──
          </p>
          <h2 className="font-terminal text-2xl text-crt-green glow-green">
            {'>'} FEATURES.readme
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            >
              <RetroWindow
                title={feature.title.toLowerCase().replace(/\s+/g, '_')}
                hideControls
                className="h-full hover:border-[var(--crt-green-dim)] transition-colors group"
              >
                <div className="flex flex-col gap-3">
                  <div className="text-crt-green group-hover:glow-green transition-all">
                    {iconMap[feature.icon]}
                  </div>
                  <h3 className="font-terminal text-lg text-crt-green">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-xs text-crt-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </RetroWindow>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
