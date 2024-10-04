export function wrapLongTextOrDefault(text: string, limit: number = 20) {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
}
