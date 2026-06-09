// src/components/layout/Footer.jsx
import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="mt-auto py-6 border-t border-gray-100 bg-white">
    <div className="max-w-feed mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-text-secondary">
      <span className="font-semibold text-text">Mi Gusto · Carta Digital</span>
      <span className="flex items-center gap-1">
        Hecho con <Heart size={13} className="text-primary fill-primary" /> en Argentina
      </span>
    </div>
  </footer>
);

export default Footer;
