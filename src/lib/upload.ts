export const IMAGE_WEBP_CONTENT_TYPE = "image/webp";

export type LocalImageSelection = {
  kind: "local";
  previewUrl: string;
  blob: Blob;
  contentType: typeof IMAGE_WEBP_CONTENT_TYPE;
};

export async function uploadBlobToPresignedUrl({
  uploadUrl,
  blob,
  contentType,
}: {
  uploadUrl: string;
  blob: Blob;
  contentType: string;
}) {
  console.log("blob.type", blob.type);
  console.log("blob.size", blob.size);
  console.log("upload_url", uploadUrl);

  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": contentType,
    },
  });

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    throw new Error(
      `Upload failed with ${res.status}${details ? `: ${details}` : ""}`,
    );
  }
}
