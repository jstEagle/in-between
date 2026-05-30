"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { buildSearchPath } from "@/lib/searchQuery";

/**
 * Progressive-enhancement wrapper for the labyrinth's search boxes. Typing a
 * query and submitting routes to a `/search/...` page seeded by that query, so
 * the visitor lands somewhere recognisably about what they searched for — yet
 * never quite the thing itself. With an empty query (or no JS) it falls back to
 * the deterministic `fallbackHref` the generator already produced.
 */
export function SearchForm({
  fallbackHref,
  defaultValue = "",
  placeholder,
  ariaLabel,
  formClassName = "",
  inputClassName = "",
  buttonClassName,
  buttonLabel,
  autoComplete = "off"
}: {
  fallbackHref: string;
  defaultValue?: string;
  placeholder?: string;
  ariaLabel?: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  buttonLabel?: ReactNode;
  autoComplete?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? buildSearchPath(trimmed) : fallbackHref);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={formClassName}>
      <input
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete={autoComplete}
        spellCheck={false}
        className={inputClassName}
      />
      {buttonLabel !== undefined ? (
        <button type="submit" className={buttonClassName}>
          {buttonLabel}
        </button>
      ) : null}
    </form>
  );
}
