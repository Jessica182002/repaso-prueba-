const VARIANTS = {
  primary:   "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 border-transparent",
  secondary: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 active:bg-zinc-300 border-transparent dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
  outline:   "bg-transparent text-zinc-700 border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100 dark:text-zinc-200 dark:border-zinc-600 dark:hover:bg-zinc-800",
  ghost:     "bg-transparent text-zinc-600 border-transparent hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800",
  danger:    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 border-transparent",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
  md: "text-sm px-4 py-2 gap-2 rounded-xl",
  lg: "text-base px-5 py-2.5 gap-2.5 rounded-xl",
};

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/**
 * Button
 *
 * Props:
 *  variant   — "primary" | "secondary" | "outline" | "ghost" | "danger"
 *  size      — "sm" | "md" | "lg"
 *  loading   — boolean, shows spinner and disables
 *  disabled  — boolean
 *  fullWidth — boolean
 *  leftIcon  — React node
 *  rightIcon — React node
 *  onClick   — function
 *  type      — "button" | "submit" | "reset"
 *  children  — label
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = "button",
  children,
  className = "",
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium border
        transition-all duration-150 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant] ?? VARIANTS.primary}
        ${SIZES[size] ?? SIZES.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}


// ─── Demo ────────────────────────────────────────────────────────────────────

import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(false);

  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };



  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md flex flex-col gap-8">

        {/* Variants */}
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Variants</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Sizes</p>
          <div className="flex items-center flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

     

        {/* States */}
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">States</p>
          <div className="flex flex-wrap gap-3">
            <Button loading={loading} onClick={simulate}>
              {loading ? "Loading…" : "Simulate load"}
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>


      </div>
    </div>
  );
}
