import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  G,
  Ellipse,
  Polygon,
} from 'react-native-svg';

export interface SvgProps {
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  style?: any;
}

export const Search: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.7" y2="16.7" />
  </Svg>
);

export const Plus: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M5 12h14" />
    <Path d="M12 5v14" />
  </Svg>
);

export const Trash2: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M3 6h18" />
    <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

export const Pin: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Line x1="12" y1="17" x2="12" y2="22" />
    <Path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
  </Svg>
);

export const Check: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

export const CheckCircle2: React.FC<SvgProps> = ({
  size = 24,
  color = '#10b981',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <Path d="m9 12 2 2 4-4" />
  </Svg>
);

export const CheckSquare: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polyline points="9 11 12 14 22 4" />
    <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </Svg>
);

export const Square: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="18" height="18" x="3" y="3" rx="2" />
  </Svg>
);

export const Minus: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M5 12h14" />
  </Svg>
);

export const Lock: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

export const Unlock: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </Svg>
);

export const Calendar: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M8 2v4" />
    <Path d="M16 2v4" />
    <Rect width="18" height="18" x="3" y="4" rx="2" />
    <Path d="M3 10h18" />
  </Svg>
);

export const Clock: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

export const List: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Line x1="8" y1="6" x2="21" y2="6" />
    <Line x1="8" y1="12" x2="21" y2="12" />
    <Line x1="8" y1="18" x2="21" y2="18" />
    <Line x1="3" y1="6" x2="3.01" y2="6" />
    <Line x1="3" y1="12" x2="3.01" y2="12" />
    <Line x1="3" y1="18" x2="3.01" y2="18" />
  </Svg>
);

export const ListOrdered: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Line x1="10" y1="6" x2="21" y2="6" />
    <Line x1="10" y1="12" x2="21" y2="12" />
    <Line x1="10" y1="18" x2="21" y2="18" />
    <Path d="M4 6h1v4" />
    <Path d="M4 10h2" />
    <Path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </Svg>
);

export const Sun: React.FC<SvgProps> = ({
  size = 24,
  color = '#d97706',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="4" />
    <Path d="M12 2v2" />
    <Path d="M12 20v2" />
    <Path d="m4.93 4.93 1.41 1.41" />
    <Path d="m17.66 17.66 1.41 1.41" />
    <Path d="M2 12h2" />
    <Path d="M20 12h2" />
    <Path d="m6.34 17.66-1.41 1.41" />
    <Path d="m19.07 4.93-1.41 1.41" />
  </Svg>
);

export const Moon: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Svg>
);

export const Menu: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Line x1="4" y1="12" x2="20" y2="12" />
    <Line x1="4" y1="6" x2="20" y2="6" />
    <Line x1="4" y1="18" x2="20" y2="18" />
  </Svg>
);

export const X: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Svg>
);

export const Download: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="7 10 12 15 17 10" />
    <Line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);

export const Upload: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="17 8 12 3 7 8" />
    <Line x1="12" y1="3" x2="12" y2="15" />
  </Svg>
);

export const Copy: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <Path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Svg>
);

export const RotateCcw: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
  </Svg>
);

export const RefreshCw: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <Path d="M21 3v5h-5" />
    <Path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <Path d="M8 16H3v5" />
  </Svg>
);

export const HardDrive: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Line x1="22" y1="12" x2="2" y2="12" />
    <Path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    <Line x1="6" y1="16" x2="6.01" y2="16" />
    <Line x1="10" y1="16" x2="10.01" y2="16" />
  </Svg>
);

export const Database: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Ellipse cx="12" cy="5" rx="9" ry="3" />
    <Path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <Path d="M3 12A9 3 0 0 0 21 12" />
  </Svg>
);

export const FileJson: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <Path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <Path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" />
    <Path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
  </Svg>
);

export const FileText: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <Path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <Path d="M10 9H8" />
    <Path d="M16 13H8" />
    <Path d="M16 17H8" />
  </Svg>
);

export const AlertCircle: React.FC<SvgProps> = ({
  size = 24,
  color = '#ef4444',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

export const AlertTriangle: React.FC<SvgProps> = ({
  size = 24,
  color = '#f59e0b',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <Line x1="12" y1="9" x2="12" y2="13" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

export const Bell: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Svg>
);

export const ShieldCheck: React.FC<SvgProps> = ({
  size = 24,
  color = '#10b981',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <Path d="m9 12 2 2 4-4" />
  </Svg>
);

export const ChevronDown: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ChevronRight: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="m9 18 6-6-6-6" />
  </Svg>
);

export const ArrowRight: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M5 12h14" />
    <Path d="m12 5 7 7-7 7" />
  </Svg>
);

export const CornerDownLeft: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polyline points="9 10 4 15 9 20" />
    <Path d="M20 4v7a4 4 0 0 1-4 4H4" />
  </Svg>
);

export const Sparkles: React.FC<SvgProps> = ({
  size = 24,
  color = '#d97706',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <Path d="M5 3v4" />
    <Path d="M19 17v4" />
    <Path d="M3 5h4" />
    <Path d="M17 19h4" />
  </Svg>
);

export const Palette: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="13.5" cy="6.5" r=".5" fill={color} />
    <Circle cx="17.5" cy="10.5" r=".5" fill={color} />
    <Circle cx="8.5" cy="7.5" r=".5" fill={color} />
    <Circle cx="6.5" cy="12.5" r=".5" fill={color} />
    <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
  </Svg>
);

export const Image: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <Circle cx="9" cy="9" r="2" />
    <Path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </Svg>
);

export const ImageIcon = Image;

export const Bold: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M6 12h9a4 4 0 0 1 0 8H6v-8Z" />
    <Path d="M6 4h8a4 4 0 0 1 0 8H6V4Z" />
  </Svg>
);

export const Italic: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Line x1="19" y1="4" x2="10" y2="4" />
    <Line x1="14" y1="20" x2="5" y2="20" />
    <Line x1="15" y1="4" x2="9" y2="20" />
  </Svg>
);

export const Underline: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <Line x1="4" y1="21" x2="20" y2="21" />
  </Svg>
);

export const Strikethrough: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M16 4H9a3 3 0 0 0-2.83 4" />
    <Path d="M14 12a4 4 0 0 1 0 8H6" />
    <Line x1="4" y1="12" x2="20" y2="12" />
  </Svg>
);

export const StickyNote: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
    <Path d="M15 3v5a2 2 0 0 0 2 2h5" />
  </Svg>
);

export const Inbox: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <Path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </Svg>
);

export const Archive: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="20" height="5" x="2" y="3" rx="1" />
    <Path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <Path d="M10 12h4" />
  </Svg>
);

export const Layers: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <Path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <Path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </Svg>
);

export const BookOpen: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Svg>
);

export const Smartphone: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <Path d="M12 18h.01" />
  </Svg>
);

export const ExternalLink: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <Polyline points="15 3 21 3 21 9" />
    <Line x1="10" y1="14" x2="21" y2="3" />
  </Svg>
);

export const BellRing: React.FC<SvgProps> = ({
  size = 24,
  color = '#d97706',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    <Path d="M4 2C2.8 3.7 2 5.7 2 8" />
    <Path d="M22 8c0-2.3-.8-4.3-2-6" />
  </Svg>
);

export const Flag: React.FC<SvgProps> = ({
  size = 24,
  color = '#ef4444',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <Line x1="4" y1="22" x2="4" y2="15" />
  </Svg>
);

export const Volume2: React.FC<SvgProps> = ({
  size = 24,
  color = '#10b981',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </Svg>
);

export const VolumeX: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <Line x1="23" y1="9" x2="17" y2="15" />
    <Line x1="17" y1="9" x2="23" y2="15" />
  </Svg>
);

export const ListFilter: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M3 6h18" />
    <Path d="M7 12h10" />
    <Path d="M10 18h4" />
  </Svg>
);

export const CalendarDays: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
    <Path d="M8 14h.01" />
    <Path d="M12 14h.01" />
    <Path d="M16 14h.01" />
    <Path d="M8 18h.01" />
    <Path d="M12 18h.01" />
    <Path d="M16 18h.01" />
  </Svg>
);

export const RotateCw: React.FC<SvgProps> = ({
  size = 24,
  color = '#78716c',
  fill = 'none',
  strokeWidth = 2,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <Path d="M21 3v5h-5" />
  </Svg>
);
