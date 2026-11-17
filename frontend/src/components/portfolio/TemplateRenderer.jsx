import MinimalTemplate from '../../templates/MinimalTemplate';
import ModernTemplate from '../../templates/ModernTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import CorporateTemplate from '../../templates/CorporateTemplate';

const MAP = { minimal: MinimalTemplate, modern: ModernTemplate, creative: CreativeTemplate, corporate: CorporateTemplate };

// data = { name, profile } - always real data from MongoDB (via the API)
export default function TemplateRenderer({ template, data }) {
  const Template = MAP[template] || MinimalTemplate;
  return <Template data={data} />;
}
