"use client";

import React from "react";
import { approachCredibilityContent } from "@/lib/alderline-content";

export function TestimonialSection() {
  return (
    <section id="team" className="service-section">
      <div className="container">
        <div className="counter-wrapper">
          <div className="counter-heading">
            <h2 className="counter-heading-three fade-anim text-xs uppercase tracking-widest text-[#81837d] font-semibold">
              {approachCredibilityContent.eyebrow}
            </h2>
            <div className="counter-title-box">
              <h2 data-stagger="0.015" className="main-body-title title-anim">
                {approachCredibilityContent.heading}
              </h2>
            </div>
          </div>
          <div className="counter-wrap">
            <div className="counter-athour-wrap">
              <p className="counter-athour-short-details fade-anim text-base text-[#81837d] leading-relaxed">
                {approachCredibilityContent.description}
              </p>
              <div className="counter-athour mt-4">
                <div className="counter-athour-images rounded-xl overflow-hidden border border-[#cac7c1]">
                  <img
                    src={approachCredibilityContent.portrait}
                    loading="lazy"
                    alt="Illustrative Technical Advisor"
                    className="counter-athour-img object-cover"
                  />
                </div>
                <div className="counter-short-summary">
                  <div className="counter-athour-name font-semibold text-[#15190d]">
                    {approachCredibilityContent.representative.note}
                  </div>
                  <div className="counter-athour-text text-xs text-[#81837d]">
                    {approachCredibilityContent.representative.body}
                  </div>
                </div>
              </div>
            </div>

            {/* Qualitative Metric Cards */}
            <div className="counter-countent">
              <div
                id="w-node-_746adce8-7c48-1581-d435-737ba376c401-a376c3eb"
                className="counter-single-box fade-anim"
              >
                <div className="counter-number text-2xl font-bold tracking-wider text-[#15190d]">
                  {approachCredibilityContent.card1.tag}
                </div>
                <div className="counter-short-details fade-anim text-sm text-[#81837d]">
                  {approachCredibilityContent.card1.description}
                </div>
              </div>
              <div
                id="w-node-_746adce8-7c48-1581-d435-737ba376c406-a376c3eb"
                className="counter-single-box fade-anim"
              >
                <div className="counter-number text-2xl font-bold tracking-wider text-[#15190d]">
                  {approachCredibilityContent.card2.tag}
                </div>
                <div className="counter-short-details fade-anim text-sm text-[#81837d]">
                  {approachCredibilityContent.card2.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
