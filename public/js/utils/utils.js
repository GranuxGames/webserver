function compareLists(list1, list2) {
  var comp = list1.filter((el) => {
    return !list2.includes(el);
  });
  if (comp.length > 0)
    return false;

  comp = list2.filter((el) => {
    return !list1.includes(el);
  });
  if (comp.length > 0)
    return false;

  return true;
}

function defaultList(length, element) {
  var list = [];
  for (var i = 0; i < length; i++) {
    list.push(element);
  }
  return list;
}