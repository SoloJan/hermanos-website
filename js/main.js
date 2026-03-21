/**
 * main.js — Site-wide interactions
 * - Mobile hamburger menu toggle
 * - Active nav link highlighting
 * - Header scroll shadow
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile menu ──────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // ── Active nav link ───────────────────────────────────────────
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  document.querySelectorAll('.header-nav a, .mobile-nav a').forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // ── Header scroll shadow ──────────────────────────────────────
  const header = document.querySelector('.site-header');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

});
