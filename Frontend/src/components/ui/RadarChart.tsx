interface RadarChartProps {
  data: {
    label: string;
    value: number;
  }[];
  size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const gridLevels = [20, 40, 60, 80, 100];
  const dataPoints = data.map((item, index) => getPoint(item.value, index));
  const pathData = dataPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid circles */}
        {gridLevels.map((level) => {
          const radius = (level / 100) * maxRadius;
          return (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#1f2937"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Grid lines */}
        {data.map((_, index) => {
          const point = getPoint(100, index);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#1f2937"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Data area */}
        <path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="#06b6d4"
          strokeWidth="3"
          filter="url(#glow)"
          className="transition-all duration-1000"
        />

        {/* Data points */}
        {dataPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#06b6d4"
              stroke="#0a0e1a"
              strokeWidth="2"
              className="transition-all duration-500"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#06b6d4"
              className="animate-ping"
            />
          </g>
        ))}

        {/* Labels */}
        {data.map((item, index) => {
          const labelPoint = getPoint(110, index);
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold fill-gray-400"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
