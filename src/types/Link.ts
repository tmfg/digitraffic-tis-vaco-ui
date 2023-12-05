export interface Links {
  refs: Ref
}

interface Ref {
  [key: string]: Link
}

export interface Link {
  href: string
  method: string
}
