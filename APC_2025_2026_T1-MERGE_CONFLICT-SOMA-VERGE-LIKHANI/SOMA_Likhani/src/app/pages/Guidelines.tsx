import { useCustomTheme } from "../components/providers/ThemeContext";
import { Navbar } from "../components/layout/Navbar";
import { BackButton } from "../components/navigation/BackButton";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function Guidelines() {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  const mutedText = isDark ? "text-gray-300" : "text-gray-700";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const introText = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen transition-colors ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f7f6f3] text-gray-900"}`}>
      <Navbar />

      {/* Main Content — full 12-column site-grid container */}
      <main className="w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 lg:px-8 pt-8 pb-24">

        {/* Back button — container-edge aligned */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Title Block */}
        <div className="max-w-[960px] mb-12">
          <h1 className={`font-['Poppins'] font-extrabold text-4xl mb-5 ${headingColor}`}>
            Submission Guidelines
          </h1>
          <p className={`font-['Poppins'] text-[16px] leading-relaxed ${introText}`}>
            The Likhani Archive exists to preserve the best of APC-SoMA's creative output — works that demonstrate academic rigor, technical craftsmanship, and intentional storytelling. These guidelines exist to ensure that every archived entry meets the institutional standards required for long-term preservation and public scholarly access. By adhering to these requirements, student creators contribute to a curated body of work that reflects the integrity and ambition of the School of Multimedia Arts and serves as a meaningful reference for future generations of practitioners.
          </p>
        </div>

        {/* Sections — 48px between each, content at ~8-col width */}
        <div className="max-w-[960px] space-y-12">

          {/* Section 1 — Eligibility Requirements */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-5 ${headingColor}`}>
              Eligibility Requirements
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${mutedText}`}>
              To be considered for inclusion in the Likhani Archive, submitted works must meet foundational eligibility criteria that confirm academic authorship, institutional endorsement, and collaborative consent.
            </p>
            <ul className={`space-y-3 font-['Poppins'] text-[16px] leading-relaxed ${mutedText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Submissions must be original multimedia works created by current or former APC-SoMA students, produced during their enrollment at the institution.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Works must be directly tied to formal coursework or academic projects and must carry the endorsement of at least two APC faculty members who supervised or evaluated the work.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>All named contributors and collaborators — including crew members, on-screen talent, and co-creators — must provide written consent for archival storage and public viewing within the platform.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 — Technical Standards */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-5 ${headingColor}`}>
              Technical Standards
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${mutedText}`}>
              Archival quality depends on consistent technical standards across all submissions. Files that do not meet these specifications may be returned for revision prior to review.
            </p>
            <ul className={`space-y-3 font-['Poppins'] text-[16px] leading-relaxed ${mutedText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span><strong>Video Format:</strong> Accepted formats are MP4, MOV, and AVI. All submissions must meet a minimum resolution of 1920×1080 (Full HD) to ensure viewing quality across display environments.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span><strong>Audio Quality:</strong> Dialogue and ambient audio must be clear and audible with minimal background noise. AAC or WAV codecs are preferred for optimal archive compatibility.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span><strong>Subtitles:</strong> Where applicable — particularly for documentary and narrative works — an SRT subtitle file with accurate timestamps and correct grammar is required for accessibility compliance.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 — Metadata & Documentation */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-5 ${headingColor}`}>
              Metadata & Documentation
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${mutedText}`}>
              Complete and accurate metadata ensures that archived works are discoverable, properly attributed, and correctly classified within the archive's cataloguing system.
            </p>
            <ul className={`space-y-3 font-['Poppins'] text-[16px] leading-relaxed ${mutedText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Provide a concise logline of 1–2 sentences that clearly summarizes the work's central theme, narrative premise, or conceptual intent — written for an academic audience.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Include the work's genre classification, relevant theoretical framework or academic context, and searchable keywords to support discoverability within the archive index.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Provide a complete list of all contributors — including director, editor, cinematographer, sound designer, and other key roles — with accurate full names, student IDs where applicable, and their specific contributions to the work.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 — Content Guidelines */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-5 ${headingColor}`}>
              Content Guidelines
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${mutedText}`}>
              All works published in the Likhani Archive are publicly accessible and represent the institution. Submitted content must meet the ethical and academic standards consistent with APC-SoMA's institutional identity.
            </p>
            <ul className={`space-y-3 font-['Poppins'] text-[16px] leading-relaxed ${mutedText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Content must reflect Asia Pacific College's academic values and ethical standards, contributing positively to the institution's public archive and its representation of student achievement.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Works that depict mature themes, graphic content, or sensitive subject matter must include appropriate age-rating disclosures and on-screen content warnings at the start of the work.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>The use of copyrighted music, footage, or third-party intellectual property is not permitted unless accompanied by proper licensing documentation or a written fair-use justification reviewed by the archive team.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 — Review & Approval Process */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-5 ${headingColor}`}>
              Review & Approval Process
            </h2>
            <div className={`space-y-4 font-['Poppins'] text-[16px] leading-relaxed ${mutedText}`}>
              <p>
                All submissions are evaluated through a structured multi-stage review process designed to uphold academic merit, technical integrity, and metadata completeness before any work is made publicly accessible.
              </p>
              <ol className="space-y-3 pl-5 list-decimal">
                <li>
                  <strong>Faculty Endorsement:</strong> Two qualified faculty members review the submission for academic merit, conceptual coherence, and alignment with institutional standards. Both endorsements are required before advancing.
                </li>
                <li>
                  <strong>Administrative Review:</strong> Archive administrators conduct a secondary check to verify technical compliance — file format, resolution, audio quality — and confirm that all required metadata fields are complete and accurate.
                </li>
                <li>
                  <strong>Publication:</strong> Once both stages are cleared, the work is published to the public archive with full contributor attribution, category classification, and a permanent archive entry.
                </li>
              </ol>
              <p className="italic pt-1">
                Estimated review time: 7–14 business days from the date of submission. Email notifications will be sent at each stage of the process.
              </p>
            </div>
          </section>

          {/* Section 6 — Rights & Permissions */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-5 ${headingColor}`}>
              Rights & Permissions
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${mutedText}`}>
              Submitting a work to the Likhani Archive does not transfer ownership. Creators retain full authorship and copyright over their works at all times.
            </p>
            <ul className={`space-y-3 font-['Poppins'] text-[16px] leading-relaxed ${mutedText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>By submitting your work, you grant Asia Pacific College a non-exclusive, royalty-free license to archive, display, and showcase your work within the Likhani platform for educational and institutional purposes.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>You retain full copyright and all intellectual property rights to your work. The archive license does not extend to commercial use or redistribution outside of APC-SoMA platforms.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>If you wish to remove your work from the archive at any time, submit a formal removal request through the My Submissions section of your profile. Requests are reviewed within 5 business days.</span>
              </li>
            </ul>
          </section>

          {/* Contact block */}
          <section className={`p-6 rounded-xl border ${isLightsOut ? "bg-[#000000] border-gray-700" : isDim ? "bg-[#253341] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <p className={`font-['Poppins'] text-[15px] leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <strong>Questions about the submission process?</strong> Reach out to the Likhani Archive Team at{" "}
              <a href="mailto:likhani@apc.edu.ph" className="text-[#8a181a] hover:underline font-bold">
                likhani@apc.edu.ph
              </a>{" "}
              for guidance on submissions, technical requirements, or removal requests. The team typically responds within 2–3 business days.
            </p>
          </section>


        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
