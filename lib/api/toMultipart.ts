// Content records with an image: with a file the request is multipart, the fields going
// as JSON in "data". Without one it stays a normal JSON request.
export function toMultipart<T extends object>(payload: T, imageFile?: File): T | FormData {
  if (!imageFile) return payload;
  const form = new FormData();
  form.append("data", JSON.stringify(payload));
  form.append("image", imageFile);
  return form;
}
