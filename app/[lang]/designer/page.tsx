import { ImageDropzone } from "@/components/upload/image-dropzone";

export default function DesignerPage() {
  return (
    <section className="grid gap-6">
      <div
        className="relative overflow-hidden rounded-md border border-border/70 px-6 py-10 text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(24,13,8,0.75), rgba(24,13,8,0.25)), url('/images/tag-cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl font-semibold">Dog Tag Designer</h1>
        <p className="mt-2 text-sm text-white/85">设置文字、颜色并上传图像，快速生成定制稿。</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground">生成预览</button>
          <button className="rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-black">保存设计</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-border/70 bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-medium">Front Text</label>
          <input className="w-full rounded-md border border-input px-3 py-2 text-sm" placeholder="Pet Name" />
          <label className="mb-2 mt-3 block text-sm font-medium">Back Text</label>
          <input className="w-full rounded-md border border-input px-3 py-2 text-sm" placeholder="Phone Number" />
          <label className="mb-2 mt-3 block text-sm font-medium">Color</label>
          <input type="color" defaultValue="#17a085" className="h-10 w-20 rounded-md border border-input" />
          <div className="mt-4 flex gap-2">
            <button className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">加入购物车</button>
            <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold">清空</button>
          </div>
        </div>
        <ImageDropzone />
      </div>
    </section>
  );
}
