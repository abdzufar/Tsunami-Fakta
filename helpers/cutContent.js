function cutContent(text) {
  let result = text.slice(0, 50);
  if (text.length > 50) {
    result += "...";
  } else {
    return text;
  }

  return result;
}

module.exports = cutContent;
