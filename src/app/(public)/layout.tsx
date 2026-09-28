/**
 * Public site layout boundary.
 * The admin area lives isolated outside this layout.
 *
 * Each Alderline Environmental public page renders its approved
 * Navbar, dynamic section hierarchy, and Footer components directly.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
