import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-light tracking-wide uppercase text-foreground">About</h3>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              Department of Accounting, Bowen University. Empowering students with knowledge and resources.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-light tracking-wide uppercase text-foreground">Navigate</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/notes" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                  Notes Library
                </Link>
              </li>
              <li>
                <Link href="/vote" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                  Elections
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-light tracking-wide uppercase text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="text-sm font-light text-muted-foreground">
                Bowen University<br />
                Iwo, Osun State, Nigeria
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:accounting@bowen.edu.ng" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                  accounting@bowen.edu.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs font-light text-muted-foreground tracking-wide">
              © {new Date().getFullYear()} Bowen University Accounting Department
            </p>
            <div className="flex space-x-8">
              <Link href="/privacy" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors tracking-wide">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors tracking-wide">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
