"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";

export function ImageDropzone() {
  const [fileName, setFileName] = useState<string>("");
  const [compressedBytes, setCompressedBytes] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/images/compress", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = (await response.json()) as { size: number };
      setCompressedBytes(data.size);
    }
    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: true,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div {...getRootProps()} className="rounded-md border border-dashed p-4">
      <input {...getInputProps()} />
      <div className="flex flex-col gap-2">
        <p className="text-sm">上传图片后会在服务端使用 Sharp 压缩，再进入对象存储。</p>
        <Button type="button" onClick={open} className="w-fit">
          选择图片
        </Button>
        {fileName ? <p className="text-sm text-muted-foreground">{fileName}</p> : null}
        {isUploading ? <p className="text-sm">处理中...</p> : null}
        {compressedBytes !== null ? (
          <p className="text-sm text-muted-foreground">压缩后大小: {(compressedBytes / 1024).toFixed(1)} KB</p>
        ) : null}
      </div>
    </div>
  );
}
