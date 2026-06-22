"use client";

import dynamic from "next/dynamic";

const PortfolioPage = dynamic(() => import("@/components/PortfolioPage/PortfolioPage"), {
  ssr: false,
  loading: () => (
    <div
      id="loading-screen"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "#f06236",
      }}
    >
      <div id="loading-ui">
        <img src="/assets/logo.svg" id="loading-logo" alt="Loading..." />
        <div id="loading-progress">0%</div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <PortfolioPage />;
}
