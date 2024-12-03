import React from "react";

const AcceptableUse = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Acceptable Use Policy</h1>
        <p className="mb-4">
          This Acceptable Use Policy outlines acceptable and prohibited
          activities when using our services.
        </p>
        <h2 className="text-xl font-semibold mb-2">Prohibited Activities</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Engaging in unlawful activities.</li>
          <li>Distributing harmful or malicious software.</li>
          <li>
            Posting or transmitting offensive, defamatory, or obscene content.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Enforcement</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          this policy. If you have any questions, contact us at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-500 underline"
          >
            support@example.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AcceptableUse;
