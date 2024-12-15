"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { ModeToggle } from "@/components/mode-toggle";

// const navItems = [{ href: "/", label: "Home" }];

export function Navigation() {
  // const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Country Explorer
        </Link>
        {/* <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <ModeToggle />
        </div> */}
      </div>
    </nav>
  );
}
