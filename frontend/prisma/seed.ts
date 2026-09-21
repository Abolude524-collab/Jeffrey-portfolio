import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "jeffreyusman@gmail.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Jeffrey Usman",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Jeffrey Usman",
      role: "admin",
    },
  });
  console.log(`✓ Admin user seeded (${adminEmail})`);

  // 2. Seed Profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: "Jeffrey Usman",
        title: "Data Analyst",
        bio: "Expert data analyst specialized in SQL, Power BI, and Python. I uncover hidden patterns, clean complex datasets, and drive business impact through analytical clarity.",
        email: "jeffreyusman@gmail.com",
        githubUrl: "https://github.com/jeffrey-wonder06",
        linkedinUrl: "https://www.linkedin.com/in/jeffrey-usman-a0b953352",
        resumeUrl: "/resume.pdf",
      },
    });
    console.log("✓ Profile seeded");
  }

  // 3. Seed Projects (Migrated from backend/data/projects.json & enriched case studies)
  const projects = [
    {
      title: "Sales Data Cleaning & Power BI Dashboard",
      slug: "sales-performance-analysis",
      shortDescription: "Transformed raw sales data across 3 regional sources and built an interactive Power BI dashboard for executive decision-making.",
      category: "Data Analysis",
      tags: ["SQL", "PowerBI", "Pandas", "Python", "Data Cleaning"],
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      problem: "The client had inconsistent sales data across multiple regional sources, missing entries, and duplicate records, making it difficult to track revenue performance and identify seasonal trends.",
      objective: "Clean, combine, and model 50,000+ sales transaction rows into a single source of truth, then build an executive Power BI dashboard with drill-down capabilities.",
      dataset: "Raw sales CSVs from 3 regions containing 50k+ rows with inconsistent date formats, missing customer values, and regional currency differences.",
      methodology: `1. Removed duplicate records and handled missing values using Python Pandas.
2. Standardized date and currency formats across regional datasets.
3. Executed SQL UNION and JOIN queries to construct a unified star-schema data warehouse.
4. Modeled DAX measures in Power BI for YoY growth, conversion rate, and revenue per unit.`,
      insights: "Identified underperforming regions (15% below quarterly target) and discovered high-margin Q4 seasonal demand surges, allowing targeted inventory allocation.",
      results: "Optimized inventory planning, reduced data processing overhead by 40%, and enabled real-time executive visibility into regional KPIs.",
      challenges: "Reconciling conflicting date formats and missing customer IDs without distorting historical trend reporting.",
      featured: true,
      published: true,
      displayOrder: 1,
      githubUrl: "https://github.com/jeffrey-wonder06",
    },
    {
      title: "Customer Churn Analysis with Python & SQL",
      slug: "telecom-customer-churn-analysis",
      shortDescription: "Analyzed telecom subscriber churn data, conducted exploratory data analysis with Pandas & SQL, and delivered predictive retention strategies.",
      category: "Predictive Analytics",
      tags: ["SQL", "Python", "Pandas", "Statistics", "Machine Learning"],
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      problem: "High annual churn rate (28%) in telecom subscriber base was severely eroding customer lifetime value and recurring monthly revenue.",
      objective: "Identify the primary drivers of subscriber cancellation and segment high-risk customers to inform targeted retention campaigns.",
      dataset: "Customer records with 20+ features including tenure, support ticket frequency, billing history, payment methods, and monthly charges (25,000 customers).",
      methodology: `1. Imputed missing usage data with median values and handled outliers using IQR trimming.
2. Engineered new features including 'days since last ticket' and 'tenure ratio'.
3. Built SQL aggregation queries and conducted correlation matrix analysis in Python.
4. Fitted a Logistic Regression model to calculate individual churn probability scores.`,
      insights: "Discovered that month-to-month contract holders paying via electronic check had 3x higher churn rate, exacerbated by frequent unresolved support tickets.",
      results: "Predicted high-risk churners with 82% precision. Proposed contract incentive packages projected to cut churn by 12% annually.",
      challenges: "Imbalanced dataset with majority non-churners required SMOTE resampling for accurate model training.",
      featured: true,
      published: true,
      displayOrder: 2,
      githubUrl: "https://github.com/jeffrey-wonder06",
    },
    {
      title: "E-Commerce Analytics & Behavior Dashboard",
      slug: "ecommerce-analytics-dashboard",
      shortDescription: "Engineered a unified data pipeline and interactive analytics dashboard to evaluate user conversion funnels and product catalog performance.",
      category: "Business Intelligence",
      tags: ["SQL", "PowerBI", "Data Modeling", "Excel"],
      coverImage: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=600&fit=crop",
      problem: "E-commerce platform lacked a centralized system to connect user behavior logs, ad campaign performance, and product order fulfillment.",
      objective: "Build a robust star-schema relational model in SQL and present conversion funnel insights in Power BI.",
      dataset: "100,000+ transaction records, Google Analytics traffic logs, product catalog tables, and marketing spend metrics.",
      methodology: `1. Filtered out internal test orders and validated currency conversions across international transactions.
2. Built a relational star-schema with FactSales and Dimension tables (Customer, Product, Date, Campaign).
3. Created interactive Power BI visualizations with dynamic date filtering and cohort analysis.`,
      insights: "Mobile visitors generated 60% of total site traffic but had a 40% lower conversion rate than desktop users, despite maintaining higher Average Order Value (AOV).",
      results: "Guided mobile checkout UX redesign and targeted retargeting campaigns, yielding an 18% increase in mobile order revenue within 60 days.",
      challenges: "Handling large session event logs while preserving smooth dashboard interactive filtering response times.",
      featured: true,
      published: true,
      displayOrder: 3,
      githubUrl: "https://github.com/jeffrey-wonder06",
    }
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log(`✓ ${projects.length} projects seeded`);

  // 4. Seed Skills
  const skills = [
    { name: "SQL", category: "Data Analysis", proficiency: 95, order: 1 },
    { name: "Python", category: "Data Analysis", proficiency: 90, order: 2 },
    { name: "Pandas & NumPy", category: "Data Analysis", proficiency: 90, order: 3 },
    { name: "Excel & Advanced Formulas", category: "Data Analysis", proficiency: 95, order: 4 },
    { name: "Power BI", category: "Data Visualization", proficiency: 92, order: 5 },
    { name: "Tableau", category: "Data Visualization", proficiency: 85, order: 6 },
    { name: "Matplotlib & Seaborn", category: "Data Visualization", proficiency: 88, order: 7 },
    { name: "PostgreSQL & MySQL", category: "Database", proficiency: 90, order: 8 },
    { name: "Exploratory Data Analysis (EDA)", category: "Business Intelligence", proficiency: 95, order: 9 },
    { name: "Data Cleaning & Wrangling", category: "Business Intelligence", proficiency: 95, order: 10 },
    { name: "A/B Testing & Statistics", category: "Business Intelligence", proficiency: 85, order: 11 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name },
    });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log(`✓ ${skills.length} skills seeded`);

  // 5. Seed Experience
  const experiences = [
    {
      role: "Senior Data Analyst",
      organization: "Freelance / Analytics Consultant",
      location: "Remote",
      startDate: "2024",
      endDate: "Present",
      current: true,
      description: "Delivering end-to-end data analytics solutions, BI dashboards, and data cleaning pipelines for commercial clients.",
      bulletPoints: [
        "Architected custom SQL queries and Power BI dashboards to track client sales KPIs across multi-channel platforms.",
        "Performed customer churn analysis and exploratory data analysis using Python Pandas, identifying revenue leakage points.",
        "Automated weekly reporting pipelines, saving clients over 10 hours per week in manual spreadsheet manipulation.",
      ],
      order: 1,
    },
    {
      role: "Data Analyst / Web Developer",
      organization: "Tech Solutions",
      location: "Lagos, Nigeria",
      startDate: "2023",
      endDate: "2024",
      current: false,
      description: "Built web applications and managed database operations, transitioning into full-time data analytics.",
      bulletPoints: [
        "Designed relational database schemas and optimized complex SQL query execution times.",
        "Built internal reporting tools and dashboards to monitor system usage metrics.",
      ],
      order: 2,
    },
  ];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({
      where: { role: exp.role, organization: exp.organization },
    });
    if (!existing) {
      await prisma.experience.create({ data: exp });
    }
  }
  console.log(`✓ ${experiences.length} experience entries seeded`);

  // 6. Seed Certifications
  const certifications = [
    {
      title: "Google Data Analytics Professional Certificate",
      issuer: "Coursera / Google",
      issueDate: "2024",
      credentialUrl: "https://coursera.org",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      order: 1,
    },
    {
      title: "Microsoft Certified: Power BI Data Analyst Associate",
      issuer: "Microsoft",
      issueDate: "2024",
      credentialUrl: "https://learn.microsoft.com",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
      order: 2,
    },
    {
      title: "SQL & Relational Database Management",
      issuer: "DataCamp",
      issueDate: "2023",
      credentialUrl: "https://datacamp.com",
      imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop",
      order: 3,
    },
  ];

  for (const cert of certifications) {
    const existing = await prisma.certification.findFirst({
      where: { title: cert.title },
    });
    if (!existing) {
      await prisma.certification.create({ data: cert });
    }
  }
  console.log(`✓ ${certifications.length} certifications seeded`);

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
