"use client";
import Navbar from "../components/Navbar";
import PortfolioGrid from "../components/PortfolioGrid";
import ContactForm from "../components/ContactForm";
import { TrendingUp, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
    return (
        <>
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-8 inline-block"
                        >
                            <div className="px-4 py-2 rounded-full border border-blue-400/30 bg-blue-400/10">
                                <p className="text-sm text-blue-300">Data-Driven Decision Making</p>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 leading-tight tracking-tight"
                        >
                            Transform Raw Data Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Strategic Insights</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            Expert data analyst specialized in SQL, Power BI, and Python. I uncover hidden patterns and drive business impact through analytics.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <a
                                href="#projects"
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-tranzinc-y-0.5"
                            >
                                View Projects
                            </a>
                            <a
                                href="#contact"
                                className="px-8 py-3 border border-zinc-700 hover:border-blue-400 text-zinc-300 hover:text-blue-400 font-semibold rounded-lg transition-all"
                            >
                                Get In Touch
                            </a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="mt-16 grid grid-cols-3 gap-6 md:gap-12"
                        >
                            <div>
                                <p className="text-3xl font-bold text-blue-400">50K+</p>
                                <p className="text-sm text-zinc-400 mt-1">Data Points Analyzed</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-400">15+</p>
                                <p className="text-sm text-zinc-400 mt-1">Projects Completed</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-400">3x</p>
                                <p className="text-sm text-zinc-400 mt-1">Avg. Efficiency Gain</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Tech Stack */}
                <section className="py-16 px-4 bg-zinc-800/30 border-t border-b border-zinc-800 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center text-zinc-300 font-semibold mb-8"
                        >
                            Tech Stack & Tools
                        </motion.h2>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                            className="grid grid-cols-2 md:grid-cols-5 gap-4"
                        >
                            {["SQL", "Python", "Pandas", "Power BI", "Excel"].map((tech) => (
                                <motion.div
                                    key={tech}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/40 text-center hover:border-blue-400/50 transition-colors"
                                >
                                    <p className="text-sm font-semibold text-zinc-300">{tech}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl font-bold text-zinc-100 mb-8">About Me</h2>
                        <div className="space-y-6 text-zinc-400 leading-relaxed">
                            <p className="text-lg">
                                My journey began in web development, where I learned to build robust, user-focused applications. Over time, my passion shifted toward data—uncovering patterns, cleaning messy datasets, and transforming numbers into actionable business insights.
                            </p>
                            <p>
                                Today, I specialize in data analysis, blending technical expertise in SQL, Power BI, and Python (Pandas) with a strong sense for business impact. My approach is analytical, detail-oriented, and always focused on driving strategic decisions through data clarity.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-zinc-800">
                                <div className="flex gap-4">
                                    <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-zinc-100">Data Analysis</h3>
                                        <p className="text-sm text-zinc-500">SQL, Python, statistical modeling</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <BarChart3 className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-zinc-100">Visualization</h3>
                                        <p className="text-sm text-zinc-500">Power BI, dashboards, insights</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-zinc-100">Optimization</h3>
                                        <p className="text-sm text-zinc-500">Efficiency, automation, strategy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-20 px-4 bg-zinc-800/20 border-t border-b border-zinc-800 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="mb-12"
                        >
                            <h2 className="text-4xl font-bold text-zinc-100 mb-4">Featured Projects</h2>
                            <p className="text-zinc-400">Explore my data analysis work across various domains</p>
                        </motion.div>
                        <PortfolioGrid />
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-zinc-100 mb-4">Let's Connect</h2>
                            <p className="text-zinc-400">Ready to discuss your data analytics needs?</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-8"
                            >
                                <h3 className="text-lg font-semibold text-zinc-100 mb-6">Send me a message</h3>
                                <ContactForm />
                            </motion.div>

                            {/* Info & Links */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">Get my resume</h3>
                                    <a
                                        href="/resume.pdf"
                                        download
                                        className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-tranzinc-y-0.5"
                                    >
                                        Download Resume
                                    </a>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">Connect on social</h3>
                                    <div className="flex gap-4">
                                        <a
                                            href="https://www.linkedin.com/in/jeffrey-usman-a0b953352"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 rounded-lg border border-zinc-700 hover:border-blue-400 hover:bg-blue-400/10 transition-all"
                                            aria-label="LinkedIn"
                                        >
                                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-blue-400">
                                                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://github.com/jeffrey-wonder06"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 rounded-lg border border-zinc-700 hover:border-blue-400 hover:bg-blue-400/10 transition-all"
                                            aria-label="GitHub"
                                        >
                                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-blue-400">
                                                <path d="M12 0c-6.63 0-12 5.37-12 12 0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576 4.765-1.587 8.2-6.086 8.2-11.384 0-6.63-5.373-12-12-12z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-700">
                                    <p className="text-sm text-zinc-500">
                                        Available for freelance projects and full-time opportunities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="border-t border-zinc-800 py-8 px-4 text-center text-sm text-zinc-500">
                    <p>&copy; {new Date().getFullYear()} Jeffrey Usman. All rights reserved.</p>
                </footer>
            </main>
        </>
    );
}
