// Server Component Layout — NO "use client" directive.
//
// WHY THIS MATTERS:
// When this layout was a Client Component ("use client"), Next.js App Router
// would skip the server-side CSS preload hint injection for child pages, causing
// the Tailwind stylesheet to load asynchronously via JavaScript instead of being
// preloaded in the <head>. This created a race condition where:
//   1. Browser renders the HTML structure
//   2. JS bundle loads
//   3. CSS is injected dynamically by React
// Result: intermittent FOUC (Flash of Unstyled Content) on hard refreshes and
// route navigations, appearing as completely "plain HTML" with no styling.
//
// FIX: The layout is now a Server Component. All interactive client state
// (mobile sidebar toggle) is isolated in MobileSidebarWrapper.tsx ("use client").
// The CSS preload <link> tags are now always present in the server-rendered <head>.

import { MobileSidebarWrapper } from "@/components/layouts/MobileSidebarWrapper";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <MobileSidebarWrapper>{children}</MobileSidebarWrapper>;
}
