"use client";

import React from "react";
import Link from "next/link";
import { footerContent, navigationConfig } from "@/lib/alderline-content";

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-wrapper">
          <div className="footer-top-wrap">
            <div className="footer-left-single-box">
              <div className="footer-logo-box">
                <Link href="/" className="footer-logo-link w-inline-block w--current" aria-label="Alderline Environmental Home">
                  <img
                    src={navigationConfig.logoLight}
                    loading="lazy"
                    alt="Alderline Environmental"
                    className="footer-logo-img"
                    style={{ height: 42, width: "auto" }}
                  />
                </Link>
                <p className="footer-para fade-anim text-[#dfe0d4] mt-3">
                  {footerContent.tagline}
                </p>
                <p className="text-sm text-[#81837d] mt-2 max-w-sm">
                  {footerContent.supporting}
                </p>
              </div>
            </div>

            {/* Project Consultation CTA Box (Replaces non-functional newsletter) */}
            <div className="footer-form-wrapper" style={{ maxWidth: 380 }}>
              <div className="p-6 rounded-2xl border border-[#303820] bg-[#1a2012]">
                <h4
                  className="text-xs uppercase tracking-widest font-semibold mb-2"
                  style={{ color: "#dfe0d4" }}
                >
                  {footerContent.ctaBox.heading}
                </h4>
                <p
                  className="text-sm mb-4"
                  style={{ color: "#81837d" }}
                >
                  {footerContent.ctaBox.description}
                </p>
                <Link
                  href={footerContent.ctaBox.link}
                  className="button-link-box inline-block w-full text-center"
                >
                  <div className="button-box py-3 px-6 rounded-full bg-[#f6f2eb] text-[#15190d] font-medium text-sm hover:bg-white transition-colors">
                    {footerContent.ctaBox.buttonText}
                  </div>
                </Link>
              </div>
            </div>

            <div className="footer-right-single-box box-visible">
              <div className="footer-single-item visible-item">
                <h3 className="footer-heading-four">Navigation</h3>
                <ul role="list" className="footer-list-wrapper w-list-unstyled">
                  {footerContent.linksMain.map((link, idx) => (
                    <li key={idx} className="footer-list-item">
                      <Link href={link.href} className="footer-link-text">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-single-item visible-item">
                <h3 className="footer-heading-four">Information</h3>
                <ul role="list" className="footer-list-wrapper w-list-unstyled">
                  {footerContent.linksInfo.map((link, idx) => (
                    <li key={idx} className="footer-list-item">
                      <Link href={link.href} className="footer-link-text">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-down-wrap">
            <div className="footer-copy-right-text">
              {footerContent.copyright}
            </div>
            <div className="footer-text text-sm text-[#81837d]">
              Environmental Consulting Demonstration Portfolio
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
