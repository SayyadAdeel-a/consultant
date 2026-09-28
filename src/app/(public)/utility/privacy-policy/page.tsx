"use client";

import React from "react";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        <section className="breadcrumb-section utility-breadcrumb-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="utility-breadcrumb-content-wrap">
              <div className="utility-breadcrumb-title-wrap">
                <h1 className="breadcrumb-tiitle text-center title-anim">Privacy Policy</h1>
              </div>
              <p className="text-regular utility-breadcrumb-para fade-anim text-[#81837d] max-w-xl mx-auto text-center">
                Alderline Environmental is committed to responsible data handling. This demonstration framework outlines privacy expectations for prospective client inquiries.
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
                  This document serves as a placeholder privacy architecture for the Alderline Environmental demonstration site. Full legal disclosures will be customized by client counsel prior to production launch.
                </p>
              </div>

              <div className="utility-item fade-anim">
                <h3 className="text-2xl font-semibold mb-3">1. Information We Collect</h3>
                <p className="text-[#81837d] leading-relaxed">
                  When project teams submit consultation requests, we collect standard professional contact details including full name, organizational affiliation, email address, and prospective project descriptions.
                </p>
              </div>

              <div className="utility-item fade-anim">
                <h3 className="text-2xl font-semibold mb-3">2. Project Confidentiality</h3>
                <p className="text-[#81837d] leading-relaxed">
                  All preliminary project descriptions, geographical coordinates, and site documentation submitted through preliminary review inquiries are treated as confidential commercial information.
                </p>
              </div>

              <div className="utility-item fade-anim">
                <h3 className="text-2xl font-semibold mb-3">3. Data Retention &amp; Security</h3>
                <p className="text-[#81837d] leading-relaxed">
                  Inquiry records are securely stored and accessed exclusively by authorized environmental planning personnel for the purpose of scoping technical proposals.
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
