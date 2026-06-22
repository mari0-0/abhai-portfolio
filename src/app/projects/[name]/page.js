import { getProjectBySlug, getAllSlugs } from "@/data/projectsData";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ name: slug }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const project = getProjectBySlug(name);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Abhai Matta`,
    description: `${project.role} — ${project.services.join(", ")}. ${project.intro[0]?.replace(/<[^>]+>/g, "")}`,
  };
}

export default async function ProjectPage({ params }) {
  const { name } = await params;
  const project = getProjectBySlug(name);

  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
