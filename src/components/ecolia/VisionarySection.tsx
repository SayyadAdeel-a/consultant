"use client";

import React from "react";
import { coreExpertiseContent } from "@/lib/alderline-content";

export function VisionarySection() {
  return (
    <section id="approach" className="your-visionary-section">
      <div className="container">
        <div className="your-visionary-wrapper">
          <div className="your-visionary-top-countent">
            <div
              id="w-node-_850c2663-3866-2352-3a04-ed92b6e9ef86-974d58c4"
              className="your-visionary-top-countent-button button-down"
            >
              <div className="your-visionary-top-countent-button-link">
                <div className="your-visionary-button">
                  <div className="your-visionary-top-countent-button-link-text one">
                    {coreExpertiseContent.eyebrow}
                  </div>
                  <div className="your-visionary-top-countent-button-link-text two">
                    {coreExpertiseContent.eyebrow}
                  </div>
                </div>
              </div>
            </div>
            <div className="your-visionary-para">
              <h2 data-stagger="0.015" className="main-body-title title-anim">
                {coreExpertiseContent.heading}
              </h2>
            </div>
          </div>
          <div className="your-visionary-down-countent">
            {coreExpertiseContent.cards.map((card, idx) => (
              <div
                key={idx}
                className={`your-visionary-down-single-item ${
                  idx === 0 ? "your-visionary-down-single-item-one" : ""
                } fade-anim`}
              >
                <div className="your-visionary-icon-box overflow-hidden rounded-xl bg-[#f6f2eb] flex items-center justify-center p-1">
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="w-10 h-10 object-contain"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                <div className="your-visionary-short-dateils">
                  <h3 className="your-visionary-short-title font-semibold text-xl mb-2">
                    {card.title}
                  </h3>
                  <p className="your-visionary-short-summary fade-anim text-[#81837d] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
