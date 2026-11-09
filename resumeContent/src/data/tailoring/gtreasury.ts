// src/data/tailoring/gtreasury.ts
// GTreasury (Ripple), Software Engineering Manager.
// Posting asks: SaaS platform leadership, C#/.NET with SQL Server and Entity Framework, deep Azure, API integrations.
// SQL Server and Entity Framework are named on the C#/.NET job entries. Azure Function Apps, Service Bus,
// Storage, and Key Vault are named on the consulting entry. No event-driven or on-call claims.
import type { Tailoring } from './types';

const gtreasury: Tailoring = {
  id: 'gtreasury',
  company: 'GTreasury (Ripple)',
  role: 'Software Engineering Manager',
  profile: {
    targetRole: 'Software Engineering Manager',
    professionalSummary:
      'Technology leader with over a decade of experience in software architecture and engineering leadership on SaaS platforms. Modernizes complex distributed systems, leads and mentors cross-functional teams, and designs scalable solutions across industries. Integrates AI across the software development lifecycle to turn business strategy into reliable delivery.',
    competencies: {
      'Technology Leadership':
        'Leads and mentors cross-functional engineering teams, sets technical direction, and drives delivery from planning through production.',
      'Enterprise Integration':
        'Connects complex systems through API integrations, deployments, and Azure infrastructure, with integration patterns that adapt to changing requirements.',
      'Development Practices':
        'Establishes Agile engineering standards around code quality, testing, CI/CD, and maintainable software design.',
    },
  },
  quests: {
    1: {
      description: 'Hired and lead a team of 5 rebuilding a SaaS benefits platform for 7M covered lives',
      order: ['team', 'delivery', 'planning', 'architects', 'ai-sdlc', 'vendors'],
      accomplishments: {
        team: {
          description:
            'Hired and led a five-engineer team owning authentication, content, Salesforce API integrations, enrollment, and eligibility.',
        },
      },
    },
    2: {
      order: ['ui-architecture', 'mentoring', 'requirements', 'velocity', 'component-library'],
    },
    3: {
      order: ['stack', 'saas-rebuild', 'engagements', 'scaffolding', 'claims', 'payments'],
      accomplishments: {
        stack: {
          description:
            'Owned the architecture on every engagement in whatever stack the client ran, from C#/.NET with SQL Server and Entity Framework to several I had not worked in before.',
        },
      },
    },
    4: {
      order: ['dotnet-core', 'refactor', 'uat', 'architects', 'regulatory', 'ceo-investors', 'kpis', 'co-led'],
      accomplishments: {
        'dotnet-core': {
          description:
            'Moved the C# applications from .NET to .NET Core on SQL Server and Entity Framework on day one, improving performance and setting the technical direction for the team.',
        },
      },
    },
    5: {
      accomplishments: {
        winforms: {
          description:
            'Modernized C# WinForms applications on SQL Server and Entity Framework with Kendo UI, fitting current interfaces onto a desktop framework not built for them.',
        },
      },
    },
    6: {
      accomplishments: {
        features: {
          description: 'Built C# feature components for a car loan application on SQL Server and Entity Framework, under senior mentorship.',
        },
      },
    },
    7: {
      accomplishments: {
        'mvc-apps': {
          description:
            'Built and deployed C# MVC applications on SQL Server and Entity Framework that automated financial operations and met the validation and audit requirements those systems carried.',
        },
      },
    },
    8: {
      order: ['games', 'ai-implementation', 'build-constraints'],
    },
    12: {
      description: 'Built Azure Function Apps using Service Bus, Storage, and Key Vault, and advised founders on direction',
      tags: ['Patent Intelligence', 'Biotech', 'Azure Function Apps', 'Azure Service Bus', 'Azure Storage', 'Azure Key Vault', 'React', 'TypeScript', 'C#', 'Technical Leadership'],
    },
  },
};

export default gtreasury;
