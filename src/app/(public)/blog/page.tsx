"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";
import { allBlogPosts } from "@/lib/blog-data";

const categories = [
  "All Articles",
  "Site Assessment",
  "Wetlands",
  "Permitting",
  "Restoration",
  "Water Resources",
] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Articles");

  const filteredPosts =
    selectedCategory === "All Articles"
      ? allBlogPosts
      : allBlogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        {/* S22: Blog Breadcrumb Section */}
        <section className="breadcrumb-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="blog-breadcrumb-content-wrap">
              <div className="blog-breadcrumb-title-wrap">
                <h1 className="breadcrumb-tiitle title-anim">
                  Insights From The Environmental Project Landscape
                </h1>
              </div>
              <p
                id="w-node-_3e9f0368-20f7-4987-24cc-3fbc85becda2-5d3e7783"
                className="text-regular blog-breadcrumb-para fade-anim text-[#81837d]"
              >
                Articles, perspectives, and practical guidance on site understanding, environmental planning, permitting, and restoration thinking.
              </p>
            </div>
          </div>
        </section>

        {/* S23 & S24: Category Tabs & 10-Item Article Archive */}
        <section className="blog-filter-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="blog-filter-content-wrap">
              <div className="blog-tab fade-anim w-tabs">
                <div className="blog-tab-menu w-tab-menu flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`blog-tab-btn w-inline-block w-tab-link cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#15190d] text-[#f6f2eb]"
                          : "bg-transparent text-[#81837d] hover:text-[#15190d] border border-[#cac7c1]"
                      }`}
                    >
                      <div>{cat}</div>
                    </button>
                  ))}
                </div>

                <div className="blog-tabs-content w-tab-content mt-8">
                  <div className="blog-tab-pane w-tab-pane w--tab-active">
                    <div className="blog-details-latest-articles-cl-wrapper w-dyn-list">
                      <div role="list" className="blog-details-latest-articles-wrap w-dyn-items grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredPosts.map((post) => (
                          <div key={post.slug} role="listitem" className="fade-anim w-dyn-item">
                            <div className="blog-details-latest-articles-left-box border border-[#cac7c1] rounded-2xl overflow-hidden bg-[#f6f2eb] p-6 hover:shadow-md transition-shadow">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="blog-details-latest-articles-images w-inline-block overflow-hidden rounded-xl mb-4"
                              >
                                <Image
                                  loading="lazy"
                                  src={post.image}
                                  alt={post.title}
                                  width={800}
                                  height={500}
                                  className="blog-details-latest-articles-img w-full aspect-[16/10] object-cover transition-transform duration-500 hover:scale-105"
                                />
                              </Link>
                              <div className="blog-details-latest-articles-item-body">
                                <div className="blog-details-latest-articles-date-wrap flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs uppercase tracking-wider font-semibold text-[#15190d] bg-[#dfe0d4] px-3 py-1 rounded-full">
                                      {post.category}
                                    </span>
                                  </div>
                                  <div className="text-xs text-[#81837d]">
                                    {post.readTime}
                                  </div>
                                </div>
                                <div className="blog-details-latest-articles-short-summary">
                                  <Link
                                    href={`/blog/${post.slug}`}
                                    className="blog-details-latest-articles-short-summary-link w-inline-block"
                                  >
                                    <h3
                                      data-stagger="0.02"
                                      data-y="10"
                                      className="blog-details-latest-articles-title-three title-anim font-semibold text-xl mb-2 hover:text-[#303820] transition-colors"
                                    >
                                      {post.title}
                                    </h3>
                                  </Link>
                                  <p className="blog-details-latest-articles-para fade-anim text-sm text-[#81837d] leading-relaxed">
                                    {post.summary}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
