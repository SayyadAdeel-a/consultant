import { FadeIn, SlideUp } from "@/components/animations";

/**
 * Leadership and technical leads (illustrative demo personas — the footer
 * disclaimer covers their demonstration nature). Each profile carries the
 * credential code required by docs/TASKS.md (PWS, PE, CPSS, CEP) plus an
 * agency background summary.
 */
const team = [
  {
    initials: "EM",
    name: "Dr. Elena Marsh",
    role: "Principal Wetland Scientist",
    credentials: ["PWS"],
    background:
      "Former senior delineation reviewer for the U.S. Army Corps of Engineers, New England District. Leads jurisdictional determinations and §404 permit strategy along the Atlantic coast.",
  },
  {
    initials: "DO",
    name: "Daniel Okafor",
    role: "Coastal & Hydraulic Engineer",
    credentials: ["PE"],
    background:
      "Previously directed coastal infrastructure permitting for a state DOT; 15 years designing living-shoreline and storm-surge adaptations for working waterfronts.",
  },
  {
    initials: "PR",
    name: "Priya Raghunathan",
    role: "Senior Soil Scientist",
    credentials: ["CPSS"],
    background:
      "Former state soil scientist with the USDA Natural Resources Conservation Service. Maps hydric soil units and leads Phase II subsurface investigations.",
  },
  {
    initials: "TB",
    name: "Thomas Beaulieu",
    role: "Environmental Planner",
    credentials: ["CEP"],
    background:
      "Ex-environmental review manager at a regional planning commission; runs NEPA compliance, public scoping, and grant-ready documentation for municipal clients.",
  },
];

/**
 * Team credentials section (docs/TASKS.md Task 3.4).
 *
 * White editorial cards on the muted surface: initials monogram, name,
 * role, credential chips (Sage hairline pills), and an agency background
 * summary. Anchors the homepage `#team` id.
 *
 * Server component; reveals run through the shared animation wrappers.
 */
export function TeamSection() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="border-border bg-muted border-b"
    >
      <div className="container-editorial py-16 md:py-20 lg:py-24">
        <FadeIn>
          <p className="text-muted-foreground text-eyebrow">Our team</p>
          <h2 id="team-heading" className="text-display-lg mt-3 max-w-2xl">
            Certified scientists and engineers
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
            Principal-led teams with agency review experience on the other side
            of the table.
          </p>
        </FadeIn>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {team.map((member, index) => (
            <li key={member.name}>
              <SlideUp className="h-full" delay={index * 0.06}>
                <article className="border-border bg-card flex h-full flex-col rounded-xl border p-6">
                  <div
                    aria-hidden="true"
                    className="bg-brand-forest text-brand-ivory font-heading flex size-12 items-center justify-center rounded-full text-base font-semibold"
                  >
                    {member.initials}
                  </div>
                  <h3 className="font-heading mt-5 text-lg font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {member.role}
                  </p>
                  <ul
                    aria-label={`Credentials of ${member.name}`}
                    className="mt-3 flex flex-wrap gap-1.5"
                  >
                    {member.credentials.map((credential) => (
                      <li
                        key={credential}
                        className="border-brand-sage text-brand-forest rounded-full border px-2.5 py-0.5 text-xs font-medium"
                      >
                        {credential}
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                    {member.background}
                  </p>
                </article>
              </SlideUp>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
