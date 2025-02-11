"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useState } from "react";

type Species = {
  id: number;
  scientific_name: string;
  common_name: string | null;
  total_population: number | null;
  kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
  description: string | null;
};

export default function EditSpeciesDialog({
  species,
  open,
  setOpen,
}: {
  species: Species;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const supabase = createBrowserSupabaseClient();

  const [scientificName, setScientificName] = useState(species.scientific_name);
  const [commonName, setCommonName] = useState(species.common_name || "");
  const [totalPopulation, setTotalPopulation] = useState(species.total_population || "");
  const [kingdom, setKingdom] = useState(species.kingdom);
  const [description, setDescription] = useState(species.description || "");

  const handleSave = async () => {
    const { error } = await supabase
      .from("species")
      .update({
        scientific_name: scientificName,
        common_name: commonName || null,
        total_population: totalPopulation ? Number(totalPopulation) : null,
        kingdom,
        description: description || null,
      })
      .eq("id", species.id);

    if (error) {
      alert("Failed to update species: " + error.message);
      return;
    }

    setOpen(false);
    alert("Species updated successfully!");
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this species?");
    if (!confirmed) return;

    const { error } = await supabase.from("species").delete().eq("id", species.id);

    if (error) {
      alert("Failed to delete species: " + error.message);
      return;
    }

    setOpen(false);
    alert("Species deleted successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Scientific Name</h3>
            <Input value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Common Name</h3>
            <Input value={commonName} onChange={(e) => setCommonName(e.target.value)} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Kingdom</h3>
            <select
              value={kingdom}
              onChange={(e) => setKingdom(e.target.value as Species["kingdom"])}
              className="w-full p-2 border rounded"
            >
              <option value="Animalia">Animalia</option>
              <option value="Plantae">Plantae</option>
              <option value="Fungi">Fungi</option>
              <option value="Protista">Protista</option>
              <option value="Archaea">Archaea</option>
              <option value="Bacteria">Bacteria</option>
            </select>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Total Population</h3>
            <Input
              type="number"
              value={totalPopulation}
              onChange={(e) => setTotalPopulation(e.target.value)}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Description</h3>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
        </div>
        <div className="mt-4">
          <Button onClick={handleDelete} variant="secondary" className="w-full">
            Delete Species
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}