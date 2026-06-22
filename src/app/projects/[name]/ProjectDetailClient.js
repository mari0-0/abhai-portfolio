"use client";

import dynamic from "next/dynamic";

const ProjectDetail = dynamic(
  () => import("@/components/ProjectDetail/ProjectDetail"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#010101",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#f06236",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default function ProjectDetailClient({ project }) {
  return <ProjectDetail key={project.slug} project={project} />;
}
