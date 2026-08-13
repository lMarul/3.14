import svgPaths from "./svg-vuqkvvmkt6";

function Group() {
  return (
    <div className="absolute inset-[0_7.64%_0.81%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 125.607 30.9681">
        <g id="Group">
          <g id="Group_2">
            <path d={svgPaths.p8081700} fill="var(--fill-0, #2D2D2D)" id="Vector" />
            <path d={svgPaths.pd358f00} fill="var(--fill-0, #2D2D2D)" id="Vector_2" />
            <path d={svgPaths.p311a9b00} fill="var(--fill-0, #2D2D2D)" id="Vector_3" />
            <path d={svgPaths.p3552c5f0} fill="var(--fill-0, #1A1A1A)" id="Vector_4" />
          </g>
          <path d={svgPaths.p114d3680} fill="var(--fill-0, #2D2D2D)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[0.81%_67.26%_0_16.35%]" data-name="Group">
      <div className="absolute inset-[0_-0.01%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.2892 30.9662">
          <g id="Group">
            <path d={svgPaths.p33cb3a00} fill="var(--fill-0, #88181A)" id="Vector" />
            <path d={svgPaths.p4f27d00} fill="var(--fill-0, white)" id="Vector_2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[0_7.64%_0_0]" data-name="Group">
      <Group />
      <Group1 />
    </div>
  );
}

export default function Layer() {
  return (
    <div className="relative size-full" data-name="Layer 2">
      <Group2 />
      <div className="absolute inset-[10.92%_0_0.91%_94.96%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.84772 27.5272">
          <path d={svgPaths.p15321e00} fill="var(--fill-0, #1A1A1A)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}