"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, User } from "lucide-react";
import UserMenu, { NavUser } from "@/components/(auth)/userMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

const MOBILE_NAV_LINKS = NAV_LINKS.slice(0, 2);

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function NavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`
        relative text-sm font-semibold tracking-widest uppercase
        transition-colors duration-200
        after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full
        after:transition-transform after:duration-200 after:origin-left
        ${
          isActive
            ? "text-gray-900 after:bg-gray-900 after:scale-x-100"
            : "text-gray-600 hover:text-gray-900 after:bg-gray-900 after:scale-x-0 hover:after:scale-x-100"
        }
      `}
    >
      {label}
    </Link>
  );
}

interface NavIconsProps {
  user: NavUser | null;
}

function NavIcons({ user }: NavIconsProps) {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <button
        aria-label="Search"
        className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
      >
        <Search size={20} strokeWidth={1.75} />
      </button>
      <button
        aria-label="Cart"
        className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
      >
        <ShoppingCart size={20} strokeWidth={1.75} />
      </button>
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Link
          href="/auth"
          aria-label="Account"
          className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
        >
          <User size={20} strokeWidth={1.75} />
        </Link>
      )}
    </div>
  );
}

interface NavbarProps {
  user?: NavUser | null;
}

export default function Navbar({ user = null }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <nav
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16 sm:h-[72px]"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex flex-col leading-none shrink-0"
          aria-label="SOGI Pvt Ltd - Home"
        >
          <span className="text-2xl font-extrabold text-primary tracking-tight">
            SGOI
          </span>
          <span className="text-[11px] font-medium text-gray-500 tracking-wide -mt-0.5">
            Pvt Ltd.
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 lg:gap-10" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            </li>
          ))}
        </ul>
        <ul className="flex md:hidden items-center gap-5 sm:gap-6" role="list">
          {MOBILE_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            </li>
          ))}
        </ul>

        <NavIcons user={user} />
      </nav>
    </header>
  );
}
