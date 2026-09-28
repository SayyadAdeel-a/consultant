"use client";

import React from "react";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        <section className="breadcrumb-section utility-breadcrumb-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="utility-breadcrumb-content-wrap">
              <div className="utility-breadcrumb-title-wrap">
                <h1 className="breadcrumb-tiitle text-center title-anim">Changelog</h1>
              </div>
              <p className="text-regular utility-breadcrumb-para fade-anim">
                Demonstration platform version history, field service catalog revisions, and technical updates for Alderline Environmental.
              </p>
            </div>
          </div>
        </section>

        <section className="utility-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="changelog-content-wrap fade-anim border border-[#cac7c1] rounded-2xl p-8 bg-[#f6f2eb]">
              <div className="changelog-verison-wrap mb-4">
                <h2 className="changelog-version text-2xl font-semibold">Ver 1.0</h2>
              </div>
              <p className="text-learge text-[#81837d]">Initial Release — Alderline Environmental demonstration platform published with comprehensive practice area guides, baseline environmental insights, and interactive compliance workflow showcases.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
