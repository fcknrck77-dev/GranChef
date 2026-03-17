'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="global-footer glass">
      <div className="footer-content container">
        <div className="footer-brand">
          <span className="brand">GRANDCHEF LAB</span>
          <p>Omniscience Library v1.4.2</p>
        </div>
        <div className="footer-links">
          <Link href="/policies">Legal & Protocolos</Link>
        </div>
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} Precision Gastronomy. All rights reserved.
        </div>
      </div>
      <style jsx>{`
        .global-footer {
          margin-top: 100px;
          border-top: 1px solid var(--border);
          padding: 60px 0;
          background: var(--modal-surface);
          color: var(--foreground);
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .footer-brand .brand {
          font-weight: 900;
          letter-spacing: 4px;
          color: var(--primary);
        }
        .footer-brand p {
          font-size: 0.7rem;
          opacity: 0.4;
          margin-top: 5px;
        }
        .footer-links {
          display: flex;
          gap: 40px;
        }
        .footer-links a, .footer-links :global(a) {
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          color: var(--foreground);
          opacity: 0.5;
          transition: 0.3s;
        }
        .footer-links a:hover, .footer-links :global(a:hover) {
          opacity: 1;
          color: var(--primary);
        }
        .footer-copyright {
          font-size: 0.7rem;
          opacity: 0.3;
        }
        @media (max-width: 768px) {
          .footer-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
