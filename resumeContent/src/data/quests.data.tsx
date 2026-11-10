// src/data/quests.data.tsx

import { applyQuestTailoring } from './tailoring';

export interface Quest {
  id: number;
  titles: {
    retro: string;
    sleek: string;
  };
  company?: string;
  workTitle: string; // Shared field
  description: string;
  summary?:string;
  accomplishments: Accomplishment[];
  type: 'career' | 'hobby' | 'education' | 'independent';
  startDate: Date;
  endDate: Date;
  roles: string[];
  tags?: string[];       // New property to help with filtering and categorization
  externalLink?: string; // Optional external reference (e.g., project or company website)
}

export interface Accomplishment {
  key: string;        // Stable id within its quest. Tailoring overlays refer to this, never to the wording.
  description: string;
  role: string;       // Role in which it was achieved
  learnings: string[]; // What was learned or the 'reward' achieved
}

export const baseQuests: Quest[] = [
{
  id: 1,
  titles: {
    retro: 'The Platform Manager',
    sleek: 'Manager, Experience Platform at Progyny',
  },
  company: 'Progyny',
  workTitle: 'Manager, Experience Platform',
  description:
    "Hired and lead a team modernizing Progyny's benefits platform for 7 million covered lives",
  summary:
    "I hired my own team here. Beyond that team, I've helped shape the SDLC practices the wider engineering organization works by.",
  type: 'career',
  startDate: new Date('2025-05-01'),
  endDate: new Date(2038, 2, 10), // Ongoing
  roles: ['Manager, Experience Platform'],
  tags: ['Engineering Management', 'Healthcare', 'HIPAA', 'Identity/Auth', 'Platform Architecture', 'AI-Assisted Development', 'Software Development'],
  accomplishments: [
    {
      key: 'ai-sdlc',
      description:
        'Introduced AI-assisted SDLC practices with PHI safeguards across five projects, folding institutional knowledge, architectural guidance, and code review feedback into workflows the team could repeat.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that AI-assisted workflows require careful guardrails in healthcare contexts',
        'Discovered that structured redaction standards enable AI productivity while maintaining HIPAA compliance',
      ],
    },
    {
      key: 'team',
      description:
        'Hired and led a five-engineer team owning authentication, content, Salesforce integrations, enrollment, and eligibility.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that managing platform-critical systems requires balancing feature delivery with system reliability',
        'Discovered that clear capability boundaries help teams maintain focus and reduce cross-team dependencies',
      ],
    },
    {
      key: 'architects',
      description:
        'Worked with the enterprise architects to find gaps in the architecture and turned their guidance into specs engineers could build from.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that translating architecture decisions into actionable requirements closes the gap between design and delivery',
        'Discovered that early gap analysis with architects prevents costly rework across dependent teams',
      ],
    },
    {
      key: 'planning',
      description:
        'Coordinated planning across seven engineering teams for the new platform and designed the solutions for 30% of its stories.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that breaking ambiguity into structured planning artifacts accelerates team alignment',
        'Discovered that hands-on solution design across team boundaries keeps program delivery coherent',
      ],
    },
    {
      key: 'vendors',
      description:
        'Led vendor evaluations and the configuration platform design with HIPAA in scope, weighing compliance and cost against how easy each choice would be to change later.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that adapter patterns provide flexibility while maintaining compliance boundaries',
        'Discovered that BAA boundaries and PHI routing rules must be designed into architecture from the start',
      ],
    },
    {
      key: 'delivery',
      description:
        'Delivered over 90% of refined work within two weeks, with the technical design done before the team picked it up.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that clear technical design upfront shortens refinement-to-delivery cycles',
        'Discovered that team execution improves when work is refined with explicit design intent',
      ],
    },
  ],
},
{
  id: 2,
  titles: {
    retro: 'Rise of the Architect',
    sleek: 'Senior Software Architect at Inspire11',
  },
  company: 'Inspire11',
  workTitle: 'Senior Software Architect',
  description:
    'Led software architecture across five engineering teams, improving technical consistency and delivery performance.',
  summary:
    'A year as the architect several teams leaned on at once. Most days went to keeping five teams building one product the same way.',
  type: 'career',
  startDate: new Date('2024-05-01'),
  endDate: new Date('2025-05-17'),
  roles: ['Senior Software Architect'],
  tags: ['Architecture', 'Leadership', 'UI Design', 'Cross-Team Collaboration', 'Software Development'],
  accomplishments: [
    {
      key: 'component-library',
      description:
        'Built a shared component library from the Figma designs that sped up delivery across teams and secured a $2M project extension.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned that component libraries still deliver value even when implemented late in a project',
        'Discovered that reusable design systems can unlock measurable commercial outcomes',
      ],
    },
    {
      key: 'ui-architecture',
      description:
        'Set the UI architecture and implementation standards for five engineering teams while staying hands-on as full-stack architect for one of them.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned architectural effectiveness requires balancing team autonomy with system-wide consistency',
        'Found that specialized depth and broad oversight can be balanced through effective delegation',
      ],
    },
    {
      key: 'mentoring',
      description:
        'Mentored senior developers on the architecture and on delivering against it.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned that deliberate mentorship strengthens engineering capability across teams',
      ],
    },
    {
      key: 'requirements',
      description:
        'Turned business requirements into designs, specs, and stories the teams could pick up and build.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned that translating requirements into architecture and stories closes the gap between business intent and delivery',
      ],
    },
    {
      key: 'velocity',
      description:
        'Raised team velocity by 40% and kept it there through architecture changes and simpler development workflows.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned that maximizing team velocity requires teams to understand strategic direction and implementation goals',
        'Discovered that architectural clarity compounds into sustained delivery gains',
      ],
    },
  ],
},
{
  id: 3,
  titles: {
    retro: "The Modernizer's Quest",
    sleek: 'Software Architect at Productive Edge',
  },
  company: 'Productive Edge',
  workTitle: 'Software Architect',
  description:
    'Modernized legacy healthcare and commerce systems for consulting clients, leading cross-functional teams from architecture through delivery.',
  summary:
    "Four years of consulting. Every few months brought a new client and a new codebase, often in a stack I hadn't used before.",
  type: 'career',
  startDate: new Date('2020-02-01'),
  endDate: new Date('2024-05-31'),
  roles: ['Software Architect'],
  tags: ['Legacy Modernization', 'Cloud', 'SaaS', 'Healthcare', 'Payment Processing', 'Software Development'],
  accomplishments: [
    {
      key: 'engagements',
      description:
        'Ran 16 client engagements end to end, owning budgets up to $250K along with scope, delivery, and client expectations.',
      role: 'Software Architect',
      learnings: [
        'Learned to ground stories in facts and data that the client cares about',
        'Discovered that owning budget and scope alongside technical delivery builds client trust',
      ],
    },
    {
      key: 'stack',
      description:
        'Owned the architecture on every engagement in whatever stack the client ran, including several I had not worked in before.',
      role: 'Software Architect',
      learnings: [
        'Learned to be proficient in architecting for a language I was not well-versed in',
      ],
    },
    {
      key: 'claims',
      description:
        'Cut maintenance costs by 30% by modernizing a claims application across the full stack, keeping it HIPAA compliant throughout.',
      role: 'Software Architect',
      learnings: [
        'Learned that healthcare data practices impact technical decisions and constraints',
        'Learned that compliance requirements should be considered in reusable patterns',
      ],
    },
    {
      key: 'saas-rebuild',
      description:
        'Rebuilt a monolithic healthcare application as a multi-tenant SaaS platform for 15 tenants with up to 50K users each, without breaking its EHR integrations.',
      role: 'Software Architect',
      learnings: [
        'Learned that multi-tenant architectures can be effectively handled through configuration',
        'Discovered that maintaining EHR integrations during architectural transitions requires careful API design',
      ],
    },
    {
      key: 'payments',
      description:
        "Certified a client's commerce system with a third-party payment processor so its applications could take payments securely.",
      role: 'Software Architect',
      learnings: [
        'Learned how to build IdP integrations from the ground up',
      ],
    },
    {
      key: 'scaffolding',
      description:
        'Built standard project scaffolding that let new projects deploy to production on day one instead of spending a sprint on setup.',
      role: 'Software Architect',
      learnings: [
        'Learned that project templates work easier when teams build working relationships',
        'Learned that standardization must balance consistency with flexibility for project-specific needs',
      ],
    },
  ],
},
{
  id: 4,
  titles: {
    retro: 'Leadership and Code',
    sleek: 'Team Lead / Interim Director of Engineering at Lendr',
  },
  company: 'Lendr',
  workTitle: 'Team Lead / Interim Director of Engineering',
  description:
    'Refactored a 350k-line lending platform, then led engineering through an executive transition',
  summary:
    'I joined as a team lead while sprint velocity was running negative. When the director of engineering was let go, I stepped in as interim director until the company hired a CTO.',
  type: 'career',
  startDate: new Date('2018-10-01'),
  endDate: new Date('2020-02-01'),
  roles: ['Team Lead', 'Interim Director of Engineering'],
  tags: ['Leadership', 'Engineering Transition', 'Performance Optimization', 'Technical Strategy', 'Software Development'],
  accomplishments: [
    {
      key: 'ceo-investors',
      description:
        'Represented engineering to the CEO and investors through the executive transition and advised them on technical strategy.',
      role: 'Interim Director of Engineering',
      learnings: [
        'Learned that technical leadership requires communication as much as technical proficiency',
        'Learned how to communicate to leaders what outcomes to expect from the technical department',
      ],
    },
    {
      key: 'kpis',
      description:
        'Hit the KPI targets as interim director while managing the team and onboarding the incoming CTO.',
      role: 'Interim Director of Engineering',
      learnings: [
        'Learned that maintaining performance metrics during transitions requires clear communication and delegation',
        'Discovered that effective onboarding of new leadership benefits from structured knowledge transfer',
      ],
    },
    {
      key: 'refactor',
      description:
        'Refactored a 350k-line business application onto a service-repository pattern and turned sprint velocity from negative back to positive.',
      role: 'Team Lead',
      learnings: [
        'Learned how to perform every function of and be involved in most decisions for the SDLC',
        'Learned how to build a culture of technical excellence for a small team',
      ],
    },
    {
      key: 'dotnet-core',
      description:
        'Moved the applications from .NET to .NET Core on day one, improving performance and setting the technical direction for the team.',
      role: 'Team Lead',
      learnings: [
        'Learned how to read code for intent and clarity very effectively',
        'Learned how to effectively leverage pair programming with other team members',
      ],
    },
    {
      key: 'co-led',
      description:
        'Co-led the technical work after the director left, so development kept moving until the new CTO started.',
      role: 'Interim Director of Engineering',
      learnings: [
        'Learned that technical leadership requires communication as much as technical proficiency',
      ],
    },
    {
      key: 'uat',
      description:
        'Set up a structured UAT process where business stakeholders tested features against their own priorities, and feature quality went up.',
      role: 'Team Lead',
      learnings: [
        'Learned the importance of talking directly to end users',
        'Learned that educating our business on technical practices positively impacted velocity',
      ],
    },
    {
      key: 'architects',
      description:
        'Worked with the senior architects to roll out a product-wide strategy and hold the code to its standards.',
      role: 'Team Lead',
      learnings: [],
    },
    {
      key: 'regulatory',
      description:
        'Built regulatory requirements into the technical work, cutting defects and clearing the way for new features.',
      role: 'Team Lead',
      learnings: [
        'Learned that regulatory compliance should be built into development processes rather than added as an afterthought',
        'Discovered that early consideration of regulatory requirements prevents costly refactoring later',
      ],
    },
  ],
},
{
  id: 5,
  titles: {
    retro: "The Solo Developer's Journey",
    sleek: 'Senior Consultant at SWC Technology Partners',
  },
  company: 'SWC Technology Partners',
  workTitle: 'Senior Consultant',
  description:
    "Delivered legacy WinForms modernization solo, holding estimates inside 10 percent",
  summary:
    "A year of solo delivery on legacy desktop systems. It was the first engagement where I owned the estimate as well as the build.",
  type: 'career',
  startDate: new Date('2017-10-01'),
  endDate: new Date('2018-10-01'),
  roles: ['Senior Consultant'],
  tags: ['Desktop Applications', 'UI Enhancement', 'Project Estimation', 'Software Development'],
  accomplishments: [
    {
      key: 'estimates',
      description:
        "Held project estimates within a 10 percent margin across the engagement.",
      role: 'Senior Consultant',
      learnings: [
        "Learned that estimate accuracy tracks how well I understood the requirement, not the technique",
      ],
    },
{
      key: 'winforms',
      description:
        "Modernized WinForms desktop applications with Kendo UI, fitting current interfaces onto a framework not built for them.",
      role: 'Senior Consultant',
      learnings: [
        "I learned how to balance modern UI expectations with legacy application constraints",
      ],
    },
{
      key: 'automation',
      description:
        "Built and refined automation scripts the delivery schedule ran on and raised problems early.",
      role: 'Senior Consultant',
      learnings: [
        "Learned that raising a problem early costs credibility and raising it late costs the schedule",
      ],
    },
],
},
{
  id: 6,
  titles: {
    retro: "The Developer's Forge",
    sleek: 'Developer at Manor Resources',
  },
  company: 'Manor Resources',
  workTitle: 'Developer',
  description:
    "Built features and test coverage for car loan application under senior mentorship",
  summary:
    "A year of feature work on a car loan application, early on. Senior developers read what I wrote closely, and most of the teaching happened in code review.",
  type: 'career',
  startDate: new Date('2016-08-01'),
  endDate: new Date('2017-09-01'),
  roles: ['Developer'],
  tags: ['Software Development', 'Mentorship', 'Testing', 'Financial Applications'],
  accomplishments: [
    {
      key: 'features',
      description:
        "Built core feature components for a car loan application under senior mentorship.",
      role: 'Developer',
      learnings: [],
    },
    {
      key: 'testing',
      description:
        "Raised test coverage with AutoFixture and Moq.",
      role: 'Developer',
      learnings: [
        "Learned that well-designed test fixtures do more for coverage than more tests do",
      ],
    },
    {
      key: 'mentorship',
      description:
        "Worked under senior-developer mentorship delivered in code review.",
      role: 'Developer',
      learnings: [
        "Learned that code review teaches what self-directed study cannot, because it arrives attached to a mistake I already made",
      ],
    },
  ],
},
{
  id: 7,
  titles: {
    retro: 'Aerospace Foundations',
    sleek: 'ITCFP Participant / Developer at The Boeing Company',
  },
  company: 'The Boeing Company',
  workTitle: 'ITCFP Participant / Developer',
  description:
    "Rotated through IT functions on selective program, then built C# applications for financial operations",
  summary:
    "Four years on the IT Career Foundation Program, a selective rotation through several IT functions before I settled into development work on financial operations systems.",
  type: 'career',
  startDate: new Date('2012-06-01'),
  endDate: new Date('2016-08-01'),
  roles: ['ITCFP Participant', 'Developer'],
  tags: ['IT Fundamentals', 'Software Development', 'Automation', 'Financial Operations'],
  accomplishments: [
    {
      key: 'rotation',
      description:
        "Rotated through multiple IT functions on the selective IT Career Foundation Program, then built C# applications for financial operations.",
      role: 'ITCFP Participant',
      learnings: [
        "Learned how technology choices affect different business units in distinct ways",
      ],
    },
    {
      key: 'mvc-apps',
      description:
        "Built and deployed C# MVC applications that automated financial operations and met the validation and audit requirements those systems carried.",
      role: 'Developer',
      learnings: [
        "Learned that enterprise scale moves the cost from writing software to maintaining it",
      ],
    },
    {
      key: 'sdlc',
      description:
        "Improved SDLC practices on each team the rotation passed through.",
      role: 'Developer',
      learnings: [],
    },
  ],
},
{
  id: 8,
  titles: {
    retro: 'The Solo Forge',
    sleek: 'Independent Projects',
  },
  company: 'Personal Project',
  workTitle: 'Independent Projects',
  description:
    "Directed AI through two functional Unity games",
  summary:
    "Solo direction of two Unity games.",
  type: 'hobby',
  startDate: new Date('2025-04-29'),
  endDate: new Date(2038, 2, 10), // Ongoing
  roles: ['Game Developer'],
  tags: ['Unity', 'C#', 'Game Development', 'Software Architecture', 'AI-Assisted Development', 'Personal Project', 'Software Development'],
  accomplishments: [
    {
      key: 'games',
      description:
        "Checked in nearly 500 commits across two Unity games: a playable tactical puzzle I stopped after a market analysis, and a wave-defense FPS still in progress.",
      role: 'Game Developer',
      learnings: [
        "Learned that writing the market analysis was the decision, not a document that preceded one",
      ],
    },
    {
      key: 'build-constraints',
      description:
        "Specified the architecture and put the constraints in the build, so AI-written code failed automatically when it crossed a boundary.",
      role: 'Game Developer',
      learnings: [
        "Learned that a rule a person has to remember to run documents violations rather than preventing them",
      ],
    },
    {
      key: 'ai-implementation',
      description:
        "Used AI to write the implementation of over 600 C# files I reviewed and gated through play test or audit findings.",
      role: 'Game Developer',
      learnings: [
        "Learned to write the failure back into the next session's rules",
      ],
    },
  ],
},
{
  id: 10,
  titles: {
    retro: "The Scholar's Path",
    sleek: "Education"
  },
  company: "California State University Fullerton",
  workTitle: "Bachelor of Science in Computer Science",
  description: "Concentration: Software Architecture",
  summary: "I studied Computer Science and concentrated in software architecture.",
  accomplishments: [
    {
      key: 'degree',
      description: "B.S. Computer Science, Concentration: Software Architecture",
      role: "Student",
      learnings: ["Software Architecture", "Computer Science"]
    }
  ],
  type: "education",
  startDate: new Date("2006-08-01"),
  endDate: new Date("2012-05-31"),
  roles: ["Student"],
  tags: ["Education", "Degree"]
},
{
  id: 11,
  titles: {
    retro: "The Portfolio Advisor's Quest",
    sleek: "Principal Technologist for a Hedge Fund Company"
  },
  company: "Independent Consulting, Enterprise Architect",
  workTitle: "Principal Technologist",
  description: "Assessed a hedge fund software suite over a four-month engagement",
  summary: "The CEO of Lendr hired me directly to look at another of his companies, where technical problems were showing up in the KPIs. I had four months and no prior context, so the whole engagement came down to what could be learned from a sample rather than a full read.",
  type: "independent",
  startDate: new Date("2022-03-01"),
  endDate: new Date("2022-06-30"),
  roles: ["Principal Technologist"],
  tags: ["Code Analysis", "Technical Strategy", "Executive Advisory", "Performance Optimization", "Software Development"],
  accomplishments: [
    {
      key: 'solid-review',
      description: "Sampled the hedge fund software suite against SOLID and tied each structural finding to a KPI miss.",
      role: "Principal Technologist",
      learnings: [
        "Learned that sampling code can effectively reveal patterns that apply to the broader codebase"
      ]
    },
    {
      key: 'recommendations',
      description: "Delivered a recommendations deck to the executive team with phased remediation, KPI-moving changes first.",
      role: "Principal Technologist",
      learnings: [
        "Learned that a finding framed as a KPI ceiling gets funded where the same finding framed as technical debt only gets acknowledged"
      ]
    }
  ]
},
{
  id: 12,
  titles: {
    retro: "The Patent Sequence Expedition",
    sleek: "Principal Technologist for a Biotech Patent Intelligence Startup"
  },
  company: "Independent Consulting, Principal Technologist",
  workTitle: "Principal Technologist",
  description: "Built the product full stack and advised founders on technical direction",
  summary: "The founders brought me in for direction. I stayed and built the application.",
  type: "independent",
  startDate: new Date("2024-03-01"),
  endDate: new Date(2038, 2, 10), // Ongoing
  roles: ["Principal Technologist"],
  tags: ["Patent Intelligence", "Biotech", "Azure Functions", "React", "TypeScript", "C#", "Technical Leadership", "Software Development"],
  accomplishments: [
    {
      key: 'advising',
      description: "Advised the founders on technical direction, including stopping an identity-provider migration and restoring the prior stack from source control.",
      role: "Principal Technologist",
      learnings: [
        "Learned that an undocumented intermediate state is debt nobody agreed to carry"
      ]
    },
    {
      key: 'search',
      description: "Built sequence search, patent-family navigation, and document retrieval across the API and the UI.",
      role: "Principal Technologist",
      learnings: [
        "Learned that grouping results by patent family changed what the tool was good for"
      ]
    },
    {
      key: 'sign-in',
      description: "Built sign-in and enforced plan limits on the server.",
      role: "Principal Technologist",
      learnings: [
        "Learned that a CI job inheriting the deploy variable group tests against production configuration and proves nothing"
      ]
    },
    {
      key: 'saved-searches',
      description: "Built saved searches and the trial and paid-plan screens used to demo the product.",
      role: "Principal Technologist",
      learnings: []
    }
  ]
}
];

// Applies the tailoring overlay named by REACT_APP_TAILORING, if any. With no overlay this is baseQuests unchanged.
const quests = applyQuestTailoring(baseQuests);

export default quests;
