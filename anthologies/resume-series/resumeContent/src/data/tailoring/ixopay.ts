// src/data/tailoring/ixopay.ts
// IXOPAY, Engineering Manager over two teams that own tokenization, network token, and compliance
// services for a global payment platform.
// Posting asks: people leadership (1-on-1s, hiring, performance, career growth), ownership of delivery
// commitments, escalations and updates to leadership, incident response and shared production support,
// working knowledge of .NET, SQL Server, and Azure, secure development with PCI DSS, and responsible
// adoption of AI-assisted development. Payments or fintech, payment processor integrations, and
// managing more than one team are preferred.
//
// Zo, 2026-11-28: apply as the hands-on lead, not the people manager. This overlay leads with
// architecting, building, and running production systems: the Lendr payment portal on Azure and .NET,
// the FreedomPay payment-processor certification, multi-tenant SaaS and claims modernization under
// HIPAA, and architecture across five teams. People leadership stays on the page but is ordered last.
// It does not claim PCI DSS, tokenization or network tokens, managing two teams or managing through
// leads, a formal root cause analysis practice, or Jira, Confluence, or Slack: the base data does not
// state them. targetRole stays unset (see the resume-tailor skill).
import type { Tailoring } from './types';

const ixopay: Tailoring = {
  id: 'ixopay',
  company: 'IXOPAY',
  role: 'Engineering Manager',
  profile: {
    professionalSummary:
      'Software architect and engineering lead who designs, builds, and runs production systems. Refactored and ran a fintech lending platform with a customer payment portal on Azure and .NET, certified a commerce system with a payment processor, and modernized healthcare systems under HIPAA. Sets technical direction across teams and stays hands-on through production support.',
    competencies: {
      'Enterprise Integration':
        'Connects complex systems through APIs, service-oriented architectures, and integration patterns, including payment processor and Salesforce integrations.',
      'Development Practices':
        'Establishes engineering standards around code quality, testing, CI/CD, and production support.',
    },
  },
  quests: {
    1: {
      order: ['planning', 'architects', 'ai-sdlc', 'team'],
    },
    2: {
      order: ['ui-architecture', 'component-library', 'requirements', 'velocity', 'mentoring'],
    },
    3: {
      order: ['stack', 'saas-rebuild', 'payments', 'claims', 'engagements', 'scaffolding', 'people'],
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
      order: ['refactor', 'microservices', 'dotnet-core', 'operations', 'kpis', 'ceo-investors'],
      accomplishments: {
        operations: {
          description:
            'Owned every deployment and production incident response, day and night, for a customer payment portal monitored with Application Insights.',
        },
      },
    },
  },
};

export default ixopay;
