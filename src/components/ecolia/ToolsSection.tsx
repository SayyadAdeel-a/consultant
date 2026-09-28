"use client";

import React from "react";
import Link from "next/link";
import { serviceHighlightsContent } from "@/lib/alderline-content";

export function ToolsSection() {
  const { card1, card2, card3, card4 } = serviceHighlightsContent.cards;

  return (
    <section id="services" className="tools-section">
      <div className="container">
        <div className="tools-wrapper">
          <div className="tools-heading">
            <div className="tools-title-box">
              <h2 data-stagger="0.015" className="main-body-title title-anim">
                {serviceHighlightsContent.heading}
              </h2>
            </div>
            <p className="tools-para fade-anim">
              {serviceHighlightsContent.intro}
            </p>
          </div>

          <div className="tools-wrap">
            {/* Left Column: Card 1 (Image) + Card 2 (Text) */}
            <div className="tools-countent-left">
              <div className="tools-images-box">
                <div className="tools-images fade-anim">
                  <img
                    src={card1.image}
                    loading="lazy"
                    alt={card1.title}
                    className="tools-img"
                  />
                  <div className="tools-img-overlay"></div>
                  <div className="hero-img-overlay"></div>
                </div>
                <div className="tools-details fade-anim">
                  <h3 className="tools-title-three">{card1.title}</h3>
                  <p className="tools-short-summary fade-anim">
                    {card1.description}
                  </p>
                </div>
              </div>

              <div className="tools-details-box fade-anim">
                <h3 className="tools-title-three tools-title-three-black">
                  {card2.title}
                </h3>
                <p className="tools-short-summary tools-text-color fade-anim">
                  {card2.description}
                </p>
                <div className="tools-button">
                  <Link href={card2.link || "/services"} className="button-link-box home-blog-button w-inline-block">
                    <div className="button-box">
                      <div className="button-text button-text-one">{card2.buttonText}</div>
                      <div className="button-text button-text-two">{card2.buttonText}</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Card 3 (Image) + Card 4 (Text) */}
            <div className="tools-countent-left tools-countent-right">
              <div className="tools-images-box">
                <div className="tools-images fade-anim">
                  <img
                    src={card3.image}
                    loading="lazy"
                    alt={card3.title}
                    className="tools-img"
                  />
                  <div className="tools-img-overlay"></div>
                  <div className="hero-img-overlay"></div>
                </div>
                <div className="tools-details fade-anim">
                  <h3 className="tools-title-three">{card3.title}</h3>
                  <p className="tools-short-summary fade-anim">
                    {card3.description}
                  </p>
                </div>
              </div>

              <div className="tools-details-box fade-anim">
                <h3 className="tools-title-three tools-title-three-black">
                  {card4.title}
                </h3>
                <p className="tools-short-summary tools-text-color fade-anim">
                  {card4.description}
                </p>
                <div className="tools-button">
                  <Link href={card4.link || "/services"} className="button-link-box home-blog-button w-inline-block">
                    <div className="button-box">
                      <div className="button-text button-text-one">{card4.buttonText}</div>
                      <div className="button-text button-text-two">{card4.buttonText}</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
