const asyncHandler = require('../utils/asyncHandler');
const { getPortfolio, logActivity } = require('../utils/userDocs');

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal Professional', description: 'Clean white layout with simple typography.', bestFor: 'Freshers and job applications' },
  { id: 'modern', name: 'Modern Developer', description: 'Dark, project-focused design with a skills showcase.', bestFor: 'Software developers' },
  { id: 'creative', name: 'Creative Portfolio', description: 'Colourful visuals and expressive project cards.', bestFor: 'Designers and creative students' },
  { id: 'corporate', name: 'Corporate Professional', description: 'Formal, structured education and experience sections.', bestFor: 'Corporate job applications' },
];

const cleanPortfolio = (p) => {
  const o = p.toObject();
  delete o.userId;
  delete o.__v;
  return o;
};

exports.list = (req, res) => res.json({ success: true, templates: TEMPLATES });

exports.select = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolio(req.user);
  portfolio.selectedTemplate = req.body.templateId;
  await portfolio.save();
  const t = TEMPLATES.find((x) => x.id === req.body.templateId);
  await logActivity(req.user._id, `Switched to the ${t.name} template`);
  res.json({ success: true, portfolio: cleanPortfolio(portfolio) });
});
