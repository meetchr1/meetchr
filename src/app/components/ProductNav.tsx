"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { href: "/portal", label: "Portal" },
  { href: "/coach", label: "AI Coach" },
  { href: "/help", label: "Peer Help" },
  { href: "/academy", label: "Academy" },
  { href: "/admin", label: "Admin" },
] as const;

type ProductNavProps = {
  current: (typeof NAV_ITEMS)[number]["href"];
};

export function ProductNav({ current }: ProductNavProps) {
  return (
    <nav aria-label="Product navigation" className="-mx-1 overflow-x-auto pb-1">
      <div className="flex w-max gap-2 px-1 md:w-auto md:flex-wrap">
        {NAV_ITEMS.map((item) => {
          const active = item.href === current;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm rounded-full border transition whitespace-nowrap ${
                active
                  ? "border-pink-600 bg-pink-50 text-pink-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
