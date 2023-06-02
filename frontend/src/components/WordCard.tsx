import React, { useState } from "react";
import "../WordCard.css";
import { BsFillVolumeUpFill } from "react-icons/bs";

interface WordCardProps {
  term: string;
  meaning: string;
  phonetic: string;
  examples: string[];
  // Add any other properties you need
}

const WordCard: React.FC<WordCardProps> = ({
  term,
  meaning,
  phonetic,
  examples,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedElement = event.target as HTMLDivElement;
    const shouldSkipFlip = clickedElement.classList.contains("skip-flip");

    if (!shouldSkipFlip) {
      setIsFlipped((prevState) => !prevState);
    }
  };

  return (
    <div
      className={`card-container pb-10 w-[23rem] md:w-[40rem] xl:w-[40rem] lg:w-[40rem] h-[32rem] md:h-[32rem] lg:h-[20rem] xl:h-[32rem] ${
        isFlipped ? "flipped" : ""
      }`}
    >
      <div className="card hover:scale-105">
        <div
          className="card-front flex flex-col rounded-md drop-shadow-md shadow-black"
          onClick={flipCard}
        >
          <div className="translate flex w-full h-8 justify-end gap-7 items-center">
            <div className="mt-3 font-bold text-[13px] hover:cursor-pointer hover:underline skip-flip">
              Translate
            </div>
            <div className="bg-[#547CF3] rounded-full w-7 h-7 mt-3 mr-3"></div>
          </div>
          <h2 className="lang pl-7 font-bold text-[#749CF4]">English</h2>
          <div className="audio-word mt-2 flex items-center gap-3 w-full h-12">
            <div className="bg-[#D9D9D9] hover:cursor-pointer hover:scale-110 transition duration-100 flex justify-center items-center ml-6 rounded-full w-7 h-7 skip-flip">
              <BsFillVolumeUpFill size={20} />
            </div>
            <h3 className=" font-semibold">{term}</h3>
            <h2 className="font-semibold text-[11px]">({phonetic})</h2>
          </div>
          <h1 className="definiton pl-6 font-bold pt-4 text-lg">
            Definition:{" "}
          </h1>
          <p className="pl-10 font-bold text-[#D9D9D9] ">{meaning}</p>
          <h1 className="examples pl-6 font-bold pt-4 text-lg">Examples:</h1>
          <ul className="examples-list overflow-y-auto max-h-12 md:max-h-40 lg:max-h-40 xl:max-h-40">
            {examples &&
              examples.map((example, index) => (
                <li className="pl-10" key={index}>
                  {example}
                </li>
              ))}
          </ul>
          <div className="word-list-btn flex flex-1 items-end justify-between pt-8 w-full">
            <div className="bg-[#547CF3] rounded-full w-7 h-7 mb-2 ml-2"></div>
            <button className="wordlist text-white font-bold bg-[#547CF3] pl-10 pr-10 pt-2 pb-2 rounded-md mb-2 skip-flip hover:cursor-pointer hover:bg-[#3a6bfc]">
              Add To Wordlist
            </button>
            <div className="bg-[#547CF3] rounded-full w-7 h-7 mb-2 mr-2"></div>
          </div>
        </div>
        <div
          className="card-back rounded-md drop-shadow-md shadow-black"
          onClick={flipCard}
        >
          <h2>{term}</h2>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
