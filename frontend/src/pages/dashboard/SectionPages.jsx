import ArraySectionPage from '../../components/forms/ArraySectionPage';

export const EducationPage = () => (
  <ArraySectionPage
    section="education"
    title="Education"
    description="Add every college, school or course you want on your portfolio."
    fields={[
      { key: 'collegeName', label: 'College name', required: true, full: true, max: 150 },
      { key: 'degree', label: 'Degree', required: true, placeholder: 'B.Tech' },
      { key: 'branch', label: 'Branch / specialization', placeholder: 'Computer Science' },
      { key: 'startYear', label: 'Start year', type: 'year', placeholder: '2022' },
      { key: 'graduationYear', label: 'Graduation year', type: 'year', placeholder: '2026' },
      { key: 'grade', label: 'CGPA / percentage', placeholder: '8.5 CGPA', max: 30 },
    ]}
    emptyItem={{ collegeName: '', degree: '', branch: '', startYear: '', graduationYear: '', grade: '' }}
    itemLabel={(v) => v?.collegeName || 'New education'}
    addLabel="Add education"
    emptyText="No education added yet. Add your college to show your academic background."
  />
);

export const ProjectsPage = () => (
  <ArraySectionPage
    section="projects"
    title="Projects"
    description="Projects are the first thing recruiters look at. Describe what you built and what you used."
    fields={[
      { key: 'name', label: 'Project name', required: true, full: true, max: 120 },
      { key: 'description', label: 'Description', type: 'textarea', full: true, max: 1500, hint: 'What does it do and what was your part?' },
      { key: 'technologies', label: 'Technologies used', type: 'tags', full: true, placeholder: 'React, Node.js, MongoDB', hint: 'Separate with commas.' },
      { key: 'githubUrl', label: 'GitHub repository URL', type: 'url', placeholder: 'https://github.com/you/project' },
      { key: 'liveUrl', label: 'Live project URL', type: 'url', placeholder: 'https://your-project.com' },
      { key: 'image', label: 'Project image', type: 'image', full: true },
    ]}
    emptyItem={{ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '', image: '' }}
    itemLabel={(v) => v?.name || 'New project'}
    addLabel="Add project"
    emptyText="No projects yet. Add your best project to get started."
  />
);

export const ExperiencePage = () => (
  <ArraySectionPage
    section="experience"
    title="Internships and experience"
    description="Internships, part-time jobs, freelance work and volunteering all count."
    fields={[
      { key: 'organization', label: 'Organization name', required: true, max: 150 },
      { key: 'role', label: 'Job role', required: true, max: 100 },
      { key: 'startDate', label: 'Start date', type: 'month' },
      { key: 'endDate', label: 'End date', type: 'month', hint: 'Leave empty if you are still there.' },
      { key: 'description', label: 'Description', type: 'textarea', full: true, max: 1500 },
    ]}
    emptyItem={{ organization: '', role: '', startDate: '', endDate: '', description: '' }}
    itemLabel={(v) => v?.role || 'New experience'}
    addLabel="Add experience"
    emptyText="No experience added yet. If you are a fresher, internships or club work work well here."
  />
);

export const CertificationsPage = () => (
  <ArraySectionPage
    section="certifications"
    title="Certifications"
    description="Courses and certificates that back up your skills."
    fields={[
      { key: 'name', label: 'Certification name', required: true, full: true, max: 150 },
      { key: 'issuer', label: 'Issuing organization', max: 150 },
      { key: 'issueDate', label: 'Issue date', type: 'month' },
      { key: 'credentialUrl', label: 'Credential URL', type: 'url', full: true, placeholder: 'https://...' },
    ]}
    emptyItem={{ name: '', issuer: '', issueDate: '', credentialUrl: '' }}
    itemLabel={(v) => v?.name || 'New certification'}
    addLabel="Add certification"
    emptyText="No certifications yet."
  />
);

export const AchievementsPage = () => (
  <ArraySectionPage
    section="achievements"
    title="Achievements"
    description="Hackathons, awards, rankings and anything you are proud of."
    fields={[
      { key: 'title', label: 'Achievement title', required: true, max: 150 },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea', full: true, max: 1000 },
    ]}
    emptyItem={{ title: '', date: '', description: '' }}
    itemLabel={(v) => v?.title || 'New achievement'}
    addLabel="Add achievement"
    emptyText="No achievements yet."
  />
);
