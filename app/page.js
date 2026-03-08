"use client";

import { useState } from "react";

export default function Home() {

  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("Engagement");
  const [product, setProduct] = useState("");

  const [tweets, setTweets] = useState([]);
  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(false);

  const generateTweets = async () => {

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand,
        industry,
        objective,
        product,
      }),
    });

    const data = await res.json();
    const result = data.result;

    const parts = result.split("Tweets:");

    const summaryText = parts[0];
    const tweetSection = parts[1];

    setSummary(summaryText);

    const tweetLines = tweetSection
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\./));

    const cleanedTweets = tweetLines.map((t) =>
      t.replace(/^\d+\.\s*/, "")
    );

    setTweets(cleanedTweets);

    setLoading(false);
  };

  return (

    <main className="max-w-3xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        🐦 AI Brand Tweet Generator
      </h1>

      {/* INPUTS */}

      <input
        className="border p-2 w-full mb-3"
        placeholder="Brand Name"
        onChange={(e) => setBrand(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Industry"
        onChange={(e) => setIndustry(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => setObjective(e.target.value)}
      >
        <option>Engagement</option>
        <option>Promotion</option>
        <option>Awareness</option>
      </select>

      <textarea
        className="border p-2 w-full mb-4"
        placeholder="Describe the product or campaign"
        onChange={(e) => setProduct(e.target.value)}
      />

      <button
        onClick={generateTweets}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate Tweets
      </button>

      {/* LOADING */}

      {loading && (
        <div className="flex items-center gap-2 mt-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
          <p>AI is writing tweets...</p>
        </div>
      )}

      {/* BRAND SUMMARY */}

      {summary && (

        <div className="mt-8">

          <h2 className="text-xl font-semibold mb-2">
            Brand Voice Summary
          </h2>

          <div className="border p-4 rounded  bg-white whitespace-pre-wrap">
            {summary}
          </div>

        </div>
      )}

      {/* TWEETS */}

      {tweets.length > 0 && (

        <div className="mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Generated Tweets
          </h2>

          <div className="space-y-4">

            {tweets.map((tweet, index) => (

              <div
                key={index}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >

                <div className="flex items-center gap-3 mb-3">

                  <div className="w-10 h-10 bg-black rounded-full"></div>

                  <div>
                    <p className="font-semibold">{brand}</p>
                    <p className="text-gray-500 text-sm">
                      @{brand?.toLowerCase()}
                    </p>
                  </div>

                </div>

                <p className="text-gray-800">
                  {tweet}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {tweet.length}/280 characters
                </p>

                <div className="flex gap-6 mt-3 text-gray-500 text-sm">

                  <span>💬</span>
                  <span>🔁</span>
                  <span>❤️</span>
                  <span>📤</span>

                </div>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(tweet)
                  }
                  className="text-blue-500 text-sm mt-2"
                >
                  Copy Tweet
                </button>

              </div>

            ))}

          </div>

          {/* GENERATE AGAIN */}

          <button
            onClick={generateTweets}
            className="mt-6 bg-gray-800 text-white px-4 py-2 rounded"
          >
            Generate New Tweets
          </button>

        </div>
      )}

    </main>
  );
}
