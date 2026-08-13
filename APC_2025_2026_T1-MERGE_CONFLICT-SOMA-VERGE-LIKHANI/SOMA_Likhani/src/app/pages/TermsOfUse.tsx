import { useCustomTheme } from "../components/providers/ThemeContext";
import { BackButton } from "../components/navigation/BackButton";
import { Navbar } from "../components/layout/Navbar";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function TermsOfUse() {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  const bodyText = isDark ? "text-gray-300" : "text-gray-700";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen transition-colors ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f7f6f3] text-gray-900"}`}>
      {/* Unified Navbar — identical to homepage and all internal pages */}
      <Navbar />

      {/* Main Content — full 12-column site-grid container */}
      <main className="w-full max-w-[1200px] mx-auto px-8 pt-8 pb-24">

        {/* Back button — container-edge aligned */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Title Block */}
        <div className="max-w-[960px] mb-12">
          <h1 className={`font-['Poppins'] font-extrabold text-4xl mb-5 ${headingColor}`}>
            Terms of Use
          </h1>
          <p className={`font-['Poppins'] text-[16px] leading-relaxed ${mutedText}`}>
            These Terms of Use govern your access to and use of the Likhani Digital Archive, a curated multimedia platform maintained by Asia Pacific College's School of Multimedia Arts. By accessing the platform, you acknowledge that you have read, understood, and agree to be bound by these terms. Please review this document in full before proceeding.
          </p>
          <p className={`font-['Poppins'] text-[14px] mt-4 ${mutedText}`}>
            Last updated: February 18, 2026
          </p>
        </div>

        {/* Sections — 48px between each, ~8-col content width */}
        <div className="max-w-[960px] space-y-12">

          {/* Section 1 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              1. Acceptance of Terms
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed ${bodyText}`}>
              By accessing and using the Likhani Digital Archive ("the Platform"), you agree to be fully bound by these Terms of Use and all applicable institutional policies of Asia Pacific College. The Platform is a proprietary digital archive managed by APC's School of Multimedia Arts (APC-SoMA) and is intended for the exclusive use of its students, faculty, and authorized personnel. If you do not agree with any portion of these terms, you must discontinue use of the Platform immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              2. Eligibility and Access
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${bodyText}`}>
              Access to Likhani is restricted to verified members of the APC academic community. The following individuals are eligible to access the Platform, subject to credential verification at login:
            </p>
            <ul className={`font-['Poppins'] text-[16px] leading-relaxed space-y-3 mb-4 ${bodyText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Currently enrolled APC-SoMA students authenticated via valid <span className="font-mono text-[14px]">@student.apc.edu.ph</span> institutional credentials.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>APC faculty members and administrative staff with active <span className="font-mono text-[14px]">@apc.edu.ph</span> email credentials.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Authorized guest accounts explicitly approved by the APC-SoMA administration for a defined access period.</span>
              </li>
            </ul>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed ${bodyText}`}>
              Primary access is restricted to the APC campus network. Off-campus access may be granted on a case-by-case basis through institutional VPN credentials with documented authorization from the archive administrator.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              3. Intellectual Property Rights
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${bodyText}`}>
              All content uploaded to the Likhani Archive — including but not limited to films, video works, animations, documentaries, and other multimedia productions — remains the exclusive intellectual property of the original creators, whether individual students, faculty members, or collaborative groups. The Platform does not claim ownership over any user-submitted content.
            </p>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed ${bodyText}`}>
              By voluntarily submitting a work to the archive, creators grant APC-SoMA a non-exclusive, royalty-free, non-transferable license to display, store, catalogue, and showcase the work within the Likhani platform for educational, institutional, and promotional purposes. This license does not extend to commercial use, redistribution, or modification of the work without the creator's written consent.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              4. Prohibited Use
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${bodyText}`}>
              All users of the Likhani Archive are expected to engage with the platform in good faith and in accordance with institutional policies. The following activities are strictly prohibited and may result in immediate access revocation and disciplinary action:
            </p>
            <ul className={`font-['Poppins'] text-[16px] leading-relaxed space-y-3 ${bodyText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Downloading, reproducing, screen-recording, or distributing any archived content without explicit written permission from the original creator.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Using any archived work or portion thereof for commercial purposes, monetization, or for-profit initiatives of any kind.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Modifying, re-editing, dubbing over, or misrepresenting any archived content in a manner that distorts the creator's original intent or attribution.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Sharing login credentials, session tokens, or otherwise enabling unauthorized third-party access to the Platform.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Uploading malicious software, harmful scripts, inappropriate content, or material that infringes upon third-party copyrights or intellectual property rights.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              5. Content Removal and Reporting
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${bodyText}`}>
              Creators retain the right to request removal of their archived work at any time by submitting a formal takedown request through the Platform's "Report / Request Removal" feature, accessible from any work's detail page. All removal requests will be reviewed and processed within 5 business days of submission.
            </p>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed ${bodyText}`}>
              APC-SoMA reserves the right to remove, restrict, or unpublish any content that is found to violate community standards, institutional policies, applicable laws, or third-party intellectual property rights — with or without prior notice. Users who observe policy-violating content are encouraged to submit a report through the Platform's reporting interface for administrative review.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              6. Privacy and Data Protection
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed ${bodyText}`}>
              The Likhani Archive collects and processes user data in strict accordance with APC's institutional Privacy Policy and the Data Privacy Act of 2012 (Republic Act No. 10173). Data collected may include authentication logs, content interaction history, submission records, and user preferences. This data is used solely for platform improvement, institutional record-keeping, and the ongoing development of the archive. No user data is shared with third parties outside of APC without explicit consent or legal mandate.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              7. Limitation of Liability
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-4 ${bodyText}`}>
              To the fullest extent permitted by applicable law, APC-SoMA and the Likhani Archive Team shall not be held liable for any damages, losses, or disruptions arising from the following circumstances:
            </p>
            <ul className={`font-['Poppins'] text-[16px] leading-relaxed space-y-3 ${bodyText}`}>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Loss, corruption, or inaccessibility of user data resulting from technical failures, system maintenance, or unforeseen infrastructure issues.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Unauthorized access to user accounts arising from the user's own failure to maintain credential security or comply with Platform security protocols.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Third-party intellectual property claims arising from content uploaded or submitted to the archive by users.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8a181a] font-bold mt-[2px]">•</span>
                <span>Service interruptions, slowdowns, or extended unavailability caused by network outages, scheduled maintenance, or external technical dependencies.</span>
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              8. Modifications to Terms
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed ${bodyText}`}>
              APC-SoMA reserves the right to revise, update, or replace these Terms of Use at any time to reflect changes in institutional policy, applicable law, or Platform functionality. Users will be notified of significant updates via institutional email or an in-platform notification banner. Continued use of the Likhani Archive following the effective date of any modification constitutes your acknowledgment and acceptance of the revised terms.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className={`font-['Poppins'] font-bold text-2xl mb-6 ${headingColor}`}>
              9. Contact Information
            </h2>
            <p className={`font-['Poppins'] text-[16px] leading-relaxed mb-6 ${bodyText}`}>
              For questions, concerns, formal requests, or clarifications regarding these Terms of Use, please reach out to the Likhani Archive Team through the following contact points. All inquiries are typically addressed within 2–3 business days.
            </p>
            <div className={`p-6 rounded-xl border font-['Poppins'] ${isLightsOut ? "bg-[#000000] border-gray-700" : isDim ? "bg-[#253341] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <p className={`font-bold text-[16px] mb-3 ${headingColor}`}>Likhani Archive Support Team</p>
              <div className={`space-y-2 text-[15px] ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <a href="mailto:likhani.support@apc.edu.ph" className="text-[#8a181a] hover:underline">
                    likhani.support@apc.edu.ph
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Office:</span> APC School of Multimedia Arts, 3 Humabon Place, Magallanes, Makati City
                </p>
              </div>
            </div>
          </section>


        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}