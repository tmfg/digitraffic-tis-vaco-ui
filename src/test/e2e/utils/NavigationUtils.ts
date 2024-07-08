export function sortableColumnSelector(columnText: string): string {
  return `.th-sortable >> text=${columnText}`
}

export function shortcutCardSelector(columnText: string): string {
  return `.shortcut-card__label >> text=${columnText}`
}
