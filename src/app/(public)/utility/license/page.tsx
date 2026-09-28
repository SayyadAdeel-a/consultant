"use client";

import React from "react";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        <section className="breadcrumb-section utility-breadcrumb-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="utility-breadcrumb-content-wrap">
              <div className="utility-breadcrumb-title-wrap">
                <h1 className="breadcrumb-tiitle text-center title-anim">Media Licensing &amp; Attribution</h1>
              </div>
              <p className="text-regular utility-breadcrumb-para fade-anim text-[#81837d] max-w-xl mx-auto text-center">
                Visual assets, photography, and typographical systems utilized across the Alderline Environmental demonstration platform.
              </p>
            </div>
          </div>
        </section>

        <section className="utility-section py-16">
          <div className="w-layout-blockcontainer container w-container max-w-4xl">
            <div className="utility-content-wrap">
              <div className="license-content-wrap grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="hp_license_box fade-anim border border-[#cac7c1] rounded-2xl p-8 bg-[#f6f2eb]">
                  <h2 className="xr_title text-2xl font-semibold mb-6">Generated Imagery &amp; Media</h2>
                  <ul role="list" className="hp_license_list_box space-y-6">
                    <li className="hp_license_list">
                      <p className="hp_license_list_content font-medium">Original AI-Synthesized Photography</p>
                      <p className="hp_license_link_content text-[#81837d] text-sm mt-1">
                        43 custom environmental consulting and field assessment images (IMG-001 through IMG-043) and ambient 4K video assets generated exclusively for Alderline Environmental demonstration use.
                      </p>
                    </li>
                    <li className="hp_license_list">
                      <p className="hp_license_list_content font-medium">Vector Icons</p>
                      <p className="hp_license_link_content text-[#81837d] text-sm mt-1">
                        Custom inline SVG vector graphics representing wetland delineation, site assessment shields, and regulatory documentation seals.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="hp_license_box fade-anim border border-[#cac7c1] rounded-2xl p-8 bg-[#f6f2eb]">
                  <h2 className="xr_title text-2xl font-semibold mb-6">Typography &amp; Technology</h2>
                  <ul role="list" className="hp_license_list_box space-y-6">
                    <li className="hp_license_list">
                      <p className="hp_license_list_content font-medium">Inter Variable Font</p>
                      <p className="hp_license_link_content text-[#81837d] text-sm mt-1">
                        Loaded via <code>next/font/google</code> under the SIL Open Font License (OFL 1.1). Permitted for personal and commercial usage.
                      </p>
                    </li>
                    <li className="hp_license_list">
                      <p className="hp_license_list_content font-medium">GSAP Animation Library</p>
                      <p className="hp_license_link_content text-[#81837d] text-sm mt-1">
                        GreenSock Animation Platform (v3.12) utilized for smooth scroll-triggered physics and editorial text stagger reveals.
                      </p>
                    </li>
                  </ul>
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
