import svgPaths from "./svg-3ei94t189k";

export default function Likhanionwhite() {
  return (
    <div className="relative size-full" data-name="likhanionwhite 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1532 343">
        <defs>
          <filter id="dropShadow1" x="-50%" y="-50%" width="200%" height="200%">
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
          <filter id="dropShadow2" x="-50%" y="-50%" width="200%" height="200%">
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
          <radialGradient cx="0" cy="0" gradientTransform="translate(487.698 170.334) scale(223.545 223.545)" gradientUnits="userSpaceOnUse" id="paint0_radial_81_44" r="1">
            <stop stopColor="#8A191B" />
            <stop offset="1" stopColor="#380000" />
          </radialGradient>
          <clipPath id="clip0_81_44">
            <rect fill="white" height="343" width="1532" />
          </clipPath>
        </defs>
        <g id="likhanionwhite 1" filter="url(#dropShadow1)">
          <g filter="url(#dropShadow2)">
            <path d={svgPaths.p30973d00} fill="url(#paint0_radial_81_44)" id="Vector" />
            <path d={svgPaths.p1b58a070} fill="#141723" id="Vector_2" />
            <path d={svgPaths.p2b376800} fill="#8A191B" id="Vector_3" />
            <path d={svgPaths.p26e15d00} fill="#141723" id="Vector_4" />
            <path d={svgPaths.p362e4470} fill="#141723" id="Vector_5" />
            <path d={svgPaths.p267bdd00} fill="#141723" id="Vector_6" />
            <path d={svgPaths.p2bf6aa00} fill="#141723" id="Vector_7" />
            <path d={svgPaths.p35510b80} fill="#141723" id="Vector_8" />
          </g>
        </g>
      </svg>
    </div>
  );
}