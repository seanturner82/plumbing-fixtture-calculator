import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceDot, ResponsiveContainer, Label,
} from 'recharts';
import { hunterGPM } from '../data/hunterCurve';

interface Props {
  combinedWSFU: number;
  hotWSFU: number;
  systemType: 'FLUSH_TANK' | 'FLUSH_VALVE';
  combinedGPM: number;
}

// Log-spaced x points covering 1–3000 WSFU
function buildCurveData() {
  const points: number[] = [];
  // Dense near the origin, sparse at high end
  for (let x = 1; x <= 30; x += 1) points.push(x);
  for (let x = 35; x <= 100; x += 5) points.push(x);
  for (let x = 110; x <= 300; x += 10) points.push(x);
  for (let x = 325; x <= 1000; x += 25) points.push(x);
  for (let x = 1050; x <= 3000; x += 50) points.push(x);
  return points.map((x) => ({
    wsfu: x,
    ft: Math.max(0, hunterGPM(x, 'FLUSH_TANK')),
    fv: Math.max(0, hunterGPM(x, 'FLUSH_VALVE')),
  }));
}

const CURVE_DATA = buildCurveData();

// Log tick positions for X axis
const X_TICKS = [1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 3000];

function logTick(v: number) {
  return [1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 3000].includes(v)
    ? v.toLocaleString()
    : '';
}

export default function HunterCurveChart({ combinedWSFU, systemType, combinedGPM }: Props) {
  const activeWSFU = Math.max(combinedWSFU, 0);
  const activeGPM = Math.max(combinedGPM, 0);
  const hasProject = activeWSFU > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Hunter's Curve · IPC 2006–2018
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">
            Demand Conversion · WSFU → GPM
          </p>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border ${
            systemType === 'FLUSH_VALVE'
              ? 'bg-orange-50 border-orange-300 text-orange-700'
              : 'bg-blue-50 border-blue-300 text-blue-700'
          }`}
        >
          {systemType === 'FLUSH_VALVE' ? 'Flush Valve' : 'Flush Tank'}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={CURVE_DATA} margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="wsfu"
            scale="log"
            domain={[1, 3000]}
            type="number"
            ticks={X_TICKS}
            tickFormatter={logTick}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            allowDataOverflow
          >
            <Label value="Water Supply Fixture Units" offset={-8} position="insideBottom" style={{ fontSize: 10, fill: '#9ca3af' }} />
          </XAxis>
          <YAxis
            domain={[0, 400]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickFormatter={(v) => v}
            width={36}
          >
            <Label value="GPM" angle={-90} position="insideLeft" offset={8} style={{ fontSize: 10, fill: '#9ca3af' }} />
          </YAxis>
          <Tooltip
            formatter={(val, name) => [`${Number(val).toFixed(1)} GPM`, name === 'ft' ? 'Flush Tank' : 'Flush Valve']}
            labelFormatter={(v) => `${v} WSFU`}
            contentStyle={{ fontSize: 11 }}
          />
          <Legend
            formatter={(val) => (val === 'ft' ? 'Flush Tank' : 'Flush Valve')}
            wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
          />
          <Line type="monotone" dataKey="ft" stroke="#2563eb" dot={false} strokeWidth={1.5} name="ft" />
          <Line type="monotone" dataKey="fv" stroke="#ea580c" dot={false} strokeWidth={1.5} name="fv" />
          {hasProject && (
            <ReferenceDot
              x={activeWSFU}
              y={activeGPM}
              r={5}
              fill={systemType === 'FLUSH_VALVE' ? '#ea580c' : '#2563eb'}
              stroke="white"
              strokeWidth={1.5}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-[10px] text-gray-400 text-center -mt-1">
        {hasProject
          ? `Current project plotted at ${activeWSFU.toFixed(1)} WSFU, ${activeGPM.toFixed(1)} GPM · ${systemType === 'FLUSH_VALVE' ? 'flush-valve' : 'flush-tank'} curve applied`
          : 'Current project plotted at 0 WSFU, 0 GPM · flush-tank curve applied'}
      </p>
    </div>
  );
}
