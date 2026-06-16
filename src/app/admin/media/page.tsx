"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Search,
  Trash2,
  Copy,
  Check,
  Plus,
  RefreshCw,
  X,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface MediaAsset {
  id: string;
  path: string;
  altText: string;
  type: string;
  size: number;
  uploadedBy?: string;
  createdAt: string;
}

export default function AdminMedia() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "IMAGE" | "PDF">("ALL");

  // Upload states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Copy status
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deletion confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (error) {
      console.error("Failed to fetch media assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchAssets(); })();
  }, []);

  const handleCopyPath = (id: string, path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Generate initial alt text from filename
      const baseName = file.name.split(".")[0] || "";
      setAltText(baseName.replace(/[-_]+/g, " "));
      setUploadError("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("altText", altText);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setAltText("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetchAssets();
        setTimeout(() => {
          setUploadSuccess(false);
          setUploadModalOpen(false);
        }, 1500);
      } else {
        setUploadError(data.error || "Failed to upload file.");
      }
    } catch (error) {
      console.error(error);
      setUploadError("An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        setDeletingId(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete asset.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("A server error occurred during deletion.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtering assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.altText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isImage = asset.type.startsWith("image/");
    const isPdf = asset.type === "application/pdf";

    if (filterType === "IMAGE") return matchesSearch && isImage;
    if (filterType === "PDF") return matchesSearch && isPdf;
    return matchesSearch;
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">
            Securely upload, organize, and copy references of images and PDF brochures.
          </p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} className="text-gold" /> Upload File
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets by name or path..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          {(["ALL", "IMAGE", "PDF"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filterType === type
                  ? "bg-white text-navy shadow-sm"
                  : "text-gray-500 hover:text-navy"
              }`}
            >
              {type === "ALL" ? "All Formats" : type === "IMAGE" ? "Images Only" : "Brochures (PDF)"}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-white border border-gray-100 rounded-xl shadow-sm space-y-3">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm font-semibold">Loading media gallery...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <UploadCloud className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-bold text-navy">No media assets found</p>
          <p className="text-sm mt-1">Upload images or PDF documentation folders to begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAssets.map((asset, idx) => {
            const isImage = asset.type.startsWith("image/");
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all relative"
              >
                {/* Visual Preview */}
                <div className="aspect-square bg-gray-50 border-b border-gray-50 relative flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <Image
                      src={asset.path}
                      alt={asset.altText}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-red-500 gap-2">
                      <FileText size={48} className="stroke-[1.5]" />
                      <span className="text-[10px] font-black uppercase bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        PDF BROCHURE
                      </span>
                    </div>
                  )}
                  {/* Floating type indicator */}
                  <span className="absolute top-2 left-2 bg-navy/80 text-[10px] text-white/90 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {asset.type.split("/")[1]}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3 min-w-0">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-bold text-navy truncate" title={asset.altText}>
                      {asset.altText}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {formatSize(asset.size)}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-50">
                    <button
                      onClick={() => handleCopyPath(asset.id, asset.path)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-50 hover:bg-navy/5 text-gray-500 hover:text-navy transition-colors"
                      title="Copy file path reference"
                    >
                      {copiedId === asset.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                    <a
                      href={asset.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-50 hover:bg-navy/5 text-gray-500 hover:text-navy transition-colors"
                      title="Open full resolution in new tab"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => setDeletingId(asset.id)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete asset permanently"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upload File Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">Upload Assets</span>
                  <h3 className="text-lg font-bold mt-1">Upload New Media</h3>
                </div>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                {uploadSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>File uploaded successfully! Library updated.</span>
                  </div>
                )}

                {uploadError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Drag Drop Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-navy/40 rounded-xl p-8 text-center cursor-pointer transition-all bg-gray-50/50 hover:bg-navy/5 flex flex-col items-center gap-2.5"
                >
                  <UploadCloud size={32} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {selectedFile ? selectedFile.name : "Click to select a file"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedFile
                        ? `${formatSize(selectedFile.size)} selected`
                        : "Supports JPEG, PNG, WebP or PDF (Max 5MB)"}
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="hidden"
                  />
                </div>

                {/* Alt Text Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Alt Text / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student Visa UK counseling session"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                  <p className="text-[10px] text-gray-400">
                    Used for search engine accessibility and screen readers (alt attribute).
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="animate-spin text-gold" size={14} /> Uploading...
                      </>
                    ) : (
                      "Secure Upload"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-gray-100 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-navy">Delete Media Asset?</h4>
                <p className="text-gray-500 text-xs mt-1">
                  This action is permanent and cannot be undone. Any blog post or country card using this file path reference will fail to render the image.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  disabled={deleting}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
