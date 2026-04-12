import { ImageDropzone } from "@/components/upload/image-dropzone";

export default function DesignerPage() {
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Dog Tag Designer</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border p-4">
          <label className="mb-2 block text-sm">Front Text</label>
          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Pet Name" />
          <label className="mb-2 mt-3 block text-sm">Back Text</label>
          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Phone Number" />
          <label className="mb-2 mt-3 block text-sm">Color</label>
          <input type="color" defaultValue="#17a085" className="h-10 w-20 rounded-md border" />
        </div>
        <ImageDropzone />
      </div>
    </section>
  );
}
