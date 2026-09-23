import { fetchFeaturedShows, fetchShowById } from "@/lib/supabase";
import { notFound } from "next/navigation";
import InteractivePlayer from "./InteractivePlayer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const show = await fetchShowById(id);

  if (!show) {
    return {
      title: "Show Not Found | Word of Mouth Television",
    };
  }

  const title = `${show.title} | Word of Mouth Television`;
  const description = show.description ?? `Watch ${show.title} on Word of Mouth Television.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function WatchPage({ params }) {
  const { id } = await params;
  const show = await fetchShowById(id);
  const relatedShows = await fetchFeaturedShows();

  if (!show) {
    return notFound();
  }

  return <InteractivePlayer show={show} relatedShows={relatedShows} />;
}