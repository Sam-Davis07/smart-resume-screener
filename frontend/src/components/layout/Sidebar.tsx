"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  Upload,
  Settings,
  Sparkles,
} from "lucide-react";


const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Candidates",
    href: "/candidates",
    icon: Users,
  },
  {
    name: "Upload Resume",
    href: "/upload",
    icon: Upload,
  },
];


export default function Sidebar() {

  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">

      {/* Logo */}

      <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-6">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
          <Sparkles size={18} />
        </div>

        <div>
          <h1 className="text-sm font-semibold text-white">
            SmartScreen
          </h1>

          <p className="text-xs text-zinc-500">
            AI Resume Screener
          </p>
        </div>

      </div>


      {/* Navigation */}

      <nav className="flex-1 space-y-1 p-4">

        {navigation.map((item) => {

          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (
              item.href !== "/" &&
              pathname.startsWith(item.href)
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >

              <Icon size={18} />

              {item.name}

            </Link>
          );

        })}

      </nav>


      {/* Bottom */}

      <div className="border-t border-zinc-800 p-4">

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
        >
          <Settings size={18} />
          Settings
        </Link>

      </div>

    </aside>
  );
}