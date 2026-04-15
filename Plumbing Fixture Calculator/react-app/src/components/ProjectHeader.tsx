import type { ProjectInfo } from '../utils/exporters';

interface Props {
  project: ProjectInfo;
  onChange: (project: ProjectInfo) => void;
}

const FIELDS: { key: keyof ProjectInfo; label: string; placeholder: string }[] = [
  { key: 'name', label: 'Project', placeholder: 'Project name' },
  { key: 'location', label: 'Location', placeholder: 'City, State' },
  { key: 'client', label: 'Client', placeholder: 'Client name' },
  { key: 'jobNumber', label: 'Job Number', placeholder: '0000000000' },
  { key: 'date', label: 'Date', placeholder: 'MM/DD/YYYY' },
  { key: 'calculatedBy', label: 'Calculated By', placeholder: 'Initials or name' },
];

export default function ProjectHeader({ project, onChange }: Props) {
  function handleChange(key: keyof ProjectInfo, value: string) {
    onChange({ ...project, [key]: value });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Project Information
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {label}
            </label>
            <input
              type="text"
              value={project[key]}
              placeholder={placeholder}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
