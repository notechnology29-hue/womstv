import { fetchFeaturedShows, fetchShowById } from "@/lib/supabase";
import { notFound } from "next/navigation";
import InteractivePlayer from "./InteractivePlayer";

export const dynamic = "force-dynamic";

export default async function WatchPage({ params }) {
  const { id } = await params;
  const show = await fetchShowById(id);
  const relatedShows = await fetchFeaturedShows();

  if (!show) {
    return notFound();
  }

  return <InteractivePlayer show={show} relatedShows={relatedShows} />;
}