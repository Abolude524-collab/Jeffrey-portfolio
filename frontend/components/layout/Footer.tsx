import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#070A0F] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800/60">
        <div className="space-y-3">
          <h3 className="font-bold text-slate-100 text-base tracking-wider">JEFFREY USMAN</h3>
          <p className="text-emerald-400 font-semibold text-xs">Data Analyst & Analytics Consultant</p>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
            Turning messy datasets into clear, strategic business insights through SQL, Python, and Power BI.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
            <li><Link href="/#about" className="hover:text-emerald-400 transition-colors">About</Link></li>
            <li><Link href="/projects" className="hover:text-emerald-400 transition-colors">Projects & Case Studies</Link></li>
            <li><Link href="/#skills" className="hover:text-emerald-400 transition-colors">Skills & Tech Stack</Link></li>
            <li><Link href="/#contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Connect & Credentials</h4>
          <ul className="space-y-2">
            <li>
              <a href="https://github.com/jeffrey-wonder06" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <span>GitHub Profile</span>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/jeffrey-usman-a0b953352" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-emerald-400" />
                <span>LinkedIn Network</span>
              </a>
            </li>
            <li>
              <a href="mailto:jeffreyusman@gmail.com" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>jeffreyusman@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Jeffrey Usman. All rights reserved.</p>
        <a
          href="#"
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-xs font-semibold"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </a>
      </div>
    </footer>
  );
}
