import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const defaults = { size: 22, color: 'currentColor', strokeWidth: 1.8 };

export function IconHome({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 11l9-8 9 8" />
      <Path d="M5 10v10h14V10" />
    </Svg>
  );
}

export function IconRoute({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={6} cy={19} r={2} />
      <Circle cx={18} cy={5} r={2} />
      <Path d="M6 17V9a4 4 0 0 1 4-4h4" />
      <Path d="M18 7v8a4 4 0 0 1-4 4h-4" />
    </Svg>
  );
}

export function IconHelp({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} />
      <Path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" />
      <Path d="M12 17h.01" />
    </Svg>
  );
}

export function IconSettings({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </Svg>
  );
}

export function IconArrowR({ size = 16, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 5l7 7-7 7" />
    </Svg>
  );
}

export function IconChevR({ size = 16, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function IconChevL({ size = 16, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

export function IconPin({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={10} r={3} />
      <Path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12Z" />
    </Svg>
  );
}

export function IconSensor({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Circle cx={12} cy={12} r={9} />
      <Circle cx={12} cy={12} r={5} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
    </Svg>
  );
}

export function IconBus({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={4} y={4} width={16} height={14} rx={2} />
      <Circle cx={8} cy={20} r={1.5} />
      <Circle cx={16} cy={20} r={1.5} />
      <Path d="M4 12h16M9 4v8M15 4v8" />
    </Svg>
  );
}

export function IconTaxi({ size = 22, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 14l2-5h14l2 5" />
      <Path d="M3 14v5h18v-5" />
      <Circle cx={7} cy={18} r={1.5} />
      <Circle cx={17} cy={18} r={1.5} />
      <Path d="M9 7V5h6v2" />
    </Svg>
  );
}

export function IconClock({ size = 16, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7v5l3 3" />
    </Svg>
  );
}

export function IconCheck({ size = 16, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12l4 4 10-10" />
    </Svg>
  );
}

export function IconQR({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={3} width={7} height={7} />
      <Rect x={14} y={3} width={7} height={7} />
      <Rect x={3} y={14} width={7} height={7} />
      <Path d="M14 14h3v3M21 14v7M14 21h3" />
    </Svg>
  );
}

export function IconNav({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 11l19-8-8 19-2-9-9-2Z" />
    </Svg>
  );
}

export function IconSparkle({ size = 16, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </Svg>
  );
}

export function IconSearch({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={11} cy={11} r={7} />
      <Path d="M21 21l-4.3-4.3" />
    </Svg>
  );
}

export function IconPlus({ size = 14, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconMinus({ size = 14, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14" />
    </Svg>
  );
}

export function IconFilter({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18M6 12h12M10 18h4" />
    </Svg>
  );
}

export function IconExternalLink({ size = 12, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 17L17 7" />
      <Path d="M8 7h9v9" />
    </Svg>
  );
}
