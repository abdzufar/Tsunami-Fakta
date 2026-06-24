function cutContent(text) {
  let result = text.slice(0, 50);
  result += "...";

  return result;
}

module.exports = cutContent;
