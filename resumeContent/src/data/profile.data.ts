import { applyProfileTailoring } from './tailoring';

const baseSummary =
  "Technology leader with over a decade of experience in software architecture and engineering leadership. Modernizes complex systems, leads cross-functional teams, and designs scalable solutions across industries. Integrates AI across the software development lifecycle to turn business strategy into reliable delivery.";

const baseCompetencies = [
  {
    title: "Software Architecture",
    body: "Designs scalable, maintainable systems that balance business needs, technical constraints, and long-term sustainability.",
  },
  {
    title: "Technology Leadership",
    body: "Leads cross-functional engineering teams, sets technical direction, and drives delivery from planning through production.",
  },
  {
    title: "Enterprise Integration",
    body: "Connects complex systems through APIs, service-oriented architectures, and integration patterns that adapt to changing requirements.",
  },
  {
    title: "Systems Thinking",
    body: "Analyzes how systems, teams, and incentives interact to identify changes that improve outcomes across the organization.",
  },
  {
    title: "Development Practices",
    body: "Establishes engineering standards around code quality, testing, CI/CD, and maintainable software design.",
  },
  {
    title: "AI & Technology Modernization",
    body: "Modernizes legacy systems and applies AI across the software development lifecycle to accelerate delivery without compromising engineering standards.",
  },
];

// Named tools for ATS keyword matching. List only what the experience entries or their overlays back up.
export const technicalSkills = [
  { group: "Languages", items: ["C#", "TypeScript", "JavaScript", "SQL"] },
  { group: "Frameworks", items: [".NET", ".NET Core", "ASP.NET MVC", "Entity Framework", "React", "Kendo UI", "WinForms", "Unity"] },
  { group: "Cloud & DevOps", items: ["AWS", "Azure", "Azure Functions", "Azure DevOps", "CI/CD"] },
  { group: "Data & Integration", items: ["SQL Server", "PostgreSQL", "REST APIs", "Salesforce", "Stripe", "EHR integrations"] },
  { group: "Testing", items: ["xUnit", "Moq", "AutoFixture", "Jest", "Vitest", "Playwright"] },
  { group: "Practices", items: ["Multi-tenant SaaS", "HIPAA & PHI compliance", "AI-assisted SDLC", "Agile delivery", "Legacy modernization"] },
];

// Applies the tailoring overlay named by REACT_APP_TAILORING, if any. With no overlay these are the base values and targetRole is undefined.
const profile = applyProfileTailoring({ professionalSummary: baseSummary, coreCompetencies: baseCompetencies });

export const professionalSummary = profile.professionalSummary;
export const coreCompetencies = profile.coreCompetencies;
export const targetRole = profile.targetRole;
