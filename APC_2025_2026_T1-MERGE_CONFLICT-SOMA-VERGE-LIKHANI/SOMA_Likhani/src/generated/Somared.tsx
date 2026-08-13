import svgPaths from "./svg-1wa9ev62z2";

interface SomaredProps {
  color?: string;
}

function Group({ color = "#E21E2A" }: SomaredProps) {
  return (
    <div className="absolute contents inset-[0_0.88%_-0.96%_0]" data-name="Group">
      <p className="absolute font-['Futura_PT:Book',sans-serif] inset-[74.61%_0.88%_-0.96%_0.34%] leading-[normal] not-italic text-[7.4px]" style={{ color }}>{`SCHOOL OF MULTIMEDIA & ARTS`}</p>
      <div className="absolute inset-[0.72%_85.12%_34.87%_0]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.629 23.8289">
          <path d={svgPaths.p1e697400} fill={color} id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_61.59%_34.16%_15.52%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0347 24.3626">
          <path d={svgPaths.p3e251a00} fill={color} id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0.34%_25.51%_34.15%_40.48%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.7087 24.2422">
          <path d={svgPaths.p3fe6b100} fill={color} id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0.74%_1.33%_34.57%_76.36%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4226 23.9344">
          <path d={svgPaths.p22ba3280} fill={color} id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Layer({ color }: SomaredProps) {
  return (
    <div className="absolute contents inset-[0_0.88%_-0.96%_0]" data-name="Layer 1">
      <Group color={color} />
    </div>
  );
}

function SomaredTransparent({ color }: SomaredProps) {
  return (
    <div className="-translate-y-1/2 absolute h-[37px] left-0 overflow-clip top-[calc(50%+1px)] w-[105px]" data-name="somared_transparent 2">
      <Layer color={color} />
    </div>
  );
}

export default function Somared({ color = "#E21E2A" }: SomaredProps) {
  return (
    <div className="relative size-full" data-name="Somared">
      <SomaredTransparent color={color} />
    </div>
  );
}