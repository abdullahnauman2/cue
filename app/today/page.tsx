"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Check,
  Loader,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Item, Outfit } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function TodayPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [laundryLoading, setLaundryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supabase = createClient();

  const fetchItems = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      setError("Failed to fetch items");
    } else {
      setItems(data || []);
    }
  }, [supabase]);


  const generateOutfit = useCallback(async () => {
    try {
      setRegenerating(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/generate-outfit", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate outfit");
      }

      setOutfit(data.outfit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate outfit");
    } finally {
      setRegenerating(false);
    }
  }, []);

  const confirmOutfit = async () => {
    if (!outfit) return;

    try {
      setConfirming(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/confirm-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ top: outfit.top, bottom: outfit.bottom }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm outfit");
      }

      setSuccessMessage("Outfit confirmed! Items marked as worn.");
      await fetchItems();
      setOutfit(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm outfit");
    } finally {
      setConfirming(false);
    }
  };

  const doLaundry = async () => {
    try {
      setLaundryLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/laundry", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to do laundry");
      }

      setSuccessMessage("Laundry done! All items are now clean.");
      await fetchItems();
      setOutfit(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to do laundry");
    } finally {
      setLaundryLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchItems();
      setLoading(false);
    };
    loadData();
  }, [fetchItems]);

  useEffect(() => {
    if (items.length > 0 && !outfit) {
      generateOutfit();
    }
  }, [items, outfit, generateOutfit]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="size-6 animate-spin" />
        <span className="ml-3 text-muted-foreground">
          Loading your closet...
        </span>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Today</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

          {error && (
            <div className="mb-8 rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-8 rounded-lg border border-green-600 bg-green-50 p-4">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {items.length > 0 ? (
            outfit ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex flex-col">
                      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                        <Image
                          src={outfit.top.image_front!}
                          alt={outfit.top.name}
                          width={600}
                          height={800}
                          className="h-full w-full object-cover aspect-[3/4]"
                        />
                      </div>
                      <div className="pt-4">
                        <h3 className="font-semibold">{outfit.top.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {outfit.top.is_dirty ? "Dirty" : "Clean"} &bull; Worn{" "}
                          {outfit.top.wear_count} times
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                        <Image
                          src={outfit.bottom.image_front!}
                          alt={outfit.bottom.name}
                          width={600}
                          height={800}
                          className="h-full w-full object-cover aspect-[3/4]"
                        />
                      </div>
                      <div className="pt-4">
                        <h3 className="font-semibold">{outfit.bottom.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {outfit.bottom.is_dirty ? "Dirty" : "Clean"} &bull; Worn{" "}
                          {outfit.bottom.wear_count} times
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <div className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                      <h2 className="text-lg font-semibold">Actions</h2>
                      <Button
                        onClick={generateOutfit}
                        disabled={regenerating || items.length === 0}
                        variant="outline"
                        className="w-full"
                      >
                        {regenerating ? (
                          <>
                            <Loader className="mr-2 size-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Shuffle className="mr-2 size-4" />
                            Regenerate
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={confirmOutfit}
                        disabled={!outfit || confirming}
                        className="w-full"
                      >
                        {confirming ? (
                          <>
                            <Loader className="mr-2 size-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 size-4" />
                            Wear this today
                          </>
                        )}
                      </Button>
                      <Separator />
                      <Button
                        onClick={doLaundry}
                        disabled={laundryLoading}
                        variant="secondary"
                        className="w-full"
                      >
                        {laundryLoading ? (
                          <>
                            <Loader className="mr-2 size-4 animate-spin" />
                            Doing laundry...
                          </>
                        ) : (
                          "Laundry Day"
                        )}
                      </Button>

                      <Separator />
                      <h3 className="pt-4 text-lg font-semibold">
                        Closet Status
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Total items
                          </span>
                          <span className="font-medium">{items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Clean items
                          </span>
                          <span className="font-medium text-green-600">
                            {items.filter((item) => !item.is_dirty).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Dirty items
                          </span>
                          <span className="font-medium text-destructive">
                            {items.filter((item) => item.is_dirty).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[60vh] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <Shuffle className="mx-auto size-10 text-muted-foreground" />
                  <h2 className="mt-4 text-xl font-semibold">
                    Generating your outfit...
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    We&apos;re picking the perfect combination for you!
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex h-[60vh] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  Your closet is empty!
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Add items to your digital closet to start generating outfits.
                </p>
                <Button className="mt-4">Add Your First Item</Button>
              </div>
            </div>
          )}
    </div>
  );
}
