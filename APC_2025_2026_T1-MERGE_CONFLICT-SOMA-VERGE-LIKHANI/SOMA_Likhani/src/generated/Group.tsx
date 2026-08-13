import svgPaths from "./svg-jqzqrq9ch4";

export default function Group() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 507 119.628">
          <g filter="url(#dropShadow1_group)" id="Group">
            <g filter="url(#dropShadow2_group)">
              <path d={svgPaths.p20ce0b00} fill="url(#paint0_radial_423_1725)" />
              <path d={svgPaths.pbedaa00} fill="#1a1a1a" />
              <path d={svgPaths.p27420672} fill="#DF2129" />
              <path d={svgPaths.p2ab2f600} fill="#1a1a1a" />
              <path d={svgPaths.p2c14b300} fill="#1a1a1a" />
              <path d={svgPaths.p32a6a770} fill="#1a1a1a" />
              <path d={svgPaths.p26959700} fill="#1a1a1a" />
              <path d={svgPaths.p2c1fbb80} fill="#1a1a1a" />
            </g>
          </g>
          <defs>
            <filter id="dropShadow1_group" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2.35" />
              <feOffset dx="4" dy="4" result="offsetblur1" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.41" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dropShadow2_group" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="-5" dy="9" result="offsetblur2" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.25" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient cx="0" cy="0" gradientTransform="translate(162.946 55.5151) scale(40.1001 40.1018)" gradientUnits="userSpaceOnUse" id="paint0_radial_423_1725" r="1">
              <stop stopColor="#DF2129" />
              <stop offset="1" stopColor="#660000" />
            </radialGradient>
          </defs>
        </svg>
    </div>
  );
}