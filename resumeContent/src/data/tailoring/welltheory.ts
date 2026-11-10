// src/data/tailoring/welltheory.ts
// WellTheory, Head of Engineering. First engineering leader, player-coach, reporting to the
// Co-Founder and Chief Product Officer. Posting: https://jobs.ashbyhq.com/welltheory/17b3bc2c-a70f-4823-9c27-69c6486a9cb2
// Company: https://www.welltheory.com/ (autoimmune care for members, sold to employers and health plans).
// Their support-engineer posting names the stack: TypeScript, JavaScript, React, React Native, Node, Postgres, GCP.
//
// This overlay leads with facts already on the resume: a hired team of 5 on a healthcare benefits
// platform (enrollment, eligibility, authentication), AI-assisted development with PHI safeguards,
// healthcare claims and multi-tenant SaaS with EHR integrations, interim engineering leadership,
// and a React and TypeScript product on the consulting entry (those two names are already tags).
// It does not claim SOC 2, HITRUST, incident response, or ownership of non-production PHI environments.
// The seven-team planning bullet and the HIPAA vendor bullet stay in the data and are ordered last
// on quest 1, because resume-spa.md says that register does not support those claims.
import type { Tailoring } from './types';

const welltheory: Tailoring = {
  id: 'welltheory',
  company: 'WellTheory',
  role: 'Head of Engineering',
  profile: {
    professionalSummary:
      'Technology leader with over a decade of experience in software architecture and engineering leadership. Hires and leads engineering teams, sets technical direction, and stays hands-on through delivery. Experience integrating AI into the development lifecycle in regulated work environments.',
    competencies: {
      'Software Architecture': 'Designs healthcare platforms, including multi-tenant SaaS.',
      'Technology Leadership': 'Hires and leads engineering teams and sets technical direction.',
      'Enterprise Integration': 'Connects complex systems through appropriate architecture and integration patterns',
      'Systems Thinking': 'Analyzes how systems, teams, and incentives interact.',
      'Development Practices': 'Sets standards for code quality, testing, and CI/CD.',
      'AI & Technology Modernization': 'Applies AI in the development lifecycle with safeguards.',
    },
  },
  quests: {
    1: {
      description: 'Hired and led a team of 5 on an AWS healthcare benefits platform covering 7M lives',
      order: ['team', 'ai-sdlc', 'delivery', 'architects', 'planning', 'vendors'],
      accomplishments: {
        team: {
          description:
            'Hired and led a five-engineer team owning enrollment, eligibility, authentication, content, and Salesforce integrations.',
        },
      },
    },
    2: {
      order: ['mentoring', 'ui-architecture', 'requirements', 'component-library', 'velocity'],
    },
    3: {
      description: 'Modernized healthcare claims systems and multi-tenant SaaS platforms across client engagements',
      order: ['claims', 'saas-rebuild', 'engagements', 'scaffolding', 'stack', 'payments'],
      accomplishments: {
        claims: {
          description:
            'Cut maintenance costs by 30% by modernizing a healthcare claims application across the full stack, keeping it HIPAA compliant throughout.',
        },
        stack: {
          description: 'Owned the architecture on every engagement in whatever stack the client ran, on Azure and AWS.',
        },
      },
    },
    4: {
      order: ['ceo-investors', 'kpis', 'regulatory', 'refactor', 'uat', 'co-led', 'architects', 'dotnet-core'],
    },
    8: {
      description: 'Directed AI implementation with architecture constraints enforced in the build',
      order: ['build-constraints', 'ai-implementation', 'games'],
    },
    12: {
      description: 'Built a full-stack product in React and TypeScript and advised founders on direction',
      tags: ['React', 'TypeScript', 'C#', 'Technical Leadership', 'Patent Intelligence', 'Biotech', 'Azure Functions'],
      order: ['advising', 'sign-in', 'search', 'saved-searches'],
    },
  },
};

export default welltheory;
