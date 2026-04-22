import type { ProjectInfo } from '../utils/exporters';

interface Props {
  project: ProjectInfo;
  onChange: (project: ProjectInfo) => void;
}

const FIELDS: { key: keyof ProjectInfo; label: string }[] = [
  { key: 'name', label: 'Project' },
  { key: 'location', label: 'Location' },
  { key: 'client', label: 'Client' },
  { key: 'jobNumber', label: 'Job No.' },
  { key: 'date', label: 'Date' },
  { key: 'calculatedBy', label: 'Calc. By' },
];

export default function ProjectHeader({ project, onChange }: Props) {
  function handleChange(key: keyof ProjectInfo, value: string) {
    onChange({ ...project, [key]: value });
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-gray-200">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="px-3 py-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
              {label}
            </label>
            <input
              type="text"
              value={project[key]}
              placeholder="—"
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full text-sm text-gray-900 placeholder-gray-300 bg-transparent border-none outline-none focus:bg-blue-50 rounded px-0.5"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
