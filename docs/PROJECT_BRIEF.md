# IntegraVity — Project Brief & Commercial Vision

## 1. Executive Summary

**IntegraVity** is a commercial-grade website template and bespoke Content Management System (CMS) engineered specifically for environmental consulting, ecological engineering, and natural resource management firms.

In the environmental consulting sector, digital credibility directly influences multi-million dollar regulatory permitting, site selection, and infrastructure contracts. Most consulting firms rely on outdated, text-heavy websites with poor responsive layouts and non-existent CMS capabilities. IntegraVity bridges this gap by pairing a high-end, editorial aesthetic (inspired by prestigious natural history publications and architecture portfolios) with a secure, single-tenant CMS that nontechnical business owners can operate with zero code modifications.

---

## 2. Business Objectives & Positioning

### 2.1 Primary Goals

1. **Showcase Scientific & Engineering Authority**: Convey deep technical competence in wetland science, soil mapping, coastal resilience, and environmental impact assessments.
2. **Drive High-Value Inquiries**: Convert visiting developers, energy companies, and government officials into qualified consultation inquiries through intuitive contact workflows.
3. **Turnkey Reusability**: Provide an extensible, single-tenant architecture where client-specific branding, services, and photography can be deployed within hours for paying consulting clients.
4. **Seamless Content Governance**: Allow firm partners and office managers to publish case studies, update personnel credentials, adjust service scopes, and review inbound RFPs without developer intervention.

### 2.2 Target Industries Served

- **Wetland Delineation & Permitting**: Section 404/401 Clean Water Act compliance, GIS mapping, vernal pool surveys.
- **Coastal & Ecological Engineering**: Shoreline stabilization, living shorelines, tidal marsh restoration, flood risk mitigation.
- **Environmental Due Diligence**: Phase I & II Environmental Site Assessments (ESAs) adhering to ASTM E1527-21, brownfield redevelopment.
- **Renewable Energy & Infrastructure**: Siting studies, NEPA compliance, transmission corridor environmental impact reviews.
- **Land-Use & Municipal Planning**: Watershed management plans, municipal open space planning, conservation easements.

---

## 3. Explicit Architecture Boundaries: What IntegraVity Is NOT

To maintain focus and commercial viability, the following capabilities are explicitly out of scope:

- **NOT a Multitenant SaaS**: There is no global user registry, no cross-tenant database isolation logic, and no shared database cluster. Each customer deployment is a self-contained instance with its own Supabase project.
- **NO Subscription Billing**: We do not integrate Stripe, LemonSqueezy, or recurring customer charge mechanisms.
- **NO Drag-and-Drop Page Builder**: We do not implement an unstructured, fragile visual builder (like Elementor or Webflow). Content is cleanly structured in relational database tables with strict validation schemas.
- **NO Self-Registration**: Public administrator signup is prohibited. Administrative accounts are created exclusively through controlled backend invitations or seed scripts.

---

## 4. Website Route Architecture

### 4.1 Public-Facing Routes

- **`/` (Homepage)**: The primary commercial showcase featuring:
  1. Header & Navigation with consultation CTA
  2. Immersive Hero with nature-inspired editorial typography
  3. Expertise & Credibility Metrics
  4. Core Environmental Consulting Services grid
  5. Target Industries supported
  6. Featured Case Study deep dive
  7. Approach & Working Methodology (Phased delivery)
  8. Leadership & Technical Team Credentials
  9. Frequently Asked Questions (Technical & Permitting)
  10. Consultation Request & Inbound Form
  11. Comprehensive Footer with legal disclaimers
- **`/services`**: Catalog of all published environmental capabilities.
- **`/services/[slug]`**: Dynamic, search-optimized deep dive pages for individual services (e.g., `/services/wetland-delineation`).
- **`/contact`**: Dedicated consultation request and RFP intake experience with anti-spam honeypot and category selection.

### 4.2 Administrative CMS Routes

- **`/admin/login`**: Secure administrator email/password sign-in with session management.
- **`/admin`**: Executive dashboard displaying inquiry volume, published service counts, and system status.
- **`/admin/content`**: Homepage section headings, subheadings, and visibility toggles.
- **`/admin/services`**: Service editor (titles, slugs, deliverables, regulatory frameworks, optional pricing).
- **`/admin/projects`**: Case study manager (client types, challenges, solutions, metrics, gallery photos).
- **`/admin/media`**: Persistent media library integrated with Supabase Storage.
- **`/admin/inquiries`**: Confidential customer inquiry pipeline with status tracking (new, reviewing, contacted, archived).
- **`/admin/settings`**: Global identity, company contact info, address, and social links.

---

## 5. Non-Technical Content Governance Requirements

The business owner or executive assistant must be able to perform the following without developer support:

1. **Update Company Branding**: Replace logo, update phone numbers, physical address, and social media handles.
2. **Publish New Case Studies**: Add project descriptions, photos, and outcomes as new projects conclude.
3. **Control Pricing Visibility**: Set optional price ranges or completely suppress pricing notes for bespoke consulting scopes.
4. **Manage Inbound Inquiries**: Review submissions safely inside the dashboard with full privacy protection.
