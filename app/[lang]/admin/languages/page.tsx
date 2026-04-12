"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Language = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isEnabled: boolean;
};

async function fetchLanguages() {
  const response = await fetch("/api/languages");
  if (!response.ok) throw new Error("Failed to fetch languages");
  return (await response.json()) as { data: Language[] };
}

export default function LanguageAdminPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

  const handleCreate = async () => {
    await fetch("/api/languages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name, isDefault }),
    });
    setCode("");
    setName("");
    setIsDefault(false);
    void refetch();
  };

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Language Management</h1>
      <div className="grid gap-3 rounded-md border p-4 md:grid-cols-4">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="code (e.g. es)"
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="name"
          className="rounded-md border px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} />
          Default
        </label>
        <Button onClick={handleCreate}>Add Language</Button>
      </div>
      {isLoading ? <p>Loading...</p> : null}
      <div className="grid gap-2">
        {data?.data.map((language) => (
          <div key={language.id} className="rounded-md border p-3 text-sm">
            {language.code} · {language.name} {language.isDefault ? "(Default)" : ""}
          </div>
        ))}
      </div>
    </section>
  );
}
