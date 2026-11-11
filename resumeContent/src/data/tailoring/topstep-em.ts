// src/data/tailoring/topstep-em.ts
// Topstep, Engineering Manager, Trading Platform.
// Posting asks: 2+ years of people or technical leadership with hiring and coaching across levels, 7+ years
// of software engineering, a hands-on .NET/C# and distributed systems background, AWS and containers,
// leading teams that own production systems, balancing delivery with technical investment, planning
// through change, communicating upward. Fintech and real-time messaging (SignalR) are preferred.
// People leadership and production ownership lead each entry. No Kubernetes, incident-response process,
// tracing or psychological safety claims: the resume data does not back them.
import type { Tailoring } from './types';

const topstepEm: Tailoring = {
  id: 'topstep-em',
  company: 'Topstep',
  role: 'Engineering Manager, Trading Platform',
  profile: {
    targetRole: 'Engineering Manager',
    professionalSummary:
      'Software engineering manager with a hands-on C#/.NET and distributed systems background and production ownership since 2016: deployments, incident response, on-call, and observability. Has led engineers at every level since 2018 and hires and coaches them, now on an AWS benefits platform for 7 million covered lives. Former interim director of engineering in fintech lending.',
  },
  quests: {
    1: {
      order: ['team', 'planning', 'delivery', 'ai-sdlc', 'vendors', 'architects'],
      accomplishments: {
        team: {
          description:
            'Hired and led a five-engineer team that owns authentication, content, Salesforce integrations, enrollment, and eligibility in production.',
        },
        delivery: {
          description:
            'Kept feature delivery predictable: over 90% of refined work shipped within two weeks, with technical design done up front.',
        },
        vendors: {
          description:
            'Led vendor evaluations and the configuration platform design with HIPAA in scope, weighing the trade-offs between compliance, cost, and how easy each choice would be to change later.',
        },
      },
    },
    2: {
      order: ['mentoring', 'velocity', 'ui-architecture', 'requirements', 'component-library'],
    },
    3: {
      order: ['people', 'engagements', 'stack', 'saas-rebuild', 'claims', 'payments', 'scaffolding'],
      accomplishments: {
        stack: {
          description:
            'Owned the cloud architecture on every engagement on Azure and AWS, delivering in C#/.NET, Java Spring Boot, React, Angular, and Flutter with Docker containers, AWS Lambda, and Azure SQL.',
        },
      },
    },
    4: {
      description:
        'Joined as a senior developer on a fast-paced fintech lending platform on Azure while sprint velocity was running negative, and was promoted to team lead within the first year.',
      order: ['ceo-investors', 'operations', 'kpis', 'refactor', 'microservices', 'dotnet-core'],
      accomplishments: {
        operations: {
          description:
            'Owned all deployments and incident response at all hours, with Application Insights monitoring, for a platform where customers made payments through a portal.',
        },
        refactor: {
          description:
            'Made the technical investment to rewrite the production lending application: 250k+ lines onto a service-repository pattern in 3 months, turning sprint velocity from negative back to positive.',
        },
        microservices: {
          description:
            'Built a distributed system of microservices on Azure Functions and Azure App Service with SignalR for real-time messaging, reworked the Salesforce integration, and wrote a utility to transform the entire database schema.',
        },
      },
    },
  },
};

export default topstepEm;
