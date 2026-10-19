// src/data/quests.data.tsx

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
  description: string;
  role: string;       // Role in which it was achieved
  learnings: string[]; // What was learned or the 'reward' achieved
}

const quests: Quest[] = [
{
  id: 1,
  titles: {
    retro: 'The Platform Manager',
    sleek: 'Manager, Experience Platform at Progyny',
  },
  company: 'Progyny',
  workTitle: 'Manager, Experience Platform',
  description:
    "Lead an engineering team modernizing Progyny's benefits platform, serving approximately 7.2 million covered lives.",
  summary:
    "Lead an engineering team modernizing Progyny's benefits platform, serving approximately 7.2 million covered lives.",
  type: 'career',
  startDate: new Date('2025-05-01'),
  endDate: new Date(2038, 2, 10), // Ongoing
  roles: ['Manager, Experience Platform'],
  tags: ['Engineering Management', 'Healthcare', 'HIPAA', 'Identity/Auth', 'Platform Architecture', 'AI-Assisted Development'],
  accomplishments: [
    {
      description:
        'Introduced AI-assisted development practices with PHI safeguards across five projects, folding institutional knowledge, architectural guidance, and code review feedback into workflows the team could repeat.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that AI-assisted workflows require careful guardrails in healthcare contexts',
        'Discovered that structured redaction standards enable AI productivity while maintaining HIPAA compliance',
      ],
    },
    {
      description:
        'Built and led a five-engineer team owning authentication, content, Salesforce integrations, enrollment, and eligibility.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that managing platform-critical systems requires balancing feature delivery with system reliability',
        'Discovered that clear capability boundaries help teams maintain focus and reduce cross-team dependencies',
      ],
    },
    {
      description:
        'Partnered with enterprise architects to identify architectural gaps and translate technical guidance into actionable engineering specifications.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that translating architecture decisions into actionable requirements closes the gap between design and delivery',
        'Discovered that early gap analysis with architects prevents costly rework across dependent teams',
      ],
    },
    {
      description:
        'Coordinated planning across seven engineering teams for the new platform delivery, designing solutions for 30% of its stories.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that breaking ambiguity into structured planning artifacts accelerates team alignment',
        'Discovered that hands-on solution design across team boundaries keeps program delivery coherent',
      ],
    },
    {
      description:
        'Led HIPAA-aware vendor evaluations and configuration platform design, balancing compliance, cost, and long-term flexibility.',
      role: 'Manager, Experience Platform',
      learnings: [
        'Learned that adapter patterns provide flexibility while maintaining compliance boundaries',
        'Discovered that BAA boundaries and PHI routing rules must be designed into architecture from the start',
      ],
    },
    {
      description:
        'Delivered over 90% of refined work within two weeks through clear technical design and team execution.',
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
    'Led software architecture across five engineering teams, improving technical consistency and delivery performance.',
  type: 'career',
  startDate: new Date('2024-05-01'),
  endDate: new Date('2025-05-17'),
  roles: ['Senior Software Architect'],
  tags: ['Architecture', 'Leadership', 'UI Design', 'Cross-Team Collaboration'],
  accomplishments: [
    {
      description:
        'Secured a $2M project extension by building a shared design library, translating Figma designs into reusable components that accelerated delivery across teams.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned that component libraries still deliver value even when implemented late in a project',
        'Discovered that reusable design systems can unlock measurable commercial outcomes',
      ],
    },
    {
      description:
        'Led UI architecture across five engineering teams while serving as full-stack architect for one, aligning technical direction and implementation standards.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned architectural effectiveness requires balancing team autonomy with system-wide consistency',
        'Found that specialized depth and broad oversight can be balanced through effective delegation',
      ],
    },
    {
      description:
        'Mentored senior developers through pair programming and technical coaching, strengthening engineering capabilities across teams.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned that deliberate mentorship strengthens engineering capability across teams',
      ],
    },
    {
      description:
        'Translated business requirements into architectural designs, technical specifications, and actionable engineering stories.',
      role: 'Senior Software Architect',
      learnings: [
        'Learned that translating requirements into architecture and stories closes the gap between business intent and delivery',
      ],
    },
    {
      description:
        'Increased team velocity by a sustained 40% through architectural improvements, technical guidance, and streamlined development workflows.',
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
    'Modernized legacy healthcare and commerce systems for consulting clients, leading cross-functional teams from architecture through delivery.',
  type: 'career',
  startDate: new Date('2020-02-01'),
  endDate: new Date('2024-05-31'),
  roles: ['Software Architect'],
  tags: ['Legacy Modernization', 'Cloud', 'SaaS', 'Healthcare', 'Payment Processing'],
  accomplishments: [
    {
      description:
        'Managed 16 client engagements, owning budgets up to $250K, scope, technical delivery, and stakeholder expectations.',
      role: 'Software Architect',
      learnings: [
        'Learned to ground stories in facts and data that the client cares about',
        'Discovered that owning budget and scope alongside technical delivery builds client trust',
      ],
    },
    {
      description:
        'Delivered enterprise solutions across .NET/C#, Java Spring Boot, React, Angular, Flutter, and UWP.',
      role: 'Software Architect',
      learnings: [
        'Learned to be proficient in architecting for a language I was not well-versed in',
      ],
    },
    {
      description:
        'Reduced maintenance costs by 30% through full-stack modernization of a claims application while maintaining HIPAA compliance.',
      role: 'Software Architect',
      learnings: [
        'Learned that healthcare data practices impact technical decisions and constraints',
        'Learned that compliance requirements should be considered in reusable patterns',
      ],
    },
    {
      description:
        'Rebuilt a monolithic healthcare application as a multi-tenant SaaS platform supporting 15 tenants with up to 50K users each, while preserving EHR integrations.',
      role: 'Software Architect',
      learnings: [
        'Learned that multi-tenant architectures can be effectively handled through configuration',
        'Discovered that maintaining EHR integrations during architectural transitions requires careful API design',
      ],
    },
    {
      description:
        'Certified a client commerce system with a third-party payment processor, enabling secure payment processing across its applications.',
      role: 'Software Architect',
      learnings: [
        'Learned how to build IdP integrations from the ground up',
      ],
    },
    {
      description:
        'Enabled production deployments on the first day of projects through standardized scaffolding, eliminating the setup sprint other teams required.',
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
    'Co-led technical implementations and maintained clear communication during leadership transitions.',
  summary: 
    'Led critical platform migrations and major refactoring efforts that transformed application performance while providing technical leadership during organizational transitions. Established effective feedback mechanisms with stakeholders and represented technical concerns to executive leadership.',
  type: 'career',
  startDate: new Date('2018-10-01'),
  endDate: new Date('2020-02-01'),
  roles: ['Team Lead', 'Interim Director of Engineering'],
  tags: ['Leadership', 'Engineering Transition', 'Performance Optimization', 'Technical Strategy'],
  accomplishments: [
    {
      description:
        'Represented technical leadership to investors and the CEO during executive transitions, providing strategic guidance.',
      role: 'Interim Director of Engineering',
      learnings: [
        'Learned that technical leadership requires communication as much as technical proficiency',
        'Learned how to communicate to leaders what outcomes to expect from the technical department',
      ],
    },
    {
      description:
        'Achieved target KPIs as interim director, while onboarding incoming CTO and managing team.',
      role: 'Interim Director of Engineering',
      learnings: [
        'Learned that maintaining performance metrics during transitions requires clear communication and delegation',
        'Discovered that effective onboarding of new leadership benefits from structured knowledge transfer',
      ],
    },
    {
      description:
        'Refactored a complex business application with 350k+ lines of code, implementing service-repository patterns that reversed negative sprint velocity.',
      role: 'Team Lead',
      learnings: [
        'Learned how to perform every function of and be involved in most decisions for the SDLC',
        'Learned how to build a culture of technical excellence for a small team',
      ],
    },
    {
      description:
        'Upgraded applications from .NET to .NET Core on day one, immediately improving performance and establishing technical direction.',
      role: 'Team Lead',
      learnings: [
        'Learned how to read code for intent and clarity very effectively',
        'Learned how to effectively leverage pair programming with other team members',
      ],
    },
    {
      description:
        'Co-led technical implementations during leadership transitions, maintaining continuity between development and executive leadership.',
      role: 'Interim Director of Engineering',
      learnings: [
        'Learned that technical leadership requires communication as much as technical proficiency',
      ],
    },
    {
      description:
        'Established a structured UAT process aligning business stakeholders with development priorities, improving feature quality.',
      role: 'Team Lead',
      learnings: [
        'Learned the importance of talking directly to end users',
        'Learned that educating our business on technical practices positively impacted velocity',
      ],
    },
    {
      description:
        'Collaborated with senior architects to implement product-wide strategy and enforce technical standards.',
      role: 'Team Lead',
      learnings: [],
    },
    {
      description:
        'Aligned technical initiatives with regulatory requirements to reduce defects and prepare for new features.',
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
  tags: ['Desktop Applications', 'UI Enhancement', 'Project Estimation'],
  accomplishments: [
    {
      description:
        "Held project estimates within a 10 percent margin across the engagement.",
      role: 'Senior Consultant',
      learnings: [
        "Learned that estimate accuracy tracks how well I understood the requirement, not the technique",
      ],
    },
{
      description:
        "Modernized WinForms desktop applications with Kendo UI, fitting current interfaces onto a framework not built for them.",
      role: 'Senior Consultant',
      learnings: [
        "I learned how to balance modern UI expectations with legacy application constraints",
      ],
    },
{
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
  tags: ['Development', 'Mentorship', 'Testing', 'Financial Applications'],
  accomplishments: [
    {
      description:
        "Built core feature components for a car loan application under senior mentorship.",
      role: 'Developer',
      learnings: [],
    },
    {
      description:
        "Raised test coverage with AutoFixture and Moq.",
      role: 'Developer',
      learnings: [
        "Learned that well-designed test fixtures do more for coverage than more tests do",
      ],
    },
    {
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
  tags: ['IT Fundamentals', 'Development', 'Automation', 'Financial Operations'],
  accomplishments: [
    {
      description:
        "Rotated through multiple IT functions on the selective IT Career Foundation Program, then built C# applications for financial operations.",
      role: 'ITCFP Participant',
      learnings: [
        "Learned how technology choices affect different business units in distinct ways",
      ],
    },
    {
      description:
        "Built and deployed C# MVC applications that automated financial operations and met the validation and audit requirements those systems carried.",
      role: 'Developer',
      learnings: [
        "Learned that enterprise scale moves the cost from writing software to maintaining it",
      ],
    },
    {
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
  tags: ['Unity', 'C#', 'Game Development', 'Software Architecture', 'AI-Assisted Development', 'Personal Project'],
  accomplishments: [
    {
      description:
        "Checked in nearly 500 commits across two Unity games: a playable tactical puzzle I stopped after a market analysis, and a wave-defense FPS still in progress.",
      role: 'Game Developer',
      learnings: [
        "Learned that writing the market analysis was the decision, not a document that preceded one",
      ],
    },
    {
      description:
        "Specified the architecture and put the constraints in the build, so AI-written code failed automatically when it crossed a boundary.",
      role: 'Game Developer',
      learnings: [
        "Learned that a rule a person has to remember to run documents violations rather than preventing them",
      ],
    },
    {
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
  summary: "Completed undergraduate studies in Computer Science with focus on software architecture principles and practices.",
  accomplishments: [
    {
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
  tags: ["Code Analysis", "Technical Strategy", "Executive Advisory", "Performance Optimization"],
  accomplishments: [
    {
      description: "Sampled the hedge fund software suite against SOLID and tied each structural finding to a KPI miss.",
      role: "Principal Technologist",
      learnings: [
        "Learned that sampling code can effectively reveal patterns that apply to the broader codebase"
      ]
    },
    {
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
  tags: ["Patent Intelligence", "Biotech", "Azure Functions", "React", "TypeScript", "C#", "Technical Leadership"],
  accomplishments: [
    {
      description: "Advised the founders on technical direction, including stopping an identity-provider migration and restoring the prior stack from source control.",
      role: "Principal Technologist",
      learnings: [
        "Learned that an undocumented intermediate state is debt nobody agreed to carry"
      ]
    },
    {
      description: "Built sequence search, patent-family navigation, and document retrieval across the API and the UI.",
      role: "Principal Technologist",
      learnings: [
        "Learned that grouping results by patent family changed what the tool was good for"
      ]
    },
    {
      description: "Built sign-in and enforced plan limits on the server.",
      role: "Principal Technologist",
      learnings: [
        "Learned that a CI job inheriting the deploy variable group tests against production configuration and proves nothing"
      ]
    },
    {
      description: "Built saved searches and the trial and paid-plan screens used to demo the product.",
      role: "Principal Technologist",
      learnings: []
    }
  ]
}
];

export default quests;
