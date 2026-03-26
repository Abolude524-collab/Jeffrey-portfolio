
import PortfolioGrid from "../components/PortfolioGrid";
import ContactForm from "../components/ContactForm";

export const metadata = {
  title: "Data Analyst Portfolio",
  description: "Turning Raw Data into Business Strategy",
};

/**
 * HomePage component
 * Shows hero section and portfolio grid.
 */
export default function HomePage() {
  return (
    <>
      {/* Header/Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 rounded-b-2xl shadow-lg border-b border-slate-200">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent-emerald/30">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#10b981" fontFamily="sans-serif">JU</text></svg>
            </span>
            <span className="text-xl md:text-2xl font-bold text-emerald-400 tracking-tight">Jeffrey Usman</span>
          </div>
          <div className="flex gap-8">
            <a href="#about" className="text-slate-200 hover:text-accent-emerald px-2 py-1 rounded transition-colors focus:outline-none focus:text-accent-emerald">About</a>
            <a href="#portfolio" className="text-slate-200 hover:text-accent-emerald px-2 py-1 rounded transition-colors focus:outline-none focus:text-accent-emerald">Projects</a>
            <a href="#contact" className="text-slate-200 hover:text-accent-emerald px-2 py-1 rounded transition-colors focus:outline-none focus:text-accent-emerald">Contact</a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section: Headline, subtitle, CTA */}
        <section className="py-20 text-center border-b border-slate-800">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-4">
            Turning Raw Data into Business Strategy
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Bridging the gap between raw data, analytics, and business decision-making. Explore real-world projects in SQL, Power BI, and Python.
          </p>
          <a href="#portfolio" className="inline-block px-6 py-3 bg-accent-emerald text-white rounded-full font-semibold shadow-glass hover:bg-emerald-600 transition-colors">View Projects</a>
        </section>

        {/* About Section: Professional narrative */}
        <section className="max-w-3xl mx-auto py-12 px-4 text-center border-b border-slate-800" id="about">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">About</h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            My journey began in web development, where I learned to build robust, user-focused applications. Over time, my passion shifted toward data—uncovering patterns, cleaning messy datasets, and transforming numbers into actionable business insights.<br className="hidden md:inline" />
            <br />
            Today, I specialize in data analysis, blending technical expertise in SQL, Power BI, and Python (Pandas) with a strong sense for business impact. My approach is analytical, detail-oriented, and always focused on driving strategic decisions through data clarity.
          </p>
        </section>

        {/* Portfolio Grid section */}
        <section id="portfolio" className="py-12 border-b border-slate-800">
          <PortfolioGrid />
        </section>

        {/* Contact Section: Form, Resume, Socials */}
        <section className="max-w-3xl mx-auto py-16 px-4" id="contact">
          <h2 className="text-2xl font-bold text-slate-100 mb-4 text-center">Contact</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
            <div className="flex-1">
              {/* Contact form */}
              <ContactForm />
            </div>
            <div className="flex-1 flex flex-col items-center gap-6 mt-8 md:mt-0">
              <a
                href="/resume.pdf"
                download
                className="px-6 py-2 rounded-full bg-accent-slate text-white font-semibold shadow-glass hover:bg-slate-600 transition-colors"
              >
                Download Resume
              </a>
              <div className="flex gap-4 mt-2">
                  <a href="https://www.linkedin.com/in/jeffrey-usman-a0b953352?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener" aria-label="LinkedIn" className="text-accent-emerald hover:text-emerald-300">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                </a>
                <a href="https://github.com/" target="_blank" rel="noopener" aria-label="GitHub" className="text-accent-slate hover:text-slate-300">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.63 0-12 5.37-12 12 0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576 4.765-1.587 8.2-6.086 8.2-11.384 0-6.63-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
