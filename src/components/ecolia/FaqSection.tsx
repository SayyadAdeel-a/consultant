"use client";

import React, { useState } from "react";
import { faqContent } from "@/lib/alderline-content";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="faq-wrapper">
          <div className="faq-heading">
            <h2 className="faq-title title-anim">{faqContent.heading}</h2>
            <p className="faq-para fade-anim">
              {faqContent.description}
            </p>
          </div>
          <div className="faq-wrap">
            <div className="faq-accordion-wrap">
              {faqContent.items.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`accordion-item fade-anim ${
                      idx === faqContent.items.length - 1 ? "faq-border-buttom-none" : ""
                    }`}
                  >
                    <div
                      className="accordion-header"
                      onClick={() => toggle(idx)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="accordion-heading body-text-20">{faq.q}</div>
                      <div className="accordion-icon flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          stroke="#15190d"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          className="transition-transform duration-300"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="accordion-content">
                        <p className="faq-ans text-[#81837d] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
