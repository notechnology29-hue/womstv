import { fetchShowById, fetchFeaturedShows } from "@/lib/supabase";
import { notFound } from "next/navigation";
import InteractivePlayer from "./InteractivePlayer";

export default async function WatchPage({ params }) {
  // Fetch the data on the server
  const show = await fetchShowById(params.id);
  const relatedShows = await fetchFeaturedShows();

  // Handle missing content
  if (!show) {
    notFound();
  }

  // Pass the data to the Client Component
  return <InteractivePlayer show={show} relatedShows={relatedShows} />;
}