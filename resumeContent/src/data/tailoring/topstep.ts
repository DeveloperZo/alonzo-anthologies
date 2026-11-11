// src/data/tailoring/topstep.ts
// Topstep, Staff Software Engineer (Trading Platform).
// Posting asks: deep C#/.NET on multi-team production services, React/TypeScript, service boundaries in
// microservices, PostgreSQL or SQL Server, Docker and AWS, strong testing, AI developer tools, leading
// across teams without authority, mentoring. Fintech is preferred.
// Hands-on work leads each entry. No Kubernetes, SignalR, on-call, observability or event-driven claims:
// the resume data does not back them.
import type { Tailoring } from './types';

const topstep: Tailoring = {
  id: 'topstep',
  company: 'Topstep',
  role: 'Staff Software Engineer',
  profile: {
    targetRole: 'Staff Software Engineer',
    professionalSummary:
      'Staff-level software engineer and architect with C#/.NET in production since 2012. Builds cloud services on AWS and Azure with React and TypeScript front ends, SQL Server, Docker, and microservices, in lending, payments, and healthcare. Sets engineering standards across teams and uses AI developer tools with review gates.',
  },
  quests: {
    1: {
      description:
        "Leads the Experience Platform team and does system design for Progyny's benefits platform on AWS, serving 7 million covered lives.",
      order: ['planning', 'ai-sdlc', 'architects', 'team', 'delivery', 'vendors'],
    },
    2: {
      order: ['ui-architecture', 'component-library', 'velocity', 'requirements', 'mentoring'],
    },
    3: {
      order: ['stack', 'saas-rebuild', 'claims', 'payments', 'scaffolding', 'engagements', 'people'],
    },
    4: {
      order: ['refactor', 'microservices', 'dotnet-core', 'kpis', 'ceo-investors'],
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
