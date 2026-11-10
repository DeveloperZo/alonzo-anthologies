import { applyProfileTailoring } from './tailoring';

const baseSummary =
  "Technology leader with over a decade of experience in leveraging software architecture and engineering principles. Modernizes complex systems, leads cross-functional teams, and designs scalable solutions across industries. Integrates AI across the software development lifecycle to turn business strategy into reliable delivery.";

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

// The resume's one Skills section: each competency theme with the named tools behind it, for ATS keyword matching.
// List only what the experience entries or their overlays back up. The prose competencies above feed the site's timeline.
export const skills = [
  { group: "Leadership", items: ["Engineering management", "Hiring engineering teams", "Cross-team planning", "Technical leadership", "Executive communication"] },
  { group: "Architecture", items: ["Microservices", "Multi-tenant", "SOA", "CQRS (command query responsibility segregation)"] },
  { group: "Languages & Frameworks", items: ["C#", "TypeScript", "JavaScript", "SQL", ".NET", "Python", "Entity Framework", "React"] },
  { group: "Cloud, Data & DevOps", items: ["Azure Cloud","AWS Cloud", "CI/CD", "SQL Server", "PostgreSQL"] },
  { group: "Quality & Compliance", items: ["Automated testing", "HIPAA & PHI compliance", "Agile delivery"] },
  { group: "AI & Modernization", items: ["AI-assisted SDLC (Claude, Codex, Cursor)", "Legacy modernization"] },
];

// Applies the tailoring overlay named by REACT_APP_TAILORING, if any. With no overlay these are the base values and targetRole is undefined.
const profile = applyProfileTailoring({ professionalSummary: baseSummary, coreCompetencies: baseCompetencies });

export const professionalSummary = profile.professionalSummary;
export const coreCompetencies = profile.coreCompetencies;
export const targetRole = profile.targetRole;
