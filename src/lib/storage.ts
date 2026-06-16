import { supabase } from "@/integrations/supabase/client";

/** Get a signed URL for a private storage object. Returns "" on failure. */
export async function getSignedUrl(
  bucket: string,
  path: string | null | undefined,
  expiresIn = 60 * 60 * 24 * 7,
): Promise<string> {
  if (!path) return "";
  // Allow callers to pass full URLs
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? "";
}

export async function uploadFile(
  bucket: string,
  file: File,
  pathPrefix = "",
): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const name = `${pathPrefix}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return name;
}
