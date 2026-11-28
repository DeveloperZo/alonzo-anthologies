// src/data/tailoring/ixopay.ts
// IXOPAY, Engineering Manager over two teams that own tokenization, network token, and compliance
// services for a global payment platform.
// Posting asks: people leadership (1-on-1s, hiring, performance, career growth), ownership of delivery
// commitments, escalations and updates to leadership, incident response and shared production support,
// working knowledge of .NET, SQL Server, and Azure, secure development with PCI DSS, and responsible
// adoption of AI-assisted development. Payments or fintech, payment processor integrations, and
// managing more than one team are preferred.
//
// Zo, 2026-11-28: manager-first (an IC framing was tried and reverted the same day). The summary
// states who he is in two sentences and leaves the evidence to the bullets. People leadership and
// delivery ownership lead each entry, then production ownership on the Lendr payment portal, the
// FreedomPay payment-processor certification, and work under HIPAA.
// It does not claim PCI DSS or tokenization (Zo, 2026-11-28: neither was in scope), or managing two
// teams or managing through leads. targetRole stays unset (see the resume-tailor skill).
import type { Tailoring } from './types';

const ixopay: Tailoring = {
  id: 'ixopay',
  company: 'IXOPAY',
  role: 'Engineering Manager',
  profile: {
    professionalSummary:
      'Software engineering manager who hires and leads engineering teams and stays close enough to the architecture to own what they ship in production. Has led that work in payments, lending, and healthcare, mostly on Azure and .NET, including a stretch as interim director of engineering at a fintech lender.',
    competencies: {
      'Technology Leadership':
        'Hires and leads engineering teams, runs one-on-ones and career development, and drives delivery from planning through production.',
      'Development Practices':
        'Establishes engineering standards around code quality, testing, CI/CD, and production support.',
    },
  },
  quests: {
    1: {
      order: ['team', 'planning', 'ai-sdlc', 'architects'],
    },
    2: {
      order: ['mentoring', 'velocity', 'ui-architecture', 'requirements', 'component-library'],
    },
    3: {
      order: ['people', 'engagements', 'payments', 'claims', 'saas-rebuild', 'scaffolding', 'stack'],
      accomplishments: {
        payments: {
          description:
            "Certified a client's commerce system with FreedomPay for payment processing to meet payment security requirements.",
        },
        people: {
          description:
            "Ran one-on-ones and career development for the development team, and contributed to the firm's AI strategy.",
        },
      },
    },
    4: {
      description:
        'Led engineering on a fintech lending platform on Azure, rising from senior developer to team lead to interim director of engineering.',
      order: ['kpis', 'ceo-investors', 'operations', 'refactor', 'microservices', 'dotnet-core'],
      accomplishments: {
        operations: {
          description:
            'Owned every deployment and production incident response, day and night, for a customer payment portal monitored with Application Insights, and ran root cause analysis and corrective actions after each outage.',
        },
      },
    },
  },
};

export default ixopay;
