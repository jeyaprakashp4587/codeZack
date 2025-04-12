function truncateText(text, charLimit = 15) {
  const trimmedText = text.trim();

  if (trimmedText.length <= charLimit) return trimmedText;

  return trimmedText.slice(0, charLimit).trim() + '...';
}

export default truncateText;
