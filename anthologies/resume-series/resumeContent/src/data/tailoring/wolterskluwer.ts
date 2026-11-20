// src/data/tailoring/wolterskluwer.ts
// Wolters Kluwer, Principal Full Stack Engineer, AI Platform & Agents (R0052280).
// Posting asks: 8+ years, strong full stack and cloud (AWS, Azure or GCP), expert in one of agent
// development, backend, frontend, cloud, CI/CD, SRE, testing, or secure SDLC and privacy by design.
// Platform used by many product teams, healthcare flagship product, mentoring, hands-on architecture.
// Stack named: TypeScript, Node.js, React, Python, AWS primary, Azure. HIPAA is a nice-to-have.
// Leads with full-stack and shared-platform work, then AI in the SDLC with PHI safeguards.
// No claims of production AI agents, LangChain or LangGraph, RAG, evals, Node.js, Python or Terraform:
// the resume data does not back them.
import type { Tailoring } from './types';

const wolterskluwer: Tailoring = {
  id: 'wolterskluwer',
  company: 'Wolters Kluwer',
  role: 'Principal Full Stack Engineer, AI Platform & Agents',
  profile: {
    targetRole: 'Principal Full Stack Engineer',
    professionalSummary:
      'Principal full-stack engineer and architect with over a decade of experience building and running production systems. Builds the shared platforms and standards that teams ship on, and integrates AI across the software development lifecycle with privacy safeguards in place.',
  },
  quests: {
    1: {
      order: ['ai-sdlc', 'planning', 'architects', 'vendors', 'delivery', 'team'],
    },
    2: {
      order: ['component-library', 'ui-architecture', 'requirements', 'mentoring', 'velocity'],
    },
    3: {
      order: ['saas-rebuild', 'scaffolding', 'stack', 'claims', 'engagements', 'payments', 'people'],
    },
    4: {
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

export default wolterskluwer;
