import svgPaths from "./svg-ji5q6r7me4";

interface Group631Props {
  color?: string;
}

export default function Group631({ color = "black" }: Group631Props) {
  return (
    <div className="relative size-full">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 318 318">
        <g clipPath="url(#clip0_319_23)" id="Group 631">
          <circle cx="159" cy="159" id="Ellipse 1" r="151.5" stroke={color} strokeWidth="15" />
          <circle cx="158.5" cy="101.5" id="Ellipse 2" r="50" stroke={color} strokeWidth="15" />
          <path d={svgPaths.p17e4d498} id="Ellipse 3" stroke={color} strokeLinecap="round" strokeWidth="15" />
        </g>
        <defs>
          <clipPath id="clip0_319_23">
            <rect fill="white" height="318" width="318" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}