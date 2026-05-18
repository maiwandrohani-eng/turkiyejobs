"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";

const links = {
  user: [{ href: "/dashboard/user", label: "Overview" }],
  organization: [{ href: "/dashboard/organization", label: "Overview" }],
  admin: [{ href: "/dashboard/admin", label: "Overview" }],
} as const;

const guestNav = [
  { href: "/dashboard/user", label: "Applicant workspace" },
  { href: "/dashboard/organization", label: "Organization workspace" },
  { href: "/dashboard/admin", label: "Admin workspace" },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout, hydrated, notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead } =
    useTurkiyeJobs();
  const [notifOpen, setNotifOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const role = session?.role;
  const nav = !session
    ? [...guestNav]
    : role === "admin"
      ? [...links.admin]
      : role === "organization"
        ? [...links.organization]
        : [...links.user];

  useEffect(() => {
    if (!hydrated || !session) return;
    if (pathname.startsWith("/dashboard/user") && session.role !== "individual") {
      router.replace(
        session.role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/organization",
      );
    } else if (
      pathname.startsWith("/dashboard/organization") &&
      session.role !== "organization"
    ) {
      router.replace(
        session.role === "admin" ? "/dashboard/admin" : "/dashboard/user",
      );
    } else if (
      pathname.startsWith("/dashboard/admin") &&
      session.role !== "admin"
    ) {
      router.replace(
        session.role === "organization"
          ? "/dashboard/organization"
          : "/dashboard/user",
      );
    }
  }, [hydrated, session, pathname, router]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [notifications],
  );

  return (
    <div className="min-h-[70vh] bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:py-10">
        <aside className="h-fit w-full shrink-0 rounded-2xl border border-brand-border bg-white p-4 shadow-sm md:w-56">
          <div className="flex items-center justify-between gap-2 px-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Workspace
            </p>
            {hydrated && session ? (
              <div className="relative" ref={panelRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-lg border border-brand-border p-1.5 text-brand-navy hover:bg-brand-muted"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotificationCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-navy">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  ) : null}
                </button>
                {notifOpen ? (
                  <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-brand-border bg-white py-2 shadow-lg">
                    <div className="flex items-center justify-between border-b border-brand-border px-3 pb-2">
                      <span className="text-xs font-bold text-brand-navy">
                        Notifications
                      </span>
                      <button
                        type="button"
                        className="text-xs font-semibold text-brand-gold hover:underline"
                        onClick={() => {
                          markAllNotificationsRead();
                          setNotifOpen(false);
                        }}
                      >
                        Mark all read
                      </button>
                    </div>
                    <ul className="max-h-72 overflow-y-auto text-sm">
                      {sortedNotifications.length === 0 ? (
                        <li className="px-3 py-4 text-foreground/60">No messages.</li>
                      ) : (
                        sortedNotifications.map((n) => (
                          <li
                            key={n.id}
                            className={cn(
                              "border-b border-brand-border/80 px-3 py-2 last:border-0",
                              !n.read && "bg-brand-gold-muted/40",
                            )}
                          >
                            <button
                              type="button"
                              className="w-full text-left"
                              onClick={() => markNotificationRead(n.id)}
                            >
                              <p className="font-semibold text-brand-navy">{n.title}</p>
                              <p className="mt-0.5 text-xs text-foreground/70">
                                {n.message}
                              </p>
                              <p className="mt-1 text-[10px] text-foreground/45">
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <nav className="mt-3 flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-brand-border/80 bg-brand-muted/30 px-3 py-2 text-sm font-semibold text-brand-navy hover:border-brand-gold/40 hover:bg-brand-gold-muted/50"
            >
              <span aria-hidden className="text-brand-gold">
                ←
              </span>
              Back to home
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-brand-muted text-brand-navy"
                    : "text-foreground/75 hover:bg-brand-muted hover:text-brand-navy",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/opportunities"
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 hover:bg-brand-muted hover:text-brand-navy"
            >
              Browse opportunities
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 hover:bg-brand-muted hover:text-brand-navy"
            >
              Hub
            </Link>
          </nav>
          {hydrated && session ? (
            <div className="mt-4 border-t border-brand-border pt-4">
              <p className="truncate px-2 text-xs text-foreground/60">
                {session.email}
              </p>
              <button
                type="button"
                onClick={() => logout()}
                className="mt-2 w-full rounded-lg border border-brand-border py-2 text-sm font-medium text-brand-navy hover:bg-brand-muted"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
