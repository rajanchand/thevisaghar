"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/components/ui/BrandIcons";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"contact" | "social" | "site">("contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Settings values state
  const [settings, setSettings] = useState<Record<string, string>>({
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    office_hours: "",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    site_title_suffix: "",
    site_description: "",
    consultation_fee: "",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        // Merge fetched data with default state to ensure no undefined states
        setSettings((prev) => ({
          ...prev,
          ...data,
        }));
      } else {
        setErrorMsg("Failed to retrieve current configurations.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to connect to the settings server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (success) setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccess(false);

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to update configurations.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to upload settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Global Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure metadata, contact points, and office coordinates.</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "contact", label: "Contact Details", icon: Mail },
          { id: "social", label: "Social Links", icon: Facebook },
          { id: "site", label: "Website Metadata", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "contact" | "social" | "site")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "border-navy text-navy font-bold"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
            <p className="text-sm">Loading current settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Site configuration updated successfully. Changes will display immediately.</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB: Contact Info */}
            {activeTab === "contact" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">Office Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={12} className="text-gold" /> Public Support Email
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. info@thevisaghar.com"
                      value={settings.contact_email}
                      onChange={(e) => handleInputChange("contact_email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={12} className="text-gold" /> Office Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +977-1-4412345"
                      value={settings.contact_phone}
                      onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={12} className="text-gold" /> Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Boudha-6, Pipalbot, Kathmandu, Nepal"
                    value={settings.contact_address}
                    onChange={(e) => handleInputChange("contact_address", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={12} className="text-gold" /> Office Business Hours
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunday - Friday: 9:00 AM - 6:00 PM"
                    value={settings.office_hours}
                    onChange={(e) => handleInputChange("office_hours", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: Social links */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">Social Network Coordinates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Facebook size={12} className="text-blue-600" /> Facebook Profile Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/thevisaghar"
                      value={settings.social_facebook}
                      onChange={(e) => handleInputChange("social_facebook", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Instagram size={12} className="text-pink-600" /> Instagram Username Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/thevisaghar"
                      value={settings.social_instagram}
                      onChange={(e) => handleInputChange("social_instagram", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Youtube size={12} className="text-red-600" /> YouTube Channel Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/c/thevisaghar"
                    value={settings.social_youtube}
                    onChange={(e) => handleInputChange("social_youtube", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: Website configurations */}
            {activeTab === "site" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">Search SEO & consultations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Globe size={12} className="text-navy" /> Title Suffix Override
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. | The Visa Ghar — Nepal"
                      value={settings.site_title_suffix}
                      onChange={(e) => handleInputChange("site_title_suffix", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign size={12} className="text-green-600" /> Consultation Fee (NPR)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Free or NPR 1,500"
                      value={settings.consultation_fee}
                      onChange={(e) => handleInputChange("consultation_fee", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Default Site meta description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide description for search queries..."
                    value={settings.site_description}
                    onChange={(e) => handleInputChange("site_description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* Save Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="animate-spin text-gold" size={16} /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="text-gold" /> Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
