import type { Movie } from '../services/tmdb/types';
import { format, differenceInYears } from 'date-fns';

const generateFunFacts = (movie: Movie): string[] => {
  const facts: string[] = [];
  const releaseDate = new Date(movie.release_date);
  const currentYear = new Date().getFullYear();
  const movieAge = differenceInYears(new Date(), releaseDate);

  // Age of the movie
  facts.push(`This movie was released ${movieAge} years ago in ${format(releaseDate, 'MMMM yyyy')}`);

  // Budget related
  if (movie.budget > 0) {
    const budgetMillions = (movie.budget / 1000000).toFixed(1);
    facts.push(`The movie had a budget of $${budgetMillions} million`);
  }

  // Box office success
  if (movie.revenue > 0 && movie.budget > 0) {
    const profit = movie.revenue - movie.budget;
    const profitMillions = (profit / 1000000).toFixed(1);
    if (profit > 0) {
      facts.push(`The movie made a profit of $${profitMillions} million at the box office`);
    }
  }

  // Runtime comparison
  if (movie.runtime > 180) {
    facts.push(`At ${movie.runtime} minutes, this is quite a long movie - make sure to grab some snacks!`);
  } else if (movie.runtime < 90) {
    facts.push(`With a runtime of ${movie.runtime} minutes, this is a relatively short movie`);
  }

  // Vote count and popularity
  if (movie.vote_count > 10000) {
    facts.push(`This movie has been rated by over ${(movie.vote_count / 1000).toFixed(1)}k people`);
  }

  // Rating enthusiasm
  if (movie.vote_average >= 8) {
    facts.push(`With a rating of ${movie.vote_average.toFixed(1)}/10, this movie is very highly rated!`);
  }

  // Language
  if (movie.original_language !== 'en') {
    facts.push(`This movie was originally made in ${getLanguageName(movie.original_language)}`);
  }

  return facts;
};

const getLanguageName = (code: string): string => {
  const languages: { [key: string]: string } = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'hi': 'Hindi',
    'ru': 'Russian',
    // Add more languages as needed
  };
  return languages[code] || code.toUpperCase();
};

export const getRandomFunFact = (movie: Movie): string => {
  const facts = generateFunFacts(movie);
  if (facts.length === 0) {
    return `This movie is ${movie.runtime} minutes long`;
  }
  return facts[Math.floor(Math.random() * facts.length)];
}; 