import React, { useState } from "react";
import { ANDROID_PROJECT_FILES, ProjectFileItem } from "../data/projectFiles";
import { FileCode, FileText, Search, Copy, Check, Download, Layers } from "lucide-react";
import { downloadProjectZip } from "../utils/zipExporter";

export const CodeExplorer: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedFile, setSelectedFile] = useState<ProjectFileItem>(
    ANDROID_PROJECT_FILES.find(f => f.path.includes("KothaKeyboardService.kt")) || ANDROID_PROJECT_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const categories = ["ALL", "Kotlin", "XML", "Gradle", "Config"];

  const filteredFiles = ANDROID_PROJECT_FILES.filter(f => {
    const matchesCat = selectedCategory === "ALL" || f.category === selectedCategory;
    const matchesSearch = f.path.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    setZipProgress(0);
    try {
      await downloadProjectZip((progress) => setZipProgress(progress));
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 p-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Complete Native Android Project Tree
            </span>
            <span className="text-xs text-slate-400">48 Production Source Files</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-2">
            নেটিভ অ্যান্ড্রয়েড সোর্স কোড এক্সপ্লোরার (Source Code Inspector)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            কথা প্রো কীবোর্ডের প্রতিটি কোটলিন ক্লাস, এক্সএমএল লেআউট, গ্রেডল স্ক্রিপ্ট এবং গিটহাব অ্যাকশনস ফাইল সরাসরি ব্রাউজ ও কপি করুন।
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? `প্যাকিং হচ্ছে (${zipProgress}%)...` : "পুরো অ্যান্ড্রয়েড প্রোজেক্ট জিপ ডাউনলোড (.ZIP)"}</span>
        </button>
      </div>

      {/* Main Grid: File List & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[700px]">
        {/* Left Sidebar: File Tree & Filter */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col h-full shadow-lg">
          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ফাইলের নাম সার্চ করুন..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar mb-3 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const fileName = file.path.split("/").pop();
              const dirPath = file.path.substring(0, file.path.lastIndexOf("/"));

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300"
                      : "hover:bg-slate-800/80 text-slate-300 border border-transparent"
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{fileName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{dirPath || "root"}</div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                    file.category === "Kotlin" ? "bg-purple-500/10 text-purple-400" :
                    file.category === "XML" ? "bg-blue-500/10 text-blue-400" :
                    file.category === "Gradle" ? "bg-amber-500/10 text-amber-400" :
                    "bg-slate-800 text-slate-400"
                  }`}>
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Code Content & Actions */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col h-full shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="min-w-0">
              <span className="text-xs font-mono text-emerald-400 block truncate">{selectedFile.fullRepoPath}</span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                {selectedFile.content.split("\n").length} lines &bull; {selectedFile.content.length} characters
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? "কপি হয়েছে!" : "কোড কপি করুন"}</span>
            </button>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto bg-slate-950 rounded-2xl border border-slate-800/80 p-4 font-mono text-xs text-slate-200 leading-relaxed shadow-inner">
            <pre className="whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
