function nameSplit(name) {
  let result = name.split("_");
  result = result.join(" ");
  result = result.toUpperCase();

  return result;
}

module.exports = nameSplit;
