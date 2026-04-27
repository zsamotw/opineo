"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Comment } from "../data/opinions";
import { useAIAnalysis } from "../lib/useAIAnalysis";
import { ContraIcon, HeartIcon, QuoteIcon, SearchIcon } from "./Icons";

interface ResumeProps {
  comments: Comment[];
  opinionContent?: string;
}

export function Resume({ comments, opinionContent }: ResumeProps) {
  const { response, loading, error, analyzed, analyze } = useAIAnalysis();

  const selectedQuotes = comments
    .filter((comment) => comment.selectedQuote?.trim())
    .map((comment) => comment.selectedQuote!);

  const likes = comments
    .filter((comment) => comment.agree?.trim())
    .map((comment) => comment.agree);

  const opposingViews = comments
    .filter((comment) => comment.disagree?.trim())
    .map((comment) => comment.disagree);

  const handleTabChange = (value: string) => {
    if (value === "analiza" && opinionContent && !analyzed && analyze) {
      analyze(opinionContent);
    }
  };

  return (
    <Tabs defaultValue="docenione" className="mt-4 w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 p-1 gap-1 min-h-12">
        {likes.length > 0 && (
          <TabsTrigger
            value="docenione"
            className="flex h-full flex-1 items-center justify-center gap-2 py-3 px-2 text-sm font-medium whitespace-nowrap text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/40 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-200 rounded-md border border-transparent transition-all hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            <HeartIcon size={12} className="shrink-0" />
            <span>Docenione ({likes.length})</span>
          </TabsTrigger>
        )}
        {opposingViews.length > 0 && (
          <TabsTrigger
            value="kontrapunkt"
            className="flex h-full flex-1 items-center justify-center gap-2 py-3 px-2 text-sm font-medium whitespace-nowrap text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/40 data-[state=active]:text-orange-800 dark:data-[state=active]:text-orange-200 rounded-md border border-transparent transition-all hover:bg-orange-100 dark:hover:bg-orange-900/30"
          >
            <ContraIcon size={12} className="shrink-0" />
            <span>Kontrapunkt ({opposingViews.length})</span>
          </TabsTrigger>
        )}
        {selectedQuotes.length > 0 && (
          <TabsTrigger
            value="warte-uwagi"
            className="flex h-full flex-1 items-center justify-center gap-2 py-3 px-2 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-md border border-transparent transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50"
          >
            <QuoteIcon size={12} className="shrink-0" />
            <span>Warte uwagi ({selectedQuotes.length})</span>
          </TabsTrigger>
        )}
        <TabsTrigger
          value="analiza"
          className="flex h-full flex-1 items-center justify-center gap-2 py-3 px-2 text-sm font-medium whitespace-nowrap text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200 rounded-md border border-transparent transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30"
        >
          <SearchIcon size={12} className="shrink-0" />
          <span>Analiza</span>
        </TabsTrigger>
      </TabsList>

      {likes.length > 0 && (
        <TabsContent value="docenione" className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
          <ul className="list-disc pl-5 space-y-3">
            {likes.map((like, index) => (
              <li
                key={index}
                className="text-base leading-normal text-gray-700 dark:text-gray-300 italic"
              >
                {like}
              </li>
            ))}
          </ul>
        </TabsContent>
      )}

      {opposingViews.length > 0 && (
        <TabsContent value="kontrapunkt" className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
          <ul className="list-disc pl-5 space-y-3">
            {opposingViews.map((view, index) => (
              <li
                key={index}
                className="text-base leading-normal text-gray-700 dark:text-gray-300 italic"
              >
                {view}
              </li>
            ))}
          </ul>
        </TabsContent>
      )}

      {selectedQuotes.length > 0 && (
        <TabsContent value="warte-uwagi" className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-700">
          <ul className="list-disc pl-5 space-y-3">
            {selectedQuotes.map((quote, index) => (
              <li
                key={index}
                className="text-base leading-normal text-gray-700 dark:text-gray-300 italic"
              >
                &ldquo;{quote}&rdquo;
              </li>
            ))}
          </ul>
        </TabsContent>
      )}

      <TabsContent value="analiza" className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
        {loading && (
          <p className="text-sm text-purple-600 dark:text-purple-400">Analizuję komentarz...</p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {response && (
          <pre className="whitespace-pre-wrap text-sm leading-normal text-gray-700 dark:text-gray-300">
            {response}
          </pre>
        )}
        {!loading && !response && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kliknij w zakładkę &quot;Analiza&quot;, aby przeprowadzić analizę komentarza AI.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}