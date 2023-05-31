import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WordCard from "../components/WordCard";
import Navbar from "../components/Navbar";

interface SearchRequestResult {
  pronunciation: {
    all: string;
  };
  results: SearchResult[];
  syllables: Object;
}

interface SearchResult {
  definition: string;
  examples: string[];
  partOfSpeech: string;
}

const SearchResultPage: React.FC = () => {
  const { term } = useParams<{ term: string }>();
  const [searchResults, setSearchResults] =
    useState<SearchRequestResult | null>();

  // Helper function to remove quotes from a string
  const removeQuotes = (str: string) => {
    return str.replace(/^'(.*)'$/, "$1");
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.129:8080/api/v1/search/${term}`
        );
        const data = await response.json();
        console.log(data);

        if ("error" in data) {
          setSearchResults(null);
        } else {
          setSearchResults(data);
        }

        if (data?.rhymes) {
          console.log('yex')
          setSearchResults(null)
        }

      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [term]);

  return (
    <>
      <Navbar></Navbar>
      <div>
        <h2>Search Results for "{term}"</h2>
        <div className="word-card-container flex items-center flex-col gap-10 w-full min-h-screen">
          {/* {searchResults.map((result: SearchResult) => (
                  <WordCard
                      key={result.uuid}
                      term={result.term}
                      meaning={result.meaning}
                      phonetic={result.phonetic}
                      examples={result.examples} />
              ))} */}

          {!searchResults && <h2>No search results for {term}</h2>}

          {searchResults &&
            searchResults?.results.map((result: SearchResult) => (
              <WordCard
                key={result.definition}
                term={term as string}
                meaning={result.definition}
                phonetic={searchResults.pronunciation.all as string}
                examples={result.examples}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default SearchResultPage;
