"use client";
import { useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { createParser } from "eventsource-parser";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Spinner from "./components/Spinner";
import Toggle from "./components/Toggle";
import NumberedStep from "./components/NumberedStep";
import DropDown from "./components/Dropdown";
import TweetInputArea from "./components/TweetInputArea";

export default function Home() {
  const [tweet, setTweet] = useState("");
  const [vibe, setVibe] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [generatedTweets, setGeneratedTweets] = useState("");
  const [isGPT, setIsGPT] = useState(false);

  const tweetRef = useRef(null);

  const scrollToTweet = () => {
    if (tweetRef.current !== null) {
      tweetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getPrompt = () => {
    const numCharacters = tweet.length;
    const adjective = {
      Professional: "professional",
      Casual: "relaxed",
      Funny: "silly",
    }[vibe];
    const mainInstruction = `Generate 3 punchier versions of the following tweet, with no hashtags and clearly labeled "1.", "2." and "3.". Only return these 3 versions, nothing else.`;
    const guidelines = `Make sure the tweets are each ${numCharacters} character long. You can add emojis.`;
    const toneGuideline = `Make the tweet sound ${adjective}.`;
    const context = `Here is the tweet: ${tweet}`;
    return `${mainInstruction}\n\n${guidelines}\n${toneGuideline}\n\n${context}`;
  };

  const generateTweet = async (e) => {
    e.preventDefault();
    setGeneratedTweets("");
    setLoading(true);

    const response = await fetch(isGPT ? "/api/openai" : "/api/togetherai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: getPrompt(),
      }),
    });

    if (!response.ok) {
      console.error(response);
      toast("An error occurred. Please try again later.", { icon: "🚨" });
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParseGPT = (event) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setGeneratedTweets((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const onParseMistral = (event) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).choices[0].text ?? "";
          setGeneratedTweets((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const onParse = isGPT ? onParseGPT : onParseMistral;

    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }

    scrollToTweet();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Increase your tweets energy level
        </h1>
        <div className="mt-7">
          <Toggle isGPT={isGPT} setIsGPT={setIsGPT} />
        </div>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 mb-5 items-center space-x-3">
            <NumberedStep number={1} />
            <p className="text-left font-medium">Drop in your tweet</p>
          </div>
          <TweetInputArea value={tweet} setValue={setTweet} />
          <div className="flex mt-10 mb-5 items-center space-x-3">
            <NumberedStep number={2} />
            <p className="text-left font-medium">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full flex justify-center"
            onClick={(e) => generateTweet(e)}
            disabled={loading}
          >
            {loading && <Spinner className="mr-2 h-6 w-6 animate-spin" />} Make
            it punchier 👊
          </button>
        </div>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <Toaster toastOptions={{ duration: 3000 }} />
        <div className="space-y-10 my-10">
          {generatedTweets && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={tweetRef}
                >
                  Your tweets are ready!
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedTweets
                  .substring(generatedTweets.indexOf("1") + 3)
                  .split(/2\.|3\./)
                  .map((generatedTweet) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedTweet);
                          toast("Tweet copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedTweet}
                      >
                        <p>{generatedTweet}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
