export function filterGroupsBySearch(groups, query) {
  if (!query) return groups;

  return groups.filter((group) => {
    return  group.name.toLowerCase().includes(query.toLowerCase());
  });
}
