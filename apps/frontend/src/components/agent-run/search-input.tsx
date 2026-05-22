"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce"; // We will create this

export function SearchInput({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Only trigger navigation if the debounced value changed from what's in the URL
    if (debouncedValue !== (searchParams.get("search") || "")) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedValue) {
        params.set("search", debouncedValue);
      } else {
        params.delete("search");
      }
      // Reset page when searching
      params.delete("page");

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    }
  }, [debouncedValue, searchParams, router]);

  return (
    <Input
      type="text"
      placeholder="Search prompt, session ID, run ID, model..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={isPending ? "opacity-50" : ""}
    />
  );
}
