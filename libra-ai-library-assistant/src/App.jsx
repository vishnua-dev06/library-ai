import React, { useState } from 'react';
import { BOOKS_DATA, getAvailabilityBadge, recommendBooks } from './data/booksData';
import { 
  Search, Sparkles, BookOpen, Bot, CheckCircle2, 
  AlertTriangle, XCircle, Send, Layers, Tag, X, ChevronRight 
} from 'lucide-react';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);

  // AI Assistant State
  const [chatInput, setChatInput] = useState('');
  const [aiResponse, setAiResponse] = useState({
    query: "I want to learn Python for beginners",
    explanation: "Here are the top recommended books from our campus library catalog tailored for beginners:",
    results: recommendBooks("I want to learn Python for beginners")
  });

  const categories = ['All', 'Programming', 'AI/ML', 'Embedded Systems', 'Electronics', 'Mathematics', 'Communication', 'Fiction'];

  // Search Filter on 10 books
  const filteredBooks = BOOKS_DATA.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    const matchesSearch = 
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term) ||
      book.keywords.some(k => k.toLowerCase().includes(term)) ||
      book.description.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  // Handle AI Recommendation Request
  const handleAiAsk = (queryText) => {
    const text = queryText || chatInput;
    if (!text.trim()) return;

    const results = recommendBooks(text);
    let explanation = `Based on your request "${text}", here are the best matching books from the library:`;

    if (text.toLowerCase().includes('ece') || text.toLowerCase().includes('embedded')) {
      explanation = `Identified focus in **ECE & Embedded Systems**. Recommended for hardware-software microcontroller interfacing:`;
    } else if (text.toLowerCase().includes('python') || text.toLowerCase().includes('beginner')) {
      explanation = `Identified focus in **Python Programming for Beginners**. Recommended for hands-on foundational learning:`;
    } else if (text.toLowerCase().includes('machine learning') || text.toLowerCase().includes('ai')) {
      explanation = `Identified focus in **AI & Machine Learning**. Recommended for practical modeling and deep neural networks:`;
    }

    setAiResponse({
      query: text,
      explanation,
      results
    });
    if (!queryText) setChatInput('');
  };

  const presetQueries = [
    "I want to learn Python for beginners",
    "I am an ECE student and want to learn embedded systems.",
    "Best books for machine learning and neural networks",
    "Linear algebra and math for data science"
  ];

  // Quick stats
  const totalBooks = BOOKS_DATA.length;
  const availableCount = BOOKS_DATA.filter(b => b.availableCopies > 0).length;
  const borrowedCount = BOOKS_DATA.filter(b => b.availableCopies === 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Libra<span className="text-sky-400">AI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  MVP DEMO
                </span>
              </h1>
              <p className="text-xs text-slate-400">AI-Powered Campus Library Management Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              Total Books: <strong className="text-white">{totalBooks}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              Available: {availableCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold">
              Borrowed: {borrowedCount}
            </div>
          </div>
        </header>

        {/* AI Chat & Recommendation Panel */}
        <section className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-sky-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Bot className="w-5 h-5" />
              <span>AI Library Assistant & Natural-Language Recommendations</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Demo Mode Active
            </span>
          </div>

          {/* Quick Preset Prompts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Try asking:</span>
            {presetQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAiAsk(q)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-sky-500/40 transition-all"
              >
                ✦ {q}
              </button>
            ))}
          </div>

          {/* Natural Language Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleAiAsk(); }} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type in natural language, e.g. 'I am an ECE student and want to learn embedded systems'..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              <span>Ask AI</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* AI Response Output */}
          {aiResponse && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Query: "{aiResponse.query}"</span>
              </div>
              
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {aiResponse.explanation}
              </p>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {aiResponse.results.length > 0 ? (
                  aiResponse.results.map(({ book, reason }, i) => {
                    const badge = getAvailabilityBadge(book.availableCopies);
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedBook(book)}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {book.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.className}`}>
                              {badge.label} ({book.availableCopies}/{book.totalCopies})
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-white line-clamp-1">{book.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">By {book.author}</p>
                          
                          <p className="text-xs text-sky-300 bg-sky-950/40 p-2 rounded-lg border border-sky-500/20 mt-2.5 leading-snug">
                            <strong>Why:</strong> {reason}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Level: <strong className="text-slate-200">{book.difficulty}</strong></span>
                          <span className="text-sky-400 font-semibold flex items-center gap-0.5">Details →</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 col-span-3">No matching books found for this query. Try one of the preset prompts!</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Search Bar & Category Filter */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search 10 books by title, author, keyword, or category (e.g. 'Python', 'Sedra', 'Algorithms')..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 10 Books Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-200 uppercase tracking-wider">
              Library Inventory ({filteredBooks.length} / 10 Books)
            </span>
            <span>Click any card to open full details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => {
              const badge = getAvailabilityBadge(book.availableCopies);
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {book.category}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                        {badge.label} ({book.availableCopies}/{book.totalCopies})
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">By {book.author} ({book.year})</p>
                    
                    <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {book.keywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Level: <strong className="text-slate-200">{book.difficulty}</strong></span>
                    <span className="text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                      View Book →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Book Details Modal */}
        {selectedBook && (
          <div 
            onClick={() => setSelectedBook(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 font-mono">{selectedBook.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{selectedBook.category}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getAvailabilityBadge(selectedBook.availableCopies).className}`}>
                    {getAvailabilityBadge(selectedBook.availableCopies).label}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{selectedBook.title}</h2>
                <p className="text-xs text-slate-400">By {selectedBook.author} • {selectedBook.year}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedBook.description}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Difficulty Level:</span>
                  <span className="font-bold text-white">{selectedBook.difficulty}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Copies:</span>
                  <span className="font-bold text-white">{selectedBook.totalCopies}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Available Copies:</span>
                  <span className="font-bold text-emerald-400">{selectedBook.availableCopies}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBook.keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedBook(null);
                  handleAiAsk(`Tell me why ${selectedBook.title} is recommended for students.`);
                }}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI About This Book</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
