import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";
import { allBlogPosts } from "@/lib/blog-data";

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Filter 2 latest related articles for recommendations
  const latestArticles = allBlogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        {/* S25: Article Meta Header & Content */}
        <section className="blog-details-section">
          <div className="container">
            <div className="blog-details-wrapper">
              <div className="blog-details-time-wrap fade-anim flex items-center gap-4 mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#15190d] bg-[#dfe0d4] px-3.5 py-1.5 rounded-full">
                  {post.category}
                </span>
                <div className="text-xs text-[#81837d] font-medium">
                  {post.date}
                </div>
                <div className="text-xs text-[#81837d] font-medium">
                  {post.readTime}
                </div>
              </div>

              <div className="blog-details-hrading mb-8">
                <h1 className="breadcrumb-tiitle blog-details-title title-anim font-bold text-3xl md:text-5xl lg:text-6xl text-[#15190d] leading-tight">
                  {post.title}
                </h1>
              </div>

              {/* S26: Article Hero Banner */}
              <div className="blog-details-images-one fade-anim rounded-2xl overflow-hidden border border-[#cac7c1] mb-12 shadow-sm">
                <Image
                  src={post.bannerImage}
                  loading="lazy"
                  alt={post.title}
                  width={1200}
                  height={675}
                  className="blog-details-img-one w-full aspect-[16/9] object-cover"
                />
              </div>

              {/* S27: Article Editorial Body */}
              <div className="blog-details-rich-text w-richtext max-w-3xl mx-auto space-y-8">
                {post.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-lg text-[#303820] leading-relaxed">
                    {p}
                  </p>
                ))}

                {post.sections &&
                  post.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-4 pt-4">
                      <h3 className="text-2xl font-semibold text-[#15190d] tracking-tight">
                        {sec.heading}
                      </h3>
                      <p className="text-base text-[#81837d] leading-relaxed">
                        {sec.body}
                      </p>
                    </div>
                  ))}

                {/* S27: Inline Article Figure */}
                {post.inlineImage && (
                  <figure className="w-richtext-align-fullwidth w-richtext-figure-type-image my-10 rounded-2xl overflow-hidden border border-[#cac7c1]">
                    <div>
                      <Image
                        loading="lazy"
                        alt="Field Documentation & Ecological Context"
                        src={post.inlineImage}
                        width={900}
                        height={500}
                        className="w-full object-cover max-h-[500px]"
                      />
                    </div>
                    <figcaption className="text-xs text-[#81837d] p-3 text-center bg-[#f6f2eb]">
                      Field-informed environmental review connects baseline findings to defensible project milestones.
                    </figcaption>
                  </figure>
                )}

                <div className="p-6 rounded-2xl border border-[#cac7c1] bg-[#dfe0d4] mt-12 text-sm text-[#15190d]">
                  <p className="font-semibold mb-1">Demonstration Notice</p>
                  <p className="text-xs text-[#81837d]">
                    This article is illustrative educational content created for the Alderline Environmental demonstration platform, presenting practical frameworks for site planning and regulatory review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S28: Recommended Latest Articles */}
        <section className="blog-details-latest-articles-section py-20 border-t border-[#cac7c1] mt-20">
          <div className="container">
            <div className="blog-details-latest-articles-wrapper">
              <div className="blog-details-latest-articles-heading mb-10">
                <h2 className="blog-details-latest-articles-title title-anim text-3xl font-semibold">
                  Latest Articles
                </h2>
              </div>
              <div className="letest-blog-collection">
                <div className="blog-details-latest-articles-cl-wrapper w-dyn-list">
                  <div role="list" className="blog-details-latest-articles-wrap w-dyn-items grid grid-cols-1 md:grid-cols-2 gap-8">
                    {latestArticles.map((article) => (
                      <div key={article.slug} role="listitem" className="fade-anim w-dyn-item">
                        <div className="blog-details-latest-articles-left-box border border-[#cac7c1] rounded-2xl p-6 bg-[#f6f2eb] hover:shadow-md transition-shadow">
                          <Link
                            href={`/blog/${article.slug}`}
                            className="blog-details-latest-articles-images w-inline-block overflow-hidden rounded-xl mb-4"
                          >
                            <Image
                              loading="lazy"
                              src={article.image}
                              alt={article.title}
                              width={800}
                              height={500}
                              className="blog-details-latest-articles-img w-full aspect-[16/10] object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </Link>
                          <div className="blog-details-latest-articles-item-body">
                            <div className="blog-details-latest-articles-date-wrap flex items-center justify-between mb-3">
                              <span className="text-xs uppercase tracking-wider font-semibold text-[#15190d] bg-[#dfe0d4] px-3 py-1 rounded-full">
                                {article.category}
                              </span>
                              <div className="text-xs text-[#81837d]">
                                {article.readTime}
                              </div>
                            </div>
                            <div className="blog-details-latest-articles-short-summary">
                              <Link
                                href={`/blog/${article.slug}`}
                                className="blog-details-latest-articles-short-summary-link w-inline-block"
                              >
                                <h3
                                  data-stagger="0.02"
                                  data-y="10"
                                  className="blog-details-latest-articles-title-three title-anim font-semibold text-xl mb-2 hover:text-[#303820] transition-colors"
                                >
                                  {article.title}
                                </h3>
                              </Link>
                              <p className="blog-details-latest-articles-para fade-anim text-sm text-[#81837d] leading-relaxed">
                                {article.summary}
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
