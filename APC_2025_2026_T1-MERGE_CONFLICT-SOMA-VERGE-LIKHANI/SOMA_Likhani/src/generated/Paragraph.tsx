function Text() {
  return (
    <div className="absolute h-[25.98px] left-[342.73px] top-0 w-[85.54px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[26px] left-[43px] not-italic text-[#4b5563] text-[16px] text-center top-[0.82px] whitespace-nowrap">Animation</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[25.98px] left-[435.72px] top-0 w-[34.148px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[26px] left-[17.5px] not-italic text-[#4b5563] text-[16px] text-center top-[0.82px] whitespace-nowrap">Film</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[25.98px] left-[477.33px] top-0 w-[112.315px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[26px] left-[56.5px] not-italic text-[#4b5563] text-[16px] text-center top-[0.82px] whitespace-nowrap">Documentary</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[25.98px] left-[152.86px] top-[25.98px] w-[51.577px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[26px] left-[26px] not-italic text-[#4b5563] text-[16px] text-center top-[0.82px] whitespace-nowrap">Thesis</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[25.98px] left-[248.03px] top-[25.98px] w-[107.514px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[26px] left-[54px] not-italic text-[#4b5563] text-[16px] text-center top-[0.82px] whitespace-nowrap">Experimental</p>
    </div>
  );
}

export default function Paragraph() {
  return (
    <div className="relative size-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[26px] left-[175.16px] not-italic text-[#4a5565] text-[16px] text-center top-[0.82px] whitespace-nowrap">{`Featuring faculty-endorsed projects from `}</p>
      <Text />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[26px] left-[432.27px] not-italic text-[#4a5565] text-[16px] text-center top-[0.82px] whitespace-nowrap">{`, `}</p>
      <Text1 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[26px] left-[473.87px] not-italic text-[#4a5565] text-[16px] text-center top-[0.82px] whitespace-nowrap">{`, `}</p>
      <Text2 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[26px] left-[591.64px] not-italic text-[#4a5565] text-[16px] text-center top-[0.82px] whitespace-nowrap">{`, `}</p>
      <Text3 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[26px] left-[226.43px] not-italic text-[#4a5565] text-[16px] text-center top-[26.8px] whitespace-nowrap">{`, and `}</p>
      <Text4 />
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[26px] left-[401.54px] not-italic text-[#4a5565] text-[16px] text-center top-[26.8px] whitespace-nowrap">{` disciplines.`}</p>
    </div>
  );
}