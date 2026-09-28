"use client";

import React, { useState } from "react";
import Link from "next/link";
import { navigationConfig } from "@/lib/alderline-content";

export function Navbar({ cta }: { cta?: { label: string; href: string } } = {}) {
  const [pagesOpen, setPagesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ctaConfig = cta || navigationConfig.cta;

  return (
    <header className="header-section">
      <div className="navbar w-nav" role="banner">
        <div className="w-layout-blockcontainer container w-container">
          <div className="nav-content-wrap">
            <Link href="/" className="nav-logo-wrap w-nav-brand w--current" aria-label="Alderline Environmental Home">
              <img
                loading="eager"
                src={navigationConfig.logoDark}
                alt="Alderline Environmental"
                className="nav-logo"
                style={{ height: 40, width: "auto" }}
              />
            </Link>
            <nav
              role="navigation"
              className={`nav-menu-with-btn w-nav-menu ${
                mobileMenuOpen ? "w--nav-menu-open" : ""
              }`}
              style={{
                display: mobileMenuOpen ? "block" : undefined,
              }}
            >
              <div className="nav-menu-with-btn-inner">
                <div className="nav-menu">
                  <Link href="/" className="nav-link-box w-inline-block">
                    <div className="nav-menu-text-one">Home</div>
                    <div className="nav-menu-text-two">Home</div>
                  </Link>

                  <Link href="/about" className="nav-link-box w-inline-block">
                    <div className="nav-menu-text-one">About</div>
                    <div className="nav-menu-text-two">About</div>
                  </Link>

                  <Link href="/services" className="nav-link-box w-inline-block">
                    <div className="nav-menu-text-one">Services</div>
                    <div className="nav-menu-text-two">Services</div>
                  </Link>

                  <div
                    className={`nav-dropdown w-dropdown ${pagesOpen ? "w--open" : ""}`}
                    onMouseEnter={() => setPagesOpen(true)}
                    onMouseLeave={() => setPagesOpen(false)}
                    style={{ maxWidth: 1680, position: "relative" }}
                  >
                    <div
                      className={`dropdown-toggle-2 nav-link nav-dropdown-toggle w-dropdown-toggle ${
                        pagesOpen ? "w--open" : ""
                      }`}
                      onClick={() => setPagesOpen(!pagesOpen)}
                      role="button"
                      tabIndex={0}
                      aria-haspopup="menu"
                      aria-expanded={pagesOpen}
                    >
                      <div className="pages-one">{navigationConfig.dropdown.label}</div>
                      <div className="pages-two">{navigationConfig.dropdown.label}</div>
                      <div className="nav-dropdown-icon w-icon-dropdown-toggle"></div>
                    </div>
                    {pagesOpen && (
                      <nav
                        className="nav-dropdown-content w-dropdown-list w--open"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          backgroundColor: "#f6f2eb",
                          border: "1px solid #cac7c1",
                          borderRadius: 16,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                          zIndex: 100,
                          minWidth: 540,
                        }}
                      >
                        <div className="nav-dropdown-link-wrapper">
                          {navigationConfig.dropdown.columns.map((col, idx) => (
                            <div key={idx} className="nav-dropdown-list-menu-with-title">
                              <div className="nav-dropdown-list-title">{col.title}</div>
                              <div className="nav-dropdown-list-menu">
                                {col.items.map((item, itemIdx) => (
                                  <Link
                                    key={itemIdx}
                                    href={item.href}
                                    className="nav-dropdown-list-menu-item w-dropdown-link"
                                    onClick={() => setPagesOpen(false)}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </nav>
                    )}
                  </div>

                  <Link href="/blog" className="nav-link-box w-inline-block">
                    <div className="nav-menu-text-one">Insights</div>
                    <div className="nav-menu-text-two">Insights</div>
                  </Link>

                  <Link href="/contact" className="nav-link-box w-inline-block">
                    <div className="nav-menu-text-one">Contact</div>
                    <div className="nav-menu-text-two">Contact</div>
                  </Link>
                </div>
                <div className="phone-menu-button">
                  <Link
                    href={ctaConfig.href}
                    aria-label={ctaConfig.label}
                    className="button-link-box home-blog-button w-inline-block"
                  >
                    <div className="button-box">
                      <div className="button-text button-text-one">{ctaConfig.label}</div>
                      <div className="button-text button-text-two">{ctaConfig.label}</div>
                    </div>
                  </Link>
                </div>
              </div>
            </nav>
            <div className="nav-btn-inner">
              <div className="main-button-wrap">
                <Link
                  href={ctaConfig.href}
                  aria-label={ctaConfig.label}
                  className="button-link-box home-blog-button w-inline-block"
                >
                  <div className="button-box">
                    <div className="button-text button-text-one">{ctaConfig.label}</div>
                    <div className="button-text button-text-two">{ctaConfig.label}</div>
                  </div>
                </Link>
              </div>
            </div>
            <div
              id="w-node-_776bb87e-ee06-637d-a45f-1a817d2ab980-7d2ab933"
              className="hamburger-trigger w-nav-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              role="button"
              tabIndex={0}
              aria-label="menu"
            >
              <div className="hamburger-lottie-animation">
                <svg
                  viewBox="0 0 32 32"
                  width="32"
                  height="32"
                  style={{ width: "100%", height: "100%" }}
                >
                  <line
                    x1="6"
                    y1="10"
                    x2="26"
                    y2="10"
                    stroke="#15190d"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6"
                    y1="16"
                    x2="26"
                    y2="16"
                    stroke="#15190d"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6"
                    y1="22"
                    x2="26"
                    y2="22"
                    stroke="#15190d"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
