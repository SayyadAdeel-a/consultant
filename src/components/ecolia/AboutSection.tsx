"use client";

import React from "react";
import { aboutIntroContent } from "@/lib/alderline-content";

export function AboutSection() {
  return (
    <section id="about" className="home-about-section">
      <div className="container">
        <div className="home-about-wrapper">
          <div className="home-about-columns-border"></div>
          <div id="w-node-c961eb5f-e739-67dc-279a-d6e892cc6ecb-974d58c4" className="home-about-dateils">
            <h2 data-stagger="0.015" className="main-body-title title-anim">
              {aboutIntroContent.heading}
            </h2>
            <div className="home-about-summary fade-anim">
              {aboutIntroContent.description}
            </div>
          </div>
          <div id="w-node-_84a71964-d4ab-0d18-2113-5c5b042e06f0-974d58c4" className="home-about-images-box fade-anim">
            <div className="home-about-images">
              <img
                src={aboutIntroContent.image}
                loading="lazy"
                alt="Environmental Field Review"
                className="home-about-img"
              />
              <div className="hero-img-overlay"></div>
            </div>

            {/* Field-to-Permit Supporting Card */}
            <div className="home-about-athour-wrap p-5 rounded-2xl bg-[#f6f2eb] border border-[#cac7c1] shadow-sm max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="home-about-athour-images">
                  {aboutIntroContent.avatars.map((avatar, idx) => (
                    <div key={idx} className={`home-about-athour-imges ${idx === 0 ? "home-about-athour-img-one" : ""}`}>
                      <img
                        src={avatar}
                        loading="lazy"
                        alt="Demonstration team avatar"
                        className="home-about-athour-img"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#81837d]">
                  {aboutIntroContent.illustrativeNote}
                </span>
              </div>
              <div className="home-about-athour-short-daleils">
                <div className="text-xs font-bold uppercase tracking-wider text-[#15190d] mb-1">
                  {aboutIntroContent.supportingCard.tag}
                </div>
                <p className="text-xs text-[#81837d] leading-relaxed">
                  {aboutIntroContent.supportingCard.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
