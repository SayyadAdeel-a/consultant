"use client";

import React from "react";
import { heroContent } from "@/lib/alderline-content";

export function HeroSection({ headline }: { headline?: string } = {}) {
  return (
    <section id="hero" className="hero-area-section">
      <div className="container">
        <div className="hero-area-wrapper">
          <div className="hero-area-heading">
            <h1 className="golobal-title title-anim">
              {headline || heroContent.heading}
            </h1>
            <p className="hero-area-para fade-anim">
              {heroContent.description}
            </p>
          </div>
          <div className="hero-area-wrap">
            <div className="hero-images">
              <img
                className="hero-img"
                src={heroContent.fallbackImage}
                alt="Alderline Environmental Landscape"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="hero-img-overlay"></div>
              <div className="home-hero-video w-background-video w-background-video-atom">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={heroContent.posterImage}
                  style={{
                    backgroundImage: `url("${heroContent.posterImage}")`,
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <source
                    src={heroContent.videoMp4}
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
            <div className="hero-absolute-box box-visible">
              {heroContent.pills.map((pill, i) => (
                <div key={i} className="hero-text-single-box visible-item">
                  <div className="hero-text-box">
                    <div className="hero-text hero-text-one">{pill}</div>
                    <div className="hero-text hero-text-two">{pill}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
