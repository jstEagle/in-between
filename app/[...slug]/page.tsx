import type { Metadata } from "next";
import { GeneratedPageView } from "@/components/layouts/GeneratedPageView";
import { generatePage, generatePageModel } from "@/lib/generatePage";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = generatePageModel(`/${slug.join("/")}`);
  return {
    title: `${page.title} | in between space`,
    description: `${page.genreFormula.surface} remembering ${page.genreFormula.residue}.`,
    icons: {
      icon: `/favicon.svg?seed=${encodeURIComponent(page.routeState.seed)}&label=${encodeURIComponent(page.genreFormula.surface)}`
    }
  };
}

export default async function GeneratedRoutePage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await generatePage(`/${slug.join("/")}`);
  return <GeneratedPageView page={page} />;
}
