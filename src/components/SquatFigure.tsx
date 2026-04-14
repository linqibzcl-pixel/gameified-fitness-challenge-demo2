interface SquatFigureProps {
  isSquatting: boolean;
  isActive: boolean;
}

const standing = {
  headCy: 18,
  neckY1: 28, neckY2: 36,
  leftArmX2: 24, leftArmY2: 60,
  rightArmX2: 76, rightArmY2: 60,
  bodyY1: 36, bodyY2: 74,
  leftThighX2: 37, leftThighY2: 104,
  rightThighX2: 63, rightThighY2: 104,
  leftShinX1: 37, leftShinY1: 104, leftShinX2: 34, leftShinY2: 136,
  rightShinX1: 63, rightShinY1: 104, rightShinX2: 66, rightShinY2: 136,
};

const squatting = {
  headCy: 36,
  neckY1: 46, neckY2: 54,
  leftArmX2: 16, leftArmY2: 74,
  rightArmX2: 84, rightArmY2: 74,
  bodyY1: 54, bodyY2: 74,
  leftThighX2: 20, leftThighY2: 90,
  rightThighX2: 80, rightThighY2: 90,
  leftShinX1: 20, leftShinY1: 90, leftShinX2: 30, leftShinY2: 118,
  rightShinX1: 80, rightShinY1: 90, rightShinX2: 70, rightShinY2: 118,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function SquatFigure({ isSquatting, isActive }: SquatFigureProps) {
  const t = isSquatting ? 1 : 0;
  const s = standing;
  const q = squatting;

  const v = {
    headCy: lerp(s.headCy, q.headCy, t),
    neckY1: lerp(s.neckY1, q.neckY1, t),
    neckY2: lerp(s.neckY2, q.neckY2, t),
    leftArmX2: lerp(s.leftArmX2, q.leftArmX2, t),
    leftArmY2: lerp(s.leftArmY2, q.leftArmY2, t),
    rightArmX2: lerp(s.rightArmX2, q.rightArmX2, t),
    rightArmY2: lerp(s.rightArmY2, q.rightArmY2, t),
    bodyY1: lerp(s.bodyY1, q.bodyY1, t),
    bodyY2: lerp(s.bodyY2, q.bodyY2, t),
    leftThighX2: lerp(s.leftThighX2, q.leftThighX2, t),
    leftThighY2: lerp(s.leftThighY2, q.leftThighY2, t),
    rightThighX2: lerp(s.rightThighX2, q.rightThighX2, t),
    rightThighY2: lerp(s.rightThighY2, q.rightThighY2, t),
    leftShinX1: lerp(s.leftShinX1, q.leftShinX1, t),
    leftShinY1: lerp(s.leftShinY1, q.leftShinY1, t),
    leftShinX2: lerp(s.leftShinX2, q.leftShinX2, t),
    leftShinY2: lerp(s.leftShinY2, q.leftShinY2, t),
    rightShinX1: lerp(s.rightShinX1, q.rightShinX1, t),
    rightShinY1: lerp(s.rightShinY1, q.rightShinY1, t),
    rightShinX2: lerp(s.rightShinX2, q.rightShinX2, t),
    rightShinY2: lerp(s.rightShinY2, q.rightShinY2, t),
  };

  const color = isActive ? '#30d158' : '#636366';
  const glowColor = isActive ? 'rgba(48, 209, 88, 0.45)' : 'transparent';

  return (
    <svg
      viewBox="0 0 100 150"
      width="160"
      height="240"
      style={{
        filter: isActive ? `drop-shadow(0 0 12px ${glowColor})` : 'none',
        transition: 'filter 0.3s ease',
      }}
    >
      <circle
        cx="50"
        cy={v.headCy}
        r="10"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1="50" y1={v.neckY1}
        x2="50" y2={v.neckY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1="50" y1={v.bodyY1}
        x2={v.leftArmX2} y2={v.leftArmY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1="50" y1={v.bodyY1}
        x2={v.rightArmX2} y2={v.rightArmY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1="50" y1={v.bodyY1}
        x2="50" y2={v.bodyY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1="50" y1={v.bodyY2}
        x2={v.leftThighX2} y2={v.leftThighY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1="50" y1={v.bodyY2}
        x2={v.rightThighX2} y2={v.rightThighY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1={v.leftShinX1} y1={v.leftShinY1}
        x2={v.leftShinX2} y2={v.leftShinY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1={v.rightShinX1} y1={v.rightShinY1}
        x2={v.rightShinX2} y2={v.rightShinY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1={v.leftShinX2 - 6} y1={v.leftShinY2}
        x2={v.leftShinX2 + 4} y2={v.leftShinY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <line
        x1={v.rightShinX2 - 4} y1={v.rightShinY2}
        x2={v.rightShinX2 + 6} y2={v.rightShinY2}
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}
