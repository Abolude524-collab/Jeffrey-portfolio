import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import {
  TrendingUp,
  BarChart3,
  Database,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate static cache every 60 seconds

export const metadata: Metadata = {
  title: "Jeffrey Usman | Data Analyst Portfolio & Case Studies",
  description: "Turning raw data into strategic business insights using SQL, Python, Power BI, and statistical modeling.",
  openGraph: {
    title: "Jeffrey Usman | Data Analyst Portfolio",
    description: "Turning raw data into strategic business insights.",
    url: "https://jeffreyusman.com",
    siteName: "Jeffrey Usman Portfolio",
    type: "website",
  },
};

const fallbackProjects = [
  {
    id: "1",
    title: "Sales Data Cleaning & Power BI Dashboard",
    slug: "sales-performance-analysis",
    shortDescription: "Transformed raw sales data across 3 regional sources and built an interactive Power BI dashboard for executive decision-making.",
    category: "Data Analysis",
    tags: ["SQL", "PowerBI", "Pandas", "Python", "Data Cleaning"],
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "Customer Churn Analysis with Python & SQL",
    slug: "telecom-customer-churn-analysis",
    shortDescription: "Analyzed telecom subscriber churn data, conducted exploratory data analysis with Pandas & SQL, and delivered predictive retention strategies.",
    category: "Predictive Analytics",
    tags: ["SQL", "Python", "Pandas", "Statistics"],
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: "3",
    title: "E-Commerce Analytics & Behavior Dashboard",
    slug: "ecommerce-analytics-dashboard",
    shortDescription: "Engineered a unified data pipeline and interactive analytics dashboard to evaluate user conversion funnels and product catalog performance.",
    category: "Business Intelligence",
    tags: ["SQL", "PowerBI", "Data Modeling"],
    coverImage: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=600&fit=crop",
    featured: true,
  }
];

const fallbackSkills = [
  { id: "s1", name: "SQL", category: "Data Analysis" },
  { id: "s2", name: "Python", category: "Data Analysis" },
  { id: "s3", name: "Pandas & NumPy", category: "Data Analysis" },
  { id: "s4", name: "Excel", category: "Data Analysis" },
  { id: "s5", name: "Power BI", category: "Data Visualization" },
  { id: "s6", name: "Tableau", category: "Data Visualization" },
  { id: "s7", name: "PostgreSQL", category: "Database" },
  { id: "s8", name: "Business Intelligence", category: "Business Intelligence" },
];

const fallbackExperiences = [
  {
    id: "e1",
    role: "Senior Data Analyst",
    organization: "Freelance / Analytics Consultant",
    startDate: "2024",
    endDate: "Present",
    description: "Delivering end-to-end data analytics solutions, BI dashboards, and data cleaning pipelines for commercial clients.",
    bulletPoints: [
      "Architected custom SQL queries and Power BI dashboards to track client sales KPIs across multi-channel platforms.",
      "Performed customer churn analysis and exploratory data analysis using Python Pandas.",
    ],
  }
];

const fallbackCertifications = [
  {
    id: "c1",
    title: "Google Data Analytics Professional Certificate",
    issuer: "Coursera / Google",
    issueDate: "2024",
    credentialUrl: "https://coursera.org",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
  },
  {
    id: "c2",
    title: "Microsoft Certified: Power BI Data Analyst Associate",
    issuer: "Microsoft",
    issueDate: "2024",
    credentialUrl: "https://learn.microsoft.com",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
  }
];

export default async function HomePage() {
  let profile = null;
  let projects = fallbackProjects;
  let skills = fallbackSkills;
  let experiences = fallbackExperiences;
  let certifications = fallbackCertifications;

  try {
    const [dbProfile, dbProjects, dbSkills, dbExperiences, dbCerts] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.project.findMany({
        where: { published: true, featured: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        take: 6,
      }),
      prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
      }),
      prisma.experience.findMany({
        orderBy: [{ order: "asc" }],
      }),
      prisma.certification.findMany({
        orderBy: [{ order: "asc" }],
      }),
    ]);

    if (dbProfile) profile = dbProfile;
    if (dbProjects && dbProjects.length > 0) projects = dbProjects;
    if (dbSkills && dbSkills.length > 0) skills = dbSkills;
    if (dbExperiences && dbExperiences.length > 0) experiences = dbExperiences;
    if (dbCerts && dbCerts.length > 0) certifications = dbCerts;
  } catch (err) {
    // Database connection fallback during build-time static generation
  }

  // Group skills by category
  const skillCategories: Record<string, typeof skills> = {};
  skills.forEach((s) => {
    if (!skillCategories[s.category]) skillCategories[s.category] = [];
    skillCategories[s.category].push(s);
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 overflow-hidden border-b border-slate-800/80">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DATA-DRIVEN DECISION MAKING</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 leading-[1.1]">
                JEFFREY USMAN
                <span className="block text-2xl sm:text-4xl text-slate-400 font-medium mt-2">
                  Data Analyst turning raw data into <span className="text-emerald-400 font-semibold underline decoration-emerald-500/40 decoration-2 underline-offset-8">actionable insights</span>.
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
                {profile?.bio ||
                  "Specialized in SQL, Power BI, Python, and statistical analysis. I clean complex datasets, build executive dashboards, and uncover revenue opportunities."}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/projects"
                  className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center gap-2"
                >
                  <span>View My Work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#contact"
                  className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-emerald-400 font-semibold rounded-lg text-sm transition-all"
                >
                  Contact Me
                </Link>
              </div>
            </div>

            {/* Visual Hero Panel */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">analytical_dashboard.sql</span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-slate-300">
                    <span className="text-emerald-400 font-bold">SELECT</span> region, <span className="text-emerald-400 font-bold">SUM</span>(revenue) <span className="text-emerald-400 font-bold">AS</span> total_sales
                    <br />
                    <span className="text-emerald-400 font-bold">FROM</span> executive_sales_data
                    <br />
                    <span className="text-emerald-400 font-bold">WHERE</span> status = <span className="text-amber-300">&apos;Completed&apos;</span>
                    <br />
                    <span className="text-emerald-400 font-bold">GROUP BY</span> region
                    <br />
                    <span className="text-emerald-400 font-bold">ORDER BY</span> total_sales <span className="text-emerald-400 font-bold">DESC</span>;
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                      <p className="text-[10px] text-emerald-400 font-semibold">QUERY EXECUTION TIME</p>
                      <p className="text-lg font-bold text-slate-100 mt-0.5">0.042s</p>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-semibold">RECORDS ANALYZED</p>
                      <p className="text-lg font-bold text-slate-100 mt-0.5">50,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. TRUST & QUICK CREDIBILITY FACTS */}
        <section className="py-12 bg-slate-900/40 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left border-r last:border-0 border-slate-800/60 pr-4">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tracking-tight">01+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Years Experience</p>
            </div>
            <div className="text-center md:text-left border-r last:border-0 border-slate-800/60 pr-4">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tracking-tight">{projects.length}+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Verified Case Studies</p>
            </div>
            <div className="text-center md:text-left border-r last:border-0 border-slate-800/60 pr-4">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tracking-tight">{certifications.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Certifications</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tracking-tight">{skills.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Tools & Technologies</p>
            </div>
          </div>
        </section>

        {/* 3. ABOUT SECTION */}
        <section id="about" className="py-24 px-6 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ABOUT JEFFREY</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                Solving complex business problems through analytical rigor.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                My analytical approach combines technical expertise in SQL query optimization, Python exploratory data analysis (Pandas/NumPy), and interactive Power BI dashboard development.
              </p>
              <p>
                Instead of simply delivering charts, I focus on the underlying business problem—whether identifying customer churn drivers, standardizing regional sales records, or optimizing conversion funnels.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
                <div className="space-y-1">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-slate-100 text-sm">Data Cleaning</h3>
                  <p className="text-xs text-slate-400">Imputation, deduplication, and pipeline automation.</p>
                </div>
                <div className="space-y-1">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-slate-100 text-sm">Visualization</h3>
                  <p className="text-xs text-slate-400">Power BI DAX, Tableau, & executive dashboards.</p>
                </div>
                <div className="space-y-1">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-slate-100 text-sm">SQL Modeling</h3>
                  <p className="text-xs text-slate-400">Star-schema architecture, joins, & aggregations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURED PROJECTS SECTION */}
        <section id="projects" className="py-24 px-6 bg-slate-900/30 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">SELECTED WORK</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mt-1">
                  Projects built around real problems.
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="h-52 relative overflow-hidden bg-slate-950">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full text-[10px] font-bold text-emerald-400 uppercase">
                        {project.category}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-slate-100 text-lg group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {project.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-md text-[10px] font-medium text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-4 border-t border-slate-800 w-full"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. SKILLS SECTION */}
        <section id="skills" className="py-24 px-6 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto space-y-12">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">TECHNICAL CAPABILITIES</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mt-1">
                Skills & Data Stack
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(skillCategories).map(([category, items]) => (
                <div key={category} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
                  <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider border-b border-slate-800 pb-3 text-emerald-400">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. EXPERIENCE TIMELINE */}
        <section id="experience" className="py-24 px-6 bg-slate-900/30 border-b border-slate-800/80">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">CAREER PATH</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mt-1">
                Work History & Experience
              </h2>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 md:before:left-1/2 before:w-0.5 before:bg-slate-800">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    idx % 2 === 0 ? "md:flex-row-reverse text-left" : ""
                  }`}
                >
                  <div className="absolute left-3 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0B0F17] z-10"></div>
                  <div className="ml-8 md:ml-0 md:w-1/2 px-4 space-y-2">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                      <h3 className="font-bold text-slate-100 text-base mt-1">{exp.role}</h3>
                      <p className="text-xs text-slate-400 font-medium">@ {exp.organization}</p>
                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">{exp.description}</p>

                      {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
                          {exp.bulletPoints.map((bp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 shrink-0">•</span>
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CERTIFICATIONS SECTION */}
        <section className="py-24 px-6 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto space-y-12">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">VERIFIED CREDENTIALS</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mt-1">
                Certifications
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
                  {cert.imageUrl && (
                    <div className="h-36 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                      <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{cert.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{cert.issuer} • {cert.issueDate}</p>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      <span>View Credential</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CONTACT SECTION */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">GET IN TOUCH</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
                HAVE A PROJECT IN MIND?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                Let&apos;s turn your messy data into clear strategic direction. Available for consulting and full-time roles.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
