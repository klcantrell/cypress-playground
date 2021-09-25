export interface Character {
  name: string;
  films: string[];
}

export interface PeopleResponse {
  results: Character[];
}

export interface Movie {
  title: string;
  url: string;
}

export interface MoviesResponse {
  results: Movie[];
}
