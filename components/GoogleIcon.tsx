interface GoogleIconProps {
  className?: string;
}

export default function GoogleIcon({ className = "h-5 w-5" }: GoogleIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.48c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.56-5.17 3.56-8.76z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.96-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.96H1.24v3.11C3.24 21.3 7.26 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.25 14.27a7.2 7.2 0 0 1-.38-2.27c0-.79.14-1.55.38-2.27V6.62H1.24A11.97 11.97 0 0 0 0 12c0 1.93.46 3.76 1.24 5.38l4.01-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.26 0 3.24 2.7 1.24 6.62l4.01 3.11C6.2 6.89 8.86 4.77 12 4.77z"
      />
    </svg>
  );
}
