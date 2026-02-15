interface SortOption {
  value: string;
  label: string;
}

export const sortBlogData: SortOption[] = [
  {
    value: "date-desc",
    label: "Newest",
  },
  {
    value: "date-asc",
    label: "Oldest",
  },
  {
    value: "title-desc",
    label: "Z-A",
  },
  {
    value: "title-asc",
    label: "A-Z",
  },
];
