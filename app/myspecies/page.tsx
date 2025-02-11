import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import SpeciesCard from "../species/species-card"; 

export default async function MySpeciesList() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const sessionId = session.user.id;

  const { data: species, error } = await supabase
    .from("species")
    .select("*")
    .eq("author", sessionId)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching user species:", error.message);
    return <p className="text-center text-red-500">No species found</p>;
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>My Species</TypographyH2>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {species?.length > 0 ? (
          species.map((species) => <SpeciesCard key={species.id} species={species} sessionId={sessionId} />)
        ) : (
          <p className="text-center text-gray-500">No species found</p>
        )}
      </div>
    </>
  );
}