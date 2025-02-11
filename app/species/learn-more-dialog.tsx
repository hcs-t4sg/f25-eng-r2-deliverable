"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Species = {
  scientific_name: string;
  common_name: string | null;
  total_population: number | null;
  kingdom: string;
  description: string | null;
};

export default function LearnMoreDialog({
  species,
  open,
  setOpen,
}: {
  species: Species;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Species Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Scientific Name</h3>
            <p className="text-sm">{species.scientific_name}</p>
          </div>
          {species.common_name && (
            <div>
              <h3 className="text-sm font-semibold">Common Name</h3>
              <p className="text-sm">{species.common_name}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold">Kingdom</h3>
            <p className="text-sm">{species.kingdom}</p>
          </div>
          {species.total_population !== null && (
            <div>
              <h3 className="text-sm font-semibold">Total Population</h3>
              <p className="text-sm">{species.total_population.toLocaleString()}</p>
            </div>
          )}
          {species.description && (
            <div>
              <h3 className="text-sm font-semibold">Description</h3>
              <p className="text-sm">{species.description}</p>
            </div>
          )}
        </div>
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}