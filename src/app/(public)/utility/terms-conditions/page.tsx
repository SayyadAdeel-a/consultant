"use client";

import React from "react";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        <section className="breadcrumb-section utility-breadcrumb-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="utility-breadcrumb-content-wrap">
              <div className="utility-breadcrumb-title-wrap">
                <h1 className="breadcrumb-tiitle text-center title-anim">Terms &amp; Conditions</h1>
              </div>
              <p className="text-regular utility-breadcrumb-para fade-anim text-[#81837d] max-w-xl mx-auto text-center">
                Terms governing use of the Alderline Environmental website demonstration.
              </p>
            </div>
          </div>
        </section>

        <section className="utility-section py-16">
          <div className="w-layout-blockcontainer container w-container max-w-4xl">
            <div className="utility-content-wrap space-y-10">
              <div className="p-6 rounded-2xl border border-[#cac7c1] bg-[#dfe0d4] text-sm text-[#15190d]">
                <p className="font-semibold mb-1">Demonstration Notice</p>
                <p className="text-xs text-[#81837d]">
                  Alderline Environmental is a demonstration portfolio website. Content on this site is provided for illustrative evaluation purposes and does not constitute formal environmental engineering or legal counsel.
                </p>
              </div>

              <div className="utility-item fade-anim">
                <h3 className="text-2xl font-semibold mb-3">1. Demonstration Scope</h3>
                <p className="text-[#81837d] leading-relaxed">
                  Information provided across this website represents typical consulting capabilities in environmental site assessment, wetland science, and permitting strategy. Formal project commitments require executed Master Services Agreements (MSAs).
                </p>
              </div>

              <div className="utility-item fade-anim">
                <h3 className="text-2xl font-semibold mb-3">2. Intellectual Property</h3>
                <p className="text-[#81837d] leading-relaxed">
                  All demonstration brand assets, photography, editorial whitepapers, and interface code are protected under applicable copyright and commercial demonstration licenses.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
