import { Crown, Mail, Phone, Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="gradient-onyx mt-24 text-pearl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Crown className="h-7 w-7 text-gold" strokeWidth={1.5} />
            <span className="font-display text-2xl">MU Icons</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-pearl/70">
            The official voting platform for the MU Icons beauty pageant.
            Crown your favourite. Every vote shapes a legend.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-pearl/80">
            <li><Link to="/contestants" className="hover:text-gold">Contestants</Link></li>
            <li><Link to="/leaderboard" className="hover:text-gold">Leaderboard</Link></li>
            <li><Link to="/auth" className="hover:text-gold">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-pearl/80">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" />hello@muicons.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" />+234 800 000 0000</li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4" />@mu.icons</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pearl/10 py-6 text-center text-xs text-pearl/50">
        © {new Date().getFullYear()} MU Icons. All rights reserved.
      </div>
    </footer>
  );
}
