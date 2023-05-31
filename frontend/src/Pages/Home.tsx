import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import WordCard from '../components/WordCard';

interface WordApiResult {
  word: string;
  pronunciation: { all: string };
  results: {
    definition: string;
    examples: string[];
  }[];
}

interface WordData {
  term: string;
  meaning: string;
  phonetic: string;
  examples: string[];
}

const Home: React.FC = () => {
  const [wordsData, setWordsData] = useState<WordData[]>([]);

  const fetchWordDetails = async (word: string) => {
    const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
      headers: {
        'X-RapidAPI-Key': 'b7fa73238bmsh328ea32c1f75d1fp1ddc3djsn8080f82ce18a',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.error(`Error fetching data for word ${word}: ${response.statusText}`);
      return;
    }

    const data: WordApiResult = await response.json();
    console.log(data)

    const examples = data.results.map(result => result.examples).flat();

    return {
      term: data.word,
      meaning: data.results[0].definition,
      phonetic: data.pronunciation.all || '',
      examples
    };
  };

  useEffect(() => {
    const words = ["jeans", "rock", "truck", "home", "tomalley ", "pumpkin"];

    const fetchData = async () => {
      const wordDetailsPromises = words.map(word => fetchWordDetails(word));
      const resolvedWordDetails = await Promise.all(wordDetailsPromises);
      const filteredWordDetails = resolvedWordDetails.filter(Boolean) as WordData[];
      setWordsData(filteredWordDetails);
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-12 cards-container flex-col flex gap-10 items-center w-full min-h-screen">
        {wordsData.map((wordData, index) => (
          <WordCard
            key={index}
            term={wordData.term}
            phonetic={wordData.phonetic}
            meaning={wordData.meaning}
            examples={wordData.examples}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
