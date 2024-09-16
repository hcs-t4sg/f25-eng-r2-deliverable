"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function DetailedViewDialog({ species }: { species: Species }) {
  // Control open/closed state of the dialog
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          <DialogDescription>{species.common_name}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <img src={species.image} alt={species.scientific_name} className="w-1/2" />
        </div>
        <DialogDescription className="mt-3">
          Total Population: {species.total_population ? species.total_population : "Unknown"}
        </DialogDescription>
        <DialogDescription>Kingdom: {species.kingdom}</DialogDescription>
        <h3 className="mt-3 text-xl font-semibold">Description</h3>
        <p>{species.description}</p>
      </DialogContent>
    </Dialog>
  );
}
