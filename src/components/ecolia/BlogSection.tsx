"use client";

import React from "react";
import Link from "next/link";
import { homepageInsightsContent } from "@/lib/alderline-content";

export function BlogSection() {
  return (
    <section id="projects" className="home-blog-section">
      <div className="container">
        <div className="home-blog-wrapper">
          <div id="w-node-_24bb6c30-98d0-eed2-c654-242b4808fc05-974d58c4" className="home-blog-heading last">
            <h2 data-stagger="0.015" className="main-body-title title-anim">
              {homepageInsightsContent.heading}
            </h2>
            <div className="home-blog-button fade-anim">
              <Link href="/blog" className="button-link-box home-blog-button w-inline-block">
                <div className="button-box">
                  <div className="button-text button-text-one">{homepageInsightsContent.buttonText}</div>
                  <div className="button-text button-text-two">{homepageInsightsContent.buttonText}</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="home-blog-list-wrapper w-dyn-list">
            <div role="list" className="home-blog-countent-wrap w-dyn-items">
              {homepageInsightsContent.articles.map((item, idx) => (
                <div key={idx} role="listitem" className="home-blog-cl-item fade-anim w-dyn-item">
                  <div className="home-blog-single-item">
                    <Link href={`/blog/${item.slug}`} className="home-blog-images w-inline-block">
                      <img
                        src={item.image}
                        loading="lazy"
                        alt={item.title}
                        className="home-blog-img"
                      />
                      <div className="hero-img-overlay"></div>
                    </Link>
                    <div className="home-blog-short-details">
                      <div className="home-blog-date-box">
                        <img
                          src="/assets/alderline/icons/calendar.jpg"
                          loading="lazy"
                          alt="Calendar icon"
                          className="home-blog-calendar-img rounded"
                          style={{ width: 16, height: 16, mixBlendMode: "multiply" }}
                        />
                        <div className="home-blog-calendar-text">{item.date}</div>
                      </div>
                      <Link href={`/blog/${item.slug}`} className="home-blog-heading-three w-inline-block">
                        <h3 className="home-blog-title-three">{item.title}</h3>
                      </Link>
                    </div>
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
