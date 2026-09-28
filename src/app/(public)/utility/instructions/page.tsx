"use client";

import React from "react";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        <section className="breadcrumb-section utility-breadcrumb-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="utility-breadcrumb-content-wrap">
              <div className="utility-breadcrumb-title-wrap">
                <h1 className="breadcrumb-tiitle text-center title-anim">Instructions</h1>
              </div>
              <p className="text-regular utility-breadcrumb-para fade-anim">
                Architecture, animation token guidelines, and technical implementation reference for the Alderline Environmental demonstration codebase.
              </p>
            </div>
          </div>
        </section>

        <section className="utility-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="utility-content-wrap space-y-12">
              <div className="utility-item fade-anim">
                <h5 className="utility-item-title text-2xl font-semibold mb-3">Customizing colors</h5>
                <p className="text-[#81837d]">
                  This implementation utilizes Tailwind CSS and CSS design tokens in <code>src/app/globals.css</code> and <code>src/app/ecolia.css</code>, allowing you to modify all environmental palette tokens across the entire site.
                </p>
              </div>

              <div className="utility-item fade-anim">
                <h5 className="utility-item-title text-2xl font-semibold mb-3">Changing fonts</h5>
                <p className="text-[#81837d]">
                  The font family is configured with <code>next/font/google</code> using the <strong>Inter</strong> variable font in <code>src/app/layout.tsx</code>.
                </p>
              </div>

              <div className="utility-item fade-anim">
                <h5 className="utility-item-title text-2xl font-semibold mb-3">How to Edit GSAP Animations</h5>
                <p className="text-[#81837d] mb-4">
                  All GSAP-powered animations are managed via <code>src/components/ecolia/Animations.tsx</code>. You can customize stagger, offsets, durations, and triggers directly through HTML <code>data-*</code> attributes:
                </p>
                <div className="bg-[#15190d] text-[#f6f2eb] p-6 rounded-xl font-mono text-sm overflow-x-auto">
                  <code>{`<h2 className="title-anim" data-stagger="0.02" data-translateX="25">
  Animated Headline
</h2>`}</code>
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
