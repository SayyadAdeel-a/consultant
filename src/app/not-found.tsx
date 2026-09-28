"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20">
        <section className="erroe-page-section w-full">
          <div className="w-layout-blockcontainer container w-container">
            <div className="utility-page-wrap text-center">
              <div className="utility-page-content max-w-xl mx-auto flex flex-col items-center">
                <div className="mb-8 max-w-sm w-full rounded-2xl overflow-hidden border border-[#cac7c1] bg-[#f6f2eb]">
                  <img
                    src="/assets/alderline/icons/404.jpg"
                    alt="404 - Page Not Found"
                    className="w-full object-cover"
                  />
                </div>
                <h1 className="section-title erroe-page-title title-anim text-3xl md:text-5xl font-semibold mb-4">
                  Sorry, This Page Couldn&apos;t Be Found
                </h1>
                <div className="erroe-page-para-wrap fade-anim mb-8">
                  <div className="text-regular erroe-page-para text-[#81837d] max-w-md mx-auto">
                    The page you&apos;re looking for may have moved, been removed, or never existed in the Alderline Environmental demonstration site.
                  </div>
                </div>
                <div className="erroe-page-btn-wrap fade-anim">
                  <Link href="/" className="button-link-box home-blog-button w-inline-block">
                    <div className="button-box">
                      <div className="button-text button-text-one">Back To Home</div>
                      <div className="button-text button-text-two">Back To Home</div>
                    </div>
                  </Link>
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
