// src/data/tailoring/topstep.ts
// Topstep, Staff Software Engineer (Trading Platform).
// Posting asks: deep C#/.NET on multi-team production services, React/TypeScript, service boundaries in
// microservices, distributed systems, PostgreSQL or SQL Server, observability, owning production systems
// including incident response, Docker and AWS, strong testing, AI developer tools, leading across teams
// without authority, mentoring. SignalR and fintech are preferred.
// Hands-on work and production ownership lead each entry. No Kubernetes, message queue, streaming,
// tracing or low-latency claims: the resume data does not back them.
import type { Tailoring } from './types';

const topstep: Tailoring = {
  id: 'topstep',
  company: 'Topstep',
  role: 'Staff Software Engineer',
  profile: {
    targetRole: 'Staff Software Engineer',
    professionalSummary:
      'Staff-level software engineer and architect with C#/.NET in production since 2012, including deployments, incident response, and on-call. Builds distributed cloud services on AWS and Azure with React and TypeScript, SQL Server, Docker, and microservices, in fintech lending, payments, and healthcare. Sets engineering standards across teams and uses AI developer tools.',
  },
  quests: {
    1: {
      order: ['planning', 'ai-sdlc', 'architects', 'team', 'delivery', 'vendors'],
      accomplishments: {
        vendors: {
          description:
            'Led vendor evaluations and the configuration platform design with HIPAA in scope, weighing the trade-offs between compliance, cost, and how easy each choice would be to change later.',
        },
      },
    },
    2: {
      order: ['ui-architecture', 'component-library', 'velocity', 'requirements', 'mentoring'],
    },
    3: {
      order: ['stack', 'saas-rebuild', 'engagements', 'claims', 'payments', 'scaffolding', 'people'],
      accomplishments: {
        stack: {
          description:
            'Owned the cloud architecture on every engagement on Azure and AWS, delivering in C#/.NET, Java Spring Boot, React, Angular, and Flutter with Docker containers, AWS Lambda, and Azure SQL.',
        },
      },
    },
    4: {
      description:
        'Joined as a senior developer on a fintech lending platform on Azure while sprint velocity was running negative, and was promoted to team lead within the first year.',
      order: ['refactor', 'microservices', 'operations', 'dotnet-core', 'kpis', 'ceo-investors'],
      accomplishments: {
        refactor: {
          description:
            'Rewrote the production lending application to pay down technical debt: moved 250k+ lines onto a service-repository pattern in 3 months and turned sprint velocity from negative back to positive.',
        },
        microservices: {
          description:
            'Built a distributed system of microservices on Azure Functions and Azure App Service with SignalR for real-time messaging, reworked the Salesforce integration, and wrote a utility to transform the entire database schema.',
        },
        operations: {
          description:
            'Owned all deployments and incident response at all hours, with Application Insights monitoring, for a platform where customers made payments through a portal.',
        },
      },
    },
    8: {
      order: ['build-constraints', 'ai-implementation', 'games'],
    },
    12: {
      description:
        'Built the product full stack (C# API on Azure Functions, React and TypeScript web frontend) and advised the founders.',
      order: ['search', 'sign-in', 'saved-searches', 'advising'],
    },
  },
};

export default topstep;
