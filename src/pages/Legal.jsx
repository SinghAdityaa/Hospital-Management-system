import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
function LegalPage({ title, children }) {
  return (
    <>
      <Navbar />
      <main className="section container readable legal-page">
        <h1>{title}</h1>
        <p className="muted">Last updated: 10 October 2026</p>
        {children}
      </main>
      <Footer />
    </>
  );
}
export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy policy">
      <h2>About this demonstration</h2>
      <p>
        HealthCare+ is a frontend demonstration, not an operating healthcare provider. Do not enter
        real patient information, medical reports, passwords used elsewhere, or other sensitive
        personal data.
      </p>
      <h2>Information stored</h2>
      <p>
        Sample accounts, registration fields, appointment requests, prescriptions and laboratory
        reports are stored in this browser using localStorage. The demonstration has no connected
        server and does not transmit this information to an application backend.
      </p>
      <h2>Storage and removal</h2>
      <p>
        Data remains in the browser until its local storage is cleared. Clearing the website's
        stored data removes locally saved sample changes and sessions.
      </p>
      <h2>Third-party services</h2>
      <p>
        This demonstration does not intentionally include tracking or analytics integrations. Your
        hosting provider may still process technical requests when the site is deployed.
      </p>
      <h2>Before production use</h2>
      <p>
        This policy must be reviewed and replaced with an accurate production privacy policy
        covering the actual operator, contact details, infrastructure, processors, data retention,
        rights, and applicable laws before collecting real user data.
      </p>
    </LegalPage>
  );
}
export function TermsAndConditions() {
  return (
    <LegalPage title="Terms and conditions">
      <h2>Demo use only</h2>
      <p>
        HealthCare+ provides sample frontend workflows for software development and testing. It does
        not provide medical advice, treatment, emergency services, or confirmed appointments with
        real doctors.
      </p>
      <h2>No medical reliance</h2>
      <p>
        All doctors, records, appointment details, fees, and workflows supplied with the demo are
        illustrative. Do not rely on them for healthcare decisions or submit genuine medical
        information.
      </p>
      <h2>Data limitations</h2>
      <p>
        Information is stored locally in your browser and is not backed up by a server. Demo
        accounts are not secure authentication. Browser storage can be modified or erased.
      </p>
      <h2>Deployment</h2>
      <p>
        Before offering HealthCare+ to real users, the application requires a secure backend,
        production authentication, data protection review, operating contact information, and
        legally reviewed terms.
      </p>
    </LegalPage>
  );
}
