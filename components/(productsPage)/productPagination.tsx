import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildProductsHref, type ProductsQuery } from "@/lib/public/buildProductsHref";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  currentQuery: ProductsQuery;
}

export default function ProductPagination({
  page,
  totalPages,
  currentQuery,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageWindow(page, totalPages);

  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-center gap-1.5 mt-8"
    >
      <PageLink
        disabled={page <= 1}
        href={buildProductsHref(currentQuery, { page: String(page - 1) })}
        ariaLabel="Previous page"
      >
        <ChevronLeft size={16} />
      </PageLink>

      {pageNumbers.map((n, i) =>
        n === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
            &hellip;
          </span>
        ) : (
          <Link
            key={n}
            href={buildProductsHref(currentQuery, { page: String(n) })}
            aria-current={n === page ? "page" : undefined}
            className={`
              flex items-center justify-center h-9 w-9 rounded-md text-sm font-semibold transition-colors duration-150
              ${
                n === page
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-700 border border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            {n}
          </Link>
        ),
      )}

      <PageLink
        disabled={page >= totalPages}
        href={buildProductsHref(currentQuery, { page: String(page + 1) })}
        ariaLabel="Next page"
      >
        <ChevronRight size={16} />
      </PageLink>
    </nav>
  );
}

function PageLink({
  disabled,
  href,
  ariaLabel,
  children,
}: {
  disabled: boolean;
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-label={ariaLabel}
        aria-disabled="true"
        className="flex items-center justify-center h-9 w-9 rounded-md text-gray-300 border border-gray-100"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="flex items-center justify-center h-9 w-9 rounded-md text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
    >
      {children}
    </Link>
  );
}

function getPageWindow(
  page: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const window = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...window].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(n);
  });
  return result;
}
