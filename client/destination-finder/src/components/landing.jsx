import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <div
      className="flex flex-col bg-violet-900"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl lg:text-5xl font-bold text-slate-100 mb-4">
          Welcome to My Spots
        </h1>
        <p className="text-lg lg:text-xl text-slate-400 mb-6">
          This websites is for finding and keeping track of your favourite
          locations.
        </p>
        <Link
          to="/map"
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Map
        </Link>
      </main>
    </div>
  );
};
import React, { useState } from "react";

export default LandingPage;
