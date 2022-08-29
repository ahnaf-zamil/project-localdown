export interface TNovelPreview {
  id: number;
  title: string;
  cover_url: string;
}

export interface TNovelFull extends TNovelPreview {
  authors: string;
  genres: string;
  publisher: string;
  start_year: number;
  other_names: string;
  added_to_library: boolean;
}
