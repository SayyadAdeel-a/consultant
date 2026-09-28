"use client";

import React from "react";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        <section className="style-guide py-16">
          <div className="container">
            <div className="style-guide-wrapper space-y-16">
              {/* Color Style */}
              <div className="style-guide-color-wrap">
                <div className="style-guide-heading mb-8">
                  <h3 className="style-guide-title fade-anim text-3xl font-semibold">Color Style</h3>
                </div>
                <div className="style-guide-color-cord-wrapper grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="style-guide-color color-one fade-anim border border-[#cac7c1] rounded-2xl p-6 bg-white min-h-[140px] flex items-end">
                    <div className="style-guide-color-cord font-mono text-sm">#FFFFFF</div>
                  </div>
                  <div className="style-guide-color color-two fade-anim border border-[#cac7c1] rounded-2xl p-6 bg-[#f6f2eb] min-h-[140px] flex items-end">
                    <div className="style-guide-color-cord font-mono text-sm">#f6f2eb</div>
                  </div>
                  <div className="style-guide-color color-three fade-anim border border-[#cac7c1] rounded-2xl p-6 bg-[#15190d] text-white min-h-[140px] flex items-end">
                    <div className="style-guide-color-cord font-mono text-sm">#15190d</div>
                  </div>
                  <div className="style-guide-color color-four fade-anim border border-[#cac7c1] rounded-2xl p-6 bg-[#dfe0d4] min-h-[140px] flex items-end">
                    <div className="style-guide-color-cord font-mono text-sm">#dfe0d4</div>
                  </div>
                  <div className="style-guide-color color-five fade-anim border border-[#cac7c1] rounded-2xl p-6 bg-[#81837d] text-white min-h-[140px] flex items-end">
                    <div className="style-guide-color-cord font-mono text-sm">#81837d</div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="style-guide-typography-wrap">
                <div className="style-guide-heading mb-8">
                  <h3 className="style-guide-title fade-anim text-3xl font-semibold">Typography</h3>
                </div>
                <div className="style-guide-typography-wrapper border border-[#cac7c1] rounded-2xl divide-y divide-[#cac7c1] bg-[#f6f2eb]">
                  <div className="style-guide-typography-table-wrap fade-anim grid grid-cols-3 p-4 font-semibold text-sm text-[#81837d]">
                    <div>Design Ratios</div>
                    <div>Weight</div>
                    <div>Size</div>
                  </div>
                  <div className="style-guide-typography-box fade-anim grid grid-cols-3 p-4 items-center">
                    <h1 className="text-4xl font-semibold">H1</h1>
                    <div className="typography-text text-[#81837d]">500</div>
                    <div className="typography-text text-[#81837d]">76px</div>
                  </div>
                  <div className="style-guide-typography-box fade-anim grid grid-cols-3 p-4 items-center">
                    <h2 className="text-3xl font-semibold">H2</h2>
                    <div className="typography-text text-[#81837d]">500</div>
                    <div className="typography-text text-[#81837d]">58px</div>
                  </div>
                  <div className="style-guide-typography-box fade-anim grid grid-cols-3 p-4 items-center">
                    <h3 className="text-2xl font-semibold">H3</h3>
                    <div className="typography-text text-[#81837d]">600</div>
                    <div className="typography-text text-[#81837d]">40px</div>
                  </div>
                  <div className="style-guide-typography-box fade-anim grid grid-cols-3 p-4 items-center">
                    <h4 className="text-xl font-semibold">H4</h4>
                    <div className="typography-text text-[#81837d]">500</div>
                    <div className="typography-text text-[#81837d]">32px</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
