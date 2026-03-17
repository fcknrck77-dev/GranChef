import Link from 'next/link';

export default function BrandLogo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="Grand Chef">
      <svg className="mark" width="34" height="34" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <path
          d="M22 26c-6.5 0-11-4.7-11-10.5C11 9.7 16 5 22 5c2.6 0 5 .9 6.9 2.6C30.8 5.9 33.3 5 36 5c6 0 11 4.7 11 10.5C47 21.3 42.5 26 36 26H22z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M18 28h28v9c0 4.4-3.6 8-8 8H26c-4.4 0-8-3.6-8-8v-9z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M20 45h24l4 14H16l4-14z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
      <span className="word">
        Grand<span className="chef">Chef</span>
      </span>
      <style jsx>{`
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          user-select: none;
        }
        .mark { color: var(--primary); flex: 0 0 auto; }
        .word {
          font-weight: 900;
          letter-spacing: -0.5px;
          font-size: 1.25rem;
          color: var(--foreground);
          line-height: 1;
        }
        .chef { color: var(--primary); }
      `}</style>
    </Link>
  );
}

