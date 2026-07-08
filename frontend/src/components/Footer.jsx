import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Twitter, Instagram, Globe, ShoppingCart } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Footer() {
  const footerRef = useRef(null);
  const formRef = useRef(null);

  useGSAP(() => {
    // Link stagger fade-in on scroll
    gsap.from(".footer-stagger > *", {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Social icons hover
    const icons = gsap.utils.toArray(".social-icon");
    icons.forEach(icon => {
      icon.addEventListener("mouseenter", () => gsap.to(icon, { scale: 1.2, duration: 0.3, ease: "back.out(2)" }));
      icon.addEventListener("mouseleave", () => gsap.to(icon, { scale: 1, duration: 0.3, ease: "power2.out" }));
    });

    // Newsletter glow focus
    const input = formRef.current?.querySelector('input');
    if (input) {
      input.addEventListener("focus", () => gsap.to(formRef.current, { boxShadow: "0 0 20px rgba(255,255,255,0.15)", scale: 1.02, duration: 0.3 }));
      input.addEventListener("blur", () => gsap.to(formRef.current, { boxShadow: "none", scale: 1, duration: 0.3 }));
    }

  }, { scope: footerRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer ref={footerRef} className="bg-primary border-t border-primary-dark mt-20">
      
      {/* Top Banner section */}
      <div className="footer-stagger max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-neutral-100">
        
        {/* Company Intro */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-outfit font-extrabold text-2xl tracking-tight text-white flex items-center gap-1.5">
              <ShoppingCart size={28} className="text-white" />
              Quick<span className="text-primary-light">cart</span>
            </span>
          </Link>
          <p className="text-primary-light text-sm leading-relaxed">
            Your source for premium organic food, sun-baked goodness delivered from local fields straight to your table.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="social-icon p-2 text-primary-light hover:text-white hover:bg-primary-dark rounded-full transition-colors inline-block">
              <Facebook size={18} />
            </a>
            <a href="#" className="social-icon p-2 text-primary-light hover:text-white hover:bg-primary-dark rounded-full transition-colors inline-block">
              <Twitter size={18} />
            </a>
            <a href="#" className="social-icon p-2 text-primary-light hover:text-white hover:bg-primary-dark rounded-full transition-colors inline-block">
              <Instagram size={18} />
            </a>
            <a href="#" className="social-icon p-2 text-primary-light hover:text-white hover:bg-primary-dark rounded-full transition-colors inline-block">
              <Globe size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-outfit font-bold text-white text-sm uppercase tracking-wider mb-4">Sourcing</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="text-primary-light hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/sustainability" className="text-primary-light hover:text-white transition-colors">Sustainability</Link></li>
            <li><Link to="/farm-partners" className="text-primary-light hover:text-white transition-colors">Farm Partners</Link></li>
            <li><Link to="/gift-cards" className="text-primary-light hover:text-white transition-colors">Gift Cards</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-outfit font-bold text-white text-sm uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shipping-policy" className="text-primary-light hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns-refunds" className="text-primary-light hover:text-white transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/privacy-policy" className="text-primary-light hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/contact" className="text-primary-light hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Newsletter / App Download */}
        <div className="space-y-4">
          <h4 className="font-outfit font-bold text-white text-sm uppercase tracking-wider mb-4">Newsletter</h4>
          <p className="text-primary-light text-xs">
            Get fresh recipes and seasonal deals directly in your inbox.
          </p>
          <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 rounded-lg bg-neutral-100 p-0.5">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-grow px-4 py-2 bg-transparent text-sm text-neutral-800 outline-none transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">Download App</span>
            <div className="flex gap-2">
              <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-left transition-colors">
                <span className="text-[9px] font-medium text-neutral-400 uppercase block leading-none">Download on</span>
                <span className="font-semibold text-xs font-outfit block leading-none">App Store</span>
              </a>
              <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-left transition-colors">
                <span className="text-[9px] font-medium text-neutral-400 uppercase block leading-none">Get it on</span>
                <span className="font-semibold text-xs font-outfit block leading-none">Google Play</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-primary-light gap-4 border-t border-primary-dark">
        <div>
          © {new Date().getFullYear()} Quickcart Market. Crafted with fresh energy.
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Secure Payments</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Cold-Chain Delivery</span>
        </div>
      </div>

    </footer>
  );
}
