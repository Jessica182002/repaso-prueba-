import { useState, useId } from "react";

const FIELD_TYPES = {
  text: {
    inputType: "text",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  email: {
    inputType: "email",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  password: {
    inputType: "password",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  number: {
    inputType: "number",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />
      </svg>
    ),
  },
  tel: {
    inputType: "tel",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.2 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  url: {
    inputType: "url",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  search: {
    inputType: "search",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
      </svg>
    ),
  },
  textarea: {
    inputType: "textarea",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10M7 12h10M7 17h6" />
      </svg>
    ),
  },
  date: {
    inputType: "date",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
};

// Eye icon for password toggle
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" x2="23" y1="1" y2="23" />
  </svg>
);
const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

/**
 * Field — universal input component
 *
 * Props:
 *  type        — "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "textarea" | "date"
 *  label       — string label shown above
 *  placeholder — placeholder text
 *  value       — controlled value
 *  onChange    — (e) => void
 *  hint        — helper text below the input
 *  error       — error message (replaces hint when set)
 *  success     — boolean, green state when true
 *  disabled    — boolean
 *  required    — boolean
 *  clearable   — boolean, shows X button to clear value
 *  prefix      — left-side text/element (e.g. "$", "+1")
 *  suffix      — right-side text/element (e.g. "kg", ".com")
 *  icon        — override the left icon (React node)
 *  showTypeIcon— boolean, show the type icon on the left (default: true)
 *  rows        — number, for textarea only (default: 3)
 *  className   — extra classes for the wrapper
 *  inputProps  — any extra props passed to <input> / <textarea>
 */
export function Field({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  hint,
  error,
  success = false,
  disabled = false,
  required = false,
  clearable = false,
  prefix,
  suffix,
  icon,
  showTypeIcon = true,
  rows = 3,
  className = "",
  inputProps = {},
}) {
  const id = useId();
  const hintId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const config = FIELD_TYPES[type] || FIELD_TYPES.text;

  const isTextarea = type === "textarea";
  const resolvedInputType =
    type === "password" ? (showPassword ? "text" : "password") : config.inputType;

  // State-driven border / ring
  const stateClasses = error
    ? "border-red-400 focus-within:ring-red-400/30 focus-within:border-red-500"
    : success
    ? "border-emerald-400 focus-within:ring-emerald-400/30 focus-within:border-emerald-500"
    : focused
    ? "border-indigo-400 ring-2 ring-indigo-400/20"
    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600";

  const hasLeftContent = showTypeIcon || icon || prefix;
  const hasRightContent = clearable || type === "password" || suffix;

  const leftPadding = hasLeftContent ? (prefix ? "pl-10" : "pl-9") : "pl-3";
  const rightPadding = hasRightContent ? "pr-9" : "pr-3";

  const sharedInputClasses = `
    w-full bg-transparent outline-none text-sm text-zinc-800 dark:text-zinc-100
    placeholder:text-zinc-400 dark:placeholder:text-zinc-500
    disabled:cursor-not-allowed
    ${leftPadding} ${rightPadding} py-2.5
  `;

  const handleClear = () => {
    onChange?.({ target: { value: "" } });
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400 select-none"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={`
          relative flex items-${isTextarea ? "start" : "center"}
          rounded-xl border bg-white dark:bg-zinc-900
          transition-all duration-150
          focus-within:ring-2
          ${stateClasses}
          ${disabled ? "opacity-50 bg-zinc-50 dark:bg-zinc-800" : ""}
        `}
      >
        {/* Left icon / prefix */}
        {(showTypeIcon || icon || prefix) && (
          <div
            className={`
              absolute left-3 flex items-center justify-center
              text-zinc-400 dark:text-zinc-500 pointer-events-none
              ${isTextarea ? "top-3" : ""}
            `}
          >
            {prefix ? (
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {prefix}
              </span>
            ) : icon ? (
              icon
            ) : (
              config.icon
            )}
          </div>
        )}

        {/* Input or Textarea */}
        {isTextarea ? (
          <textarea
            id={id}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-describedby={hint || error ? hintId : undefined}
            aria-invalid={!!error}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${sharedInputClasses} resize-none`}
            {...inputProps}
          />
        ) : (
          <input
            id={id}
            type={resolvedInputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-describedby={hint || error ? hintId : undefined}
            aria-invalid={!!error}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={sharedInputClasses}
            {...inputProps}
          />
        )}

        {/* Right controls */}
        {hasRightContent && (
          <div
            className={`
              absolute right-2.5 flex items-center gap-1
              ${isTextarea ? "top-2.5" : ""}
            `}
          >
            {/* Suffix text */}
            {suffix && !clearable && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 pointer-events-none pr-0.5">
                {suffix}
              </span>
            )}

            {/* Clear button */}
            {clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                tabIndex={-1}
                aria-label="Clear field"
                className="p-0.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ClearIcon />
              </button>
            )}

            {/* Password toggle */}
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="p-0.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hint / error */}
      {(error || hint) && (
        <p
          id={hintId}
          className={`text-xs ${
            error
              ? "text-red-500"
              : success
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

// ─── Demo ────────────────────────────────────────────────────────────────────

export default function App() {
  const [vals, setVals] = useState({
    text: "",
    email: "",
    password: "",
    number: "",
    tel: "",
    url: "",
    search: "",
    textarea: "",
    date: "",
    price: "",
  });

  const set = (key) => (e) => setVals((v) => ({ ...v, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col gap-5">
        <div className="mb-2">
          <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Field Component</h1>
          <p className="text-sm text-zinc-400 mt-0.5">All types in a single universal component</p>
        </div>

        <Field type="text"     label="Full name"     placeholder="Jane Doe"              value={vals.text}     onChange={set("text")}     clearable required hint="Your legal full name" />
        <Field type="email"    label="Email address" placeholder="jane@example.com"       value={vals.email}    onChange={set("email")}    clearable error={vals.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email) ? "Invalid email address" : ""} />
        <Field type="password" label="Password"      placeholder="Min. 8 characters"     value={vals.password} onChange={set("password")} hint={vals.password.length >= 8 ? "Strong password ✓" : "Must be at least 8 characters"} success={vals.password.length >= 8} />
        <Field type="number"   label="Age"           placeholder="25"                    value={vals.number}   onChange={set("number")}   suffix="yrs" inputProps={{ min: 0, max: 120 }} />
        <Field type="tel"      label="Phone"         placeholder="+1 555 000 0000"       value={vals.tel}      onChange={set("tel")}      prefix="+1" clearable />
        <Field type="url"      label="Website"       placeholder="https://example.com"   value={vals.url}      onChange={set("url")}      clearable />
        <Field type="search"   label="Search"        placeholder="Search anything…"      value={vals.search}   onChange={set("search")}   clearable />
        <Field type="textarea" label="Bio"           placeholder="Tell us about yourself…" value={vals.textarea} onChange={set("textarea")} rows={4} hint="Max 200 characters" />
        <Field type="date"     label="Date of birth" value={vals.date}                   onChange={set("date")} />
        <Field
          type="number"
          label="Price"
          placeholder="0.00"
          value={vals.price}
          onChange={set("price")}
          prefix="$"
          suffix="USD"
          inputProps={{ min: 0, step: "0.01" }}
          hint="Enter the amount in US dollars"
        />
      </div>
    </div>
  );
}
