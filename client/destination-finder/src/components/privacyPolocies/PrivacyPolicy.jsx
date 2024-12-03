import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Privacy and Security Policy</h1>
        <p className="mb-4">
          Your privacy and security are important to us. This policy explains
          how we handle your data and ensure your information remains secure.
        </p>
        <h2 className="text-xl font-semibold mb-2">Data Collection</h2>
        <p className="mb-4">
          We collect only the necessary information required to provide our
          services, including email and account details.
        </p>
        <h2 className="text-xl font-semibold mb-2">Data Usage</h2>
        <p className="mb-4">
          Your data is used solely for the purpose of providing and improving
          our services.
        </p>
        <h2 className="text-xl font-semibold mb-2">Security Measures</h2>
        <p>
          We employ industry-standard measures such as encryption and secure
          authentication protocols to protect your information. If you have any
          questions, contact us at{" "}
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

export default PrivacyPolicy;
