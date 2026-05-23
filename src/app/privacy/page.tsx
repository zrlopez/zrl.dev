'use client'

import LegalLayout from '@/components/LegalLayout'

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p><strong>Last updated:</strong> November 2025</p>
      <p>We created this Privacy Policy to explain in clear terms how we collect, use and share personal information when you visit or interact with zrl.dev (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We comply with U.S. privacy laws such as the Texas Data Privacy and Security Act (TDPSA).</p>

      <section className="mb-6">
        <h2>Information We Collect</h2>
        <p>Depending on how you use the Site we may collect:</p>
        <ul>
          <li><strong>Identifiers:</strong> such as your name and email address if you reach out to us.</li>
          <li><strong>Device and usage data:</strong> like IP address, browser details and pages viewed to understand site performance.</li>
          <li><strong>Communications:</strong> any information you choose to provide when you contact us.</li>
        </ul>
        <p>We do not intentionally collect sensitive personal data.</p>
      </section>

      <section className="mb-6">
        <h2>How We Collect Information</h2>
        <p>We gather information directly from you (for example through our contact form), automatically through your browser or device and via trusted service providers that help us run the Site (such as hosting and analytics providers).</p>
      </section>

      <section className="mb-6">
        <h2>How We Use Information</h2>
        <p>We use personal information to:</p>
        <ul>
          <li>Operate, maintain and improve the Site.</li>
          <li>Respond to your inquiries or requests.</li>
          <li>Understand how visitors use the Site, so we can improve its performance and user experience.</li>
          <li>Detect, prevent and address technical or security issues.</li>
          <li>Comply with legal obligations and protect our rights.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2>Sharing Information</h2>
        <p>We may share personal information with:</p>
        <ul>
          <li><strong>Service providers:</strong> companies that host the Site, deliver emails or provide analytics. They are only allowed to use information to perform services for us.</li>
          <li><strong>Legal authorities:</strong> when required by law or to protect our rights.</li>
          <li><strong>Business transfers:</strong> parties involved in a sale, merger or similar transaction.</li>
        </ul>
        <p>We do not sell your personal information or use it for targeted advertising.</p>
      </section>

      <section className="mb-6">
        <h2>Cookies and Analytics</h2>
        <p>We use essential cookies and privacy‑preserving analytics tools to understand how the Site is used. You can adjust your browser settings to manage cookies.</p>
      </section>

      <section className="mb-6">
        <h2>Data Retention</h2>
        <p>We retain personal information only as long as necessary for the purposes described above or as required by law.</p>
      </section>

      <section className="mb-6">
        <h2>Security</h2>
        <p>We use reasonable administrative, technical and physical safeguards to protect personal information. However, no method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.</p>
      </section>

      <section className="mb-6">
        <h2>Your Rights and Choices</h2>
        <p>Depending on where you live, you may have rights to access, correct, delete or receive a copy of your personal information, and to opt out of certain processing. To exercise any of these rights, email us at <a href="mailto:privacy@zrl.dev">privacy@zrl.dev</a>.</p>
      </section>

      <section className="mb-6">
        <h2>Children</h2>
        <p>The Site is not intended for children under 13 and we do not knowingly collect personal information from children.</p>
      </section>

      <section className="mb-6">
        <h2>International Transfers</h2>
        <p>We may process personal information in the United States and other countries where our service providers operate. We take steps to ensure any transfers comply with applicable data protection laws.</p>
      </section>

      <section className="mb-6">
        <h2>Changes to This Policy</h2>
        <p>We may update this Policy from time to time. When we do, we will revise the “Last updated” date at the top of this page. Your continued use of the Site means you accept the updated Policy.</p>
      </section>

      <section className="mb-6">
        <h2>Contact Us</h2>
        <p>If you have any questions about this Policy or your personal information, please contact us at <a href="mailto:privacy@zrl.dev">privacy@zrl.dev</a>.</p>
      </section>
    </LegalLayout>
  )
}
