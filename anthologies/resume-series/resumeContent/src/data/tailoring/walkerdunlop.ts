// src/data/tailoring/walkerdunlop.ts
// Walker & Dunlop, Principal AI Software Engineer (Req-1996).
// Posting asks: 12+ years, senior individual-contributor delivery of production systems, production
// LLM applications and agentic workflows, agent frameworks (Claude Agent SDK, LangGraph, Pydantic AI,
// MCP), agentic development tools, deep Python and FastAPI, strong SQL, event sourcing and DDD,
// platform patterns other teams adopt, mentoring. Financial services experience preferred.
// Loan origination and servicing platform.
// Leads with lending and financial systems, SQL-backed services, platform patterns, and directing AI
// coding agents under build-enforced constraints.
// No claims of Python, FastAPI, production LLM or agent systems, agent frameworks, RAG, evals, or
// event sourcing: the resume data does not back them.
import type { Tailoring } from './types';

const walkerdunlop: Tailoring = {
  id: 'walkerdunlop',
  company: 'Walker & Dunlop',
  role: 'Principal AI Software Engineer',
  profile: {
    targetRole: 'Principal Software Engineer',
    professionalSummary:
      'Principal software engineer and architect with over a decade of experience building and running production systems. Sets technical direction across teams and integrates AI across the software development lifecycle to turn business strategy into reliable delivery.',
  },
  quests: {
    1: {
      order: ['ai-sdlc', 'planning', 'architects', 'team'],
    },
    2: {
      order: ['ui-architecture', 'component-library', 'requirements', 'velocity', 'mentoring'],
    },
    3: {
      order: ['stack', 'saas-rebuild', 'scaffolding', 'payments', 'claims', 'engagements', 'people'],
    },
    4: {
      description:
        'Joined as a senior developer on a fintech lending platform on Azure while sprint velocity was running negative, and was promoted to team lead within the first year.',
      order: ['refactor', 'microservices', 'operations', 'dotnet-core', 'kpis', 'ceo-investors'],
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

export default walkerdunlop;
