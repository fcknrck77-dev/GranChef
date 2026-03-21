import Link from 'next/link';

export default function BrandLogo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="Grand Chef">
      <img 
        src="/logo_premium.png" 
        alt="GrandChef Logo" 
        className="logo-img" 
      />
      <span className="word">
        GRAND<span className="chef">CHEF</span>
      </span>
      <style jsx>{`
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          user-select: none;
        }
        .logo-img { height: 40px; width: auto; }
        .word {
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 1.1rem;
          color: var(--foreground);
          line-height: 1;
        }
        .chef { color: var(--primary); font-weight: 200; }
      `}</style>
    </Link>
  );
}

