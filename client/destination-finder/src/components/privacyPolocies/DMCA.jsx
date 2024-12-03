import React from "react";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">
          DMCA Notice & Takedown Policy
        </h1>
        <p className="mb-4">
          We respect copyright laws and take infringement claims seriously. This
          policy explains how to report an infringement.
        </p>
        <h2 className="text-xl font-semibold mb-2">
          How to Submit a DMCA Notice
        </h2>
        <p className="mb-4">
          If you believe that your work has been copied in a way that
          constitutes copyright infringement, please provide the following
          information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            A description of the copyrighted work that you claim has been
            infringed.
          </li>
          <li>
            A description of where the infringing material is located on our
            site.
          </li>
          <li>
            Your contact information, including name, address, email, and phone
            number.
          </li>
          <li>
            A statement that you believe in good faith that the use of the
            material is not authorized by the copyright owner, its agent, or the
            law.
          </li>
          <li>Your signature (physical or electronic).</li>
        </ul>
        <p>
          Send notices to:{" "}
          <a
            href="mailto:copyright@example.com"
            className="text-blue-500 underline"
          >
            copyright@example.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default DMCA;
