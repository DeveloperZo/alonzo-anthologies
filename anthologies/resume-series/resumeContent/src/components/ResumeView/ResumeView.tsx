// src/components/Resume/ResumeView.tsx
import React, { useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import quests from '../../data/quests.data';
import type { Quest } from '../../data/quests.data';
import { awards, leadership, professionalSummary, skills, targetRole } from '../../data/profile.data';
import './ResumeView.css';
import { generateResumePdfFromDom } from '../../utils/pdfGenerator';

// Helper function to format dates consistently, avoiding timezone issues
const formatDate = (date: Date): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Use UTC methods to avoid timezone conversion issues
  return `${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

// Ongoing roles are stored with an end date far in the future.
const formatPeriod = (start: Date, end: Date): string =>
  `${formatDate(start)} – ${end.getFullYear() >= 2030 ? 'Present' : formatDate(end)}`;

const isExperienceQuest = (quest: Quest): boolean =>
  quest.type === 'career' &&
  Boolean(quest.company) &&
  quest.company !== 'Personal Project';

const isConsultingQuest = (quest: Quest): boolean => quest.type === 'independent';

const isProjectQuest = (quest: Quest): boolean => quest.type === 'hobby';

interface ResumeViewProps {
  /** Headless print for the application package: print layout only, no download button. */
  printMode?: boolean;
}

const ResumeView: React.FC<ResumeViewProps> = ({ printMode = false }) => {
  const { theme } = useTheme()!;
  // The exported file is sleek. printMode is the package page. The on-screen page keeps the current mode.
  const resumeTheme = printMode ? 'work' : theme;

  // The browser writes the page title into the PDF's /Title, which some ATS show as the document name.
  useEffect(() => {
    if (printMode) document.title = 'Alonzo Williams Resume';
  }, [printMode]);
  
  // Transform quest data into resume format
  const resumeData = useMemo(() => {
    const toResumeEntry = (quest: Quest) => ({
      id: quest.id,
      company: quest.company,
      role: quest.workTitle,
      overview: quest.description.trim(),
      startDate: quest.startDate,
      endDate: quest.endDate,
      accomplishments: quest.accomplishments.map((acc) => acc.description),
    });

    const byStartDesc = (a: Quest, b: Quest) => b.startDate.getTime() - a.startDate.getTime();

    const experience = quests.filter(isExperienceQuest).sort(byStartDesc).map(toResumeEntry);

    // Independent consulting and personal projects share one section, apart from employed roles.
    // Quest 11 is a short past engagement the resume leaves out.
    const asConsultingEntry = (quest: Quest): Quest => ({
      ...quest,
      company: `Independent Consulting (${quest.titles.sleek.replace(/^.* for an? /, '')})`,
    });
    const asProjectEntry = (quest: Quest): Quest => ({
      ...quest,
      workTitle: quest.roles[0] ?? quest.workTitle,
      company: 'Personal Project',
    });

    // Consulting leads, then projects, each newest first.
    const independent = [
      ...quests.filter((quest) => isConsultingQuest(quest) && quest.id !== 11).sort(byStartDesc).map(asConsultingEntry),
      ...quests.filter(isProjectQuest).sort(byStartDesc).map(asProjectEntry),
    ].map(toResumeEntry);
    const education = quests
      .filter((quest) => quest.type === 'education')
      .map((edu) => ({
        institution: edu.company,
        degree: edu.accomplishments.map((acc) => acc.description)[0],
        startDate: edu.startDate,
        endDate: edu.endDate,
        details: edu.accomplishments.map((acc) => acc.description),
      }))
      .sort((a, b) => b.endDate.getTime() - a.endDate.getTime());

    const skills = Array.from(
      new Set(
        quests.flatMap((quest) => quest.accomplishments.flatMap((acc) => acc.learnings)),
      ),
    );

    return { experience, education, independent, skills };
  }, []);

  type ResumeEntry = (typeof resumeData.experience)[number];

  const renderEntry = (job: ResumeEntry) => (
    <div key={job.id} className="experience-item">
      {printMode ? (
        // One line with text separators, so extractors that read in reading order keep title, employer and dates apart.
        <div className="job-header">
          <h3>
            {job.role}
            <span className="company-period">{' | '}{job.company}{' | '}{formatPeriod(job.startDate, job.endDate)}</span>
          </h3>
        </div>
      ) : (
        <div className="job-header">
          <h3>{job.role}</h3>
          <div className="company-period">
            <span className="company-name">{job.company}</span>
            <span className="job-period">{formatPeriod(job.startDate, job.endDate)}</span>
          </div>
        </div>
      )}
      {job.overview ? <p className="role-overview">{job.overview}</p> : null}
      <ul className="accomplishment-bullets">
        {job.accomplishments.map((acc, i) => (
          // The printed bullet is a text character so parsers see where each bullet starts.
          <li key={i}>{printMode && '• '}{acc}</li>
        ))}
      </ul>
    </div>
  );

  const handleDownloadPDF = () => {
    void generateResumePdfFromDom('Alonzo_Williams_Resume.pdf');
  };

  return (
    <div className={`resume-container ${resumeTheme}${printMode ? ' resume-print resume-print-page' : ''}`}>
      <div className="resume-header">
        <div className="header-content">
          <h1>Alonzo Williams</h1>
          {/* The printed separator keeps the name and the role apart in the PDF's text. */}
          {targetRole && <p className="target-role">{printMode && '| '}{targetRole}</p>}
          {/* Spaces between the spans keep the fields apart in the PDF text layer when print lays them on one line. */}
          <div className="contact-info">
            <span>awilliams9293@gmail.com</span>{' '}
            {/* Set only by apply:package from the gitignored answers bank, so the number stays out of this public repo and the live site. */}
            {process.env.REACT_APP_PHONE && <><span>{process.env.REACT_APP_PHONE}</span>{' '}</>}
            {/* Print drops the scheme so all the links fit on the one contact line. */}
            <span>{printMode ? 'linkedin.com/in/alonzo-williams-1160a7b0' : 'https://www.linkedin.com/in/alonzo-williams-1160a7b0/'}</span>{' '}
            <span>
              {printMode ? (
                'github.com/DeveloperZo'
              ) : (
                <a className="project-link" href="https://github.com/DeveloperZo" target="_blank" rel="noreferrer">
                  https://github.com/DeveloperZo
                </a>
              )}
            </span>{' '}
            {/* The printed resume also names the site, which holds the portfolio. On the site itself the reader is already there. */}
            {printMode && <><span>alonzo-anthologies.pages.dev</span>{' '}</>}
            <span>Chicago, IL</span>
          </div>
        </div>
        <button type="button" className="download-button" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      <div className="resume-content">
        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p className="summary-text">{professionalSummary}</p>
        </section>
        <section className="resume-section">
          <h2>Skills</h2>
          <ul className="technical-skills">
            {skills.map((row) => (
              <li key={row.group}>
                <strong>{row.group}:</strong> {row.items.join(', ')}
              </li>
            ))}
          </ul>
        </section>
        {/* Professional Experience */}
        <section className="resume-section">
          <h2>Professional Experience</h2>
          {resumeData.experience.map(renderEntry)}
        </section>

        {resumeData.independent.length > 0 && (
          <section className="resume-section">
            <h2>Independent Consulting & Projects</h2>
            {resumeData.independent.map(renderEntry)}
          </section>
        )}

        {/* Education Section */}
        {resumeData.education && resumeData.education.length > 0 && (
          <section className="resume-section">
            <h2>Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
                {printMode ? (
                  <h3>
                    {edu.degree}
                    <span className="institution-period">{' | '}{edu.institution}{' | '}{formatPeriod(edu.startDate, edu.endDate)}</span>
                  </h3>
                ) : (
                  <>
                    <h3>{edu.degree}</h3>
                    <div className="institution-period">
                      <span className="institution-name">{edu.institution}</span>
                      <span className="education-period">{formatPeriod(edu.startDate, edu.endDate)}</span>
                    </div>
                  </>
                )}
                {edu.details && edu.details.some((detail) => detail !== edu.degree) && (
                  <ul className="education-details">
                    {edu.details.filter((detail) => detail !== edu.degree).map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        <section className="resume-section">
          <h2>Leadership & Awards</h2>
          {/* One line per item keeps the section short enough for the printed resume to stay at two pages. */}
          <ul className="accomplishment-bullets">
            {leadership.map((item) => (
              <li key={item.role}>
                {printMode && '• '}
                <strong>{item.role}</strong>, {item.organization} ({item.period}). {item.detail}
              </li>
            ))}
            <li>
              {printMode && '• '}
              <strong>Awards:</strong> {awards.join('; ')}.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ResumeView;
