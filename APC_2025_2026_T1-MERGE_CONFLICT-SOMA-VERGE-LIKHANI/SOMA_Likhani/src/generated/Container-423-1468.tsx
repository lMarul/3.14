import svgPaths from "./svg-denpg913sq";
import imgImageAsiaPacificCollege from "figma:asset/17fb449f5f8c6600256e2bce222094b5c3395da0.png";

function ImageAsiaPacificCollege() {
  return (
    <div className="h-[87.997px] relative shrink-0 w-[112.812px]" data-name="Image (Asia Pacific College)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageAsiaPacificCollege} />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute content-stretch flex h-[9.744px] items-start left-[0.36px] top-[27.59px] w-[103.722px]" data-name="Group">
      <p className="font-['Futura_PT:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#e21e2a] text-[7.4px] whitespace-nowrap">{`SCHOOL OF MULTIMEDIA & ARTS`}</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[23.835px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.625 23.8352">
        <path d={svgPaths.pfd1fa00} fill="var(--fill-0, #E21E2A)" id="Vector" />
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.835px] items-start left-0 top-[0.26px] w-[15.625px]" data-name="Group">
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[24.361px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0483 24.3608">
        <path d={svgPaths.p2d9f09f0} fill="var(--fill-0, #E21E2A)" id="Vector" />
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[24.361px] items-start left-[16.29px] top-0 w-[24.048px]" data-name="Group">
      <Icon1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[24.247px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.7244 24.2472">
        <path d={svgPaths.p4aa1400} fill="var(--fill-0, #E21E2A)" id="Vector" />
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[24.247px] items-start left-[42.5px] top-[0.11px] w-[35.724px]" data-name="Group">
      <Icon2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[23.935px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4375 23.9347">
        <path d={svgPaths.p3d5f1d00} fill="var(--fill-0, #E21E2A)" id="Vector" />
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.935px] items-start left-[80.17px] top-[0.27px] w-[23.438px]" data-name="Group">
      <Icon3 />
    </div>
  );
}

function SomaredTransparent() {
  return (
    <div className="absolute h-[36.989px] left-0 overflow-clip top-[26.49px] w-[105px]" data-name="SomaredTransparent">
      <Group />
      <Group1 />
      <Group2 />
      <Group3 />
      <Group4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[88px] relative shrink-0 w-[107px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <SomaredTransparent />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[19.801px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[19.8px] left-0 not-italic text-[#6a7282] text-[12px] top-[-0.09px] whitespace-nowrap">© 2026 Asia Pacific College — School of Multimedia Arts. All rights reserved.</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[18.977px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[18.975px] left-0 not-italic text-[#99a1af] text-[11.5px] top-[-0.09px] whitespace-nowrap">Team SomaVault · Team Metamorphisis</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-[452.159px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Paragraph />
        <Paragraph1 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex gap-[13px] items-center relative size-full" data-name="Container">
      <ImageAsiaPacificCollege />
      <Container1 />
      <Container2 />
    </div>
  );
}