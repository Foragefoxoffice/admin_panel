import React, { useEffect, useState } from "react";
import { fetchSettings, updateSetting } from "../../utils/api";
import { FiSave, FiSettings, FiPlus, FiTrash2, FiHelpCircle } from "react-icons/fi";
import * as Io5Icons from "react-icons/io5";

// Live preview for the Feature List's icon-name field — that field expects
// an exact Ionicons name (the same icon set the mobile app renders these
// features with via react-native-vector-icons/Ionicons), typed as plain
// text with no way to check it's valid before saving. react-icons bundles
// the same Ionicons set (v5) for the web under this naming convention:
// kebab-case "help-circle" -> PascalCase "IoHelpCircle". Ionicons' bare
// name is the filled/solid glyph (matching what the mobile app renders by
// default for a bare name like "book" or "rocket") — "-outline"/"-sharp"
// suffixes map the same way if someone types one of those instead.
function resolveIonicon(name) {
  if (!name) return null;
  const pascal = name
    .trim()
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return Io5Icons[`Io${pascal}`] || null;
}

// Full picker list — every bare (filled-style, non-logo) Ionicons name
// react-icons/io5 has, converted back to the kebab-case the mobile app's
// Ionicons component actually expects (e.g. "IoHelpCircle" -> "help-circle").
// Built once at module load, not per-render — 400+ icons, computing this
// on every keystroke would be wasteful.
const ICON_OPTIONS = Object.keys(Io5Icons)
  .filter((k) => k.startsWith("Io") && !k.endsWith("Outline") && !k.endsWith("Sharp") && !k.startsWith("IoLogo"))
  .map((k) => ({
    name: k.slice(2).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
    Icon: Io5Icons[k],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const DEFAULT_MODAL = {
  title: "🎁 Start Your Free Trial",
  boldLine: "No payment details required.",
  subLine: "Get {days} days of Full Premium Access for free!",
  buttonText: "Start Free Trial",
  features: [
    { icon: "rocket", text: "Mark Booster to Improve weak chapters and weak concepts", color: "#F59E0B" },
    { icon: "analytics", text: "Personalized weekly and monthly performance analytics", color: "#8B5CF6" },
    { icon: "book", text: "42000+ NCERT Line by line questions and 35 year PYQs", color: "#3B82F6" },
    { icon: "extension-puzzle", text: "Unlimited custom chapter test and Full NEET Test", color: "#10B981" },
    { icon: "help-circle", text: "10+ Question Types for every NCERT line", color: "#EF4444" },
    { icon: "document-text", text: "Full Access to Test Series", color: "#6366F1" },
    { icon: "close-circle", text: "Error Book — track and revise your mistakes", color: "#EC4899" },
    { icon: "sparkles", text: "Ask Mitos AI — 24/7 Instant Doubt Solver with 3000 Credits Monthly", color: "#7C3AED" },
  ],
};

const Field = ({ label, hint, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

const AppSettings = () => {
  const [telegramLink, setTelegramLink] = useState("");
  const [trialDays, setTrialDays] = useState("10");
  const [modal, setModal] = useState(DEFAULT_MODAL);
  const [aiChatDailyCap, setAiChatDailyCap] = useState("100");
  const [aiChatTrialCap, setAiChatTrialCap] = useState("10");
  const [aiChatUpgradeMessage, setAiChatUpgradeMessage] = useState("Upgrade to Premium and get 3,000 AI credits every month.");
  const [notificationResendWindowDays, setNotificationResendWindowDays] = useState("7");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Which Feature List row's icon picker dropdown is open, if any — only
  // one at a time, so an index rather than a per-row boolean.
  const [openIconPicker, setOpenIconPicker] = useState(null);

  useEffect(() => {
    fetchSettings().then((s) => {
      if (s.telegram_link) setTelegramLink(s.telegram_link);
      if (s.trial_days) setTrialDays(s.trial_days);
      if (s.trial_modal) {
        try {
          const parsed = JSON.parse(s.trial_modal);
          setModal({ ...DEFAULT_MODAL, ...parsed, features: parsed.features ?? DEFAULT_MODAL.features });
        } catch {}
      }
      if (s.ai_chat_daily_cap) setAiChatDailyCap(s.ai_chat_daily_cap);
      if (s.ai_chat_trial_cap) setAiChatTrialCap(s.ai_chat_trial_cap);
      if (s.ai_chat_upgrade_message) setAiChatUpgradeMessage(s.ai_chat_upgrade_message);
      if (s.notification_resend_window_days) setNotificationResendWindowDays(s.notification_resend_window_days);
    }).finally(() => setLoading(false));
  }, []);

  const updateFeature = (i, field, val) => {
    setModal(m => {
      const features = [...m.features];
      features[i] = { ...features[i], [field]: val };
      return { ...m, features };
    });
  };

  const addFeature = () => {
    setModal(m => ({
      ...m,
      features: [...m.features, { icon: "checkmark-circle", text: "", color: "#6B7280" }],
    }));
  };

  const removeFeature = (i) => {
    setModal(m => ({ ...m, features: m.features.filter((_, idx) => idx !== i) }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSetting("telegram_link", telegramLink),
        updateSetting("trial_days", trialDays),
        updateSetting("trial_modal", JSON.stringify(modal)),
        updateSetting("ai_chat_daily_cap", aiChatDailyCap),
        updateSetting("ai_chat_trial_cap", aiChatTrialCap),
        updateSetting("ai_chat_upgrade_message", aiChatUpgradeMessage),
        updateSetting("notification_resend_window_days", notificationResendWindowDays),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading settings…</div>;

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiSettings /> App Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Configure dynamic values used across the mobile app.</p>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-700 mb-4">General</h2>
        <Field label="Telegram Link" hint="Shown in app header and offline screen.">
          <input type="text" value={telegramLink} onChange={e => setTelegramLink(e.target.value)}
            placeholder="https://t.me/yourchannel" className={inputCls} />
        </Field>
        <Field label="Free Trial Duration (days)" hint="Number shown in the trial popup.">
          <input type="number" min="1" max="365" value={trialDays} onChange={e => setTrialDays(e.target.value)}
            className={inputCls} style={{ maxWidth: 120 }} />
        </Field>
      </div>

      {/* AI Chat Credits */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-700 mb-4">AI Chat Credits</h2>
        <Field label="Premium Daily Credit" hint="How many AI Chat messages a Premium user can send per day. Resets every day.">
          <input type="number" min="1" value={aiChatDailyCap} onChange={e => setAiChatDailyCap(e.target.value)}
            className={inputCls} style={{ maxWidth: 120 }} />
        </Field>
        <Field label="Trial Total Credit" hint="How many AI Chat messages a Trial user gets for their entire trial. Never resets.">
          <input type="number" min="1" value={aiChatTrialCap} onChange={e => setAiChatTrialCap(e.target.value)}
            className={inputCls} style={{ maxWidth: 120 }} />
        </Field>
        <Field label="Upgrade Message" hint="Shown to non-Premium users on the AI Chat lock screen.">
          <input type="text" value={aiChatUpgradeMessage} onChange={e => setAiChatUpgradeMessage(e.target.value)}
            className={inputCls} />
        </Field>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-700 mb-4">Notifications</h2>
        <Field label="Resend Window (days)" hint='A user is skipped as "already notified" only if they received a push with the exact same message text within this many days. Set to 0 to block an exact repeat forever (old behavior). Admin can still override per-send with "Resend anyway".'>
          <input type="number" min="0" value={notificationResendWindowDays} onChange={e => setNotificationResendWindowDays(e.target.value)}
            className={inputCls} style={{ maxWidth: 120 }} />
        </Field>
      </div>

      {/* Trial Modal */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-700 mb-4">Trial Popup Modal</h2>

        <Field label="Title" hint='Emoji + title text, e.g. "🎁 Start Your Free Trial"'>
          <input type="text" value={modal.title} onChange={e => setModal(m => ({ ...m, title: e.target.value }))}
            className={inputCls} />
        </Field>

        <Field label="Bold Line" hint='Bold text shown below the title, e.g. "No payment details required."'>
          <input type="text" value={modal.boldLine} onChange={e => setModal(m => ({ ...m, boldLine: e.target.value }))}
            className={inputCls} />
        </Field>

        <Field label="Sub Line" hint='Use {days} to insert trial duration. e.g. "Get {days} days of Full Premium Access for free!"'>
          <input type="text" value={modal.subLine} onChange={e => setModal(m => ({ ...m, subLine: e.target.value }))}
            className={inputCls} />
        </Field>

        <Field label="Button Text" hint='Text on the main CTA button.'>
          <input type="text" value={modal.buttonText} onChange={e => setModal(m => ({ ...m, buttonText: e.target.value }))}
            className={inputCls} />
        </Field>

        {/* Features list */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Feature List</p>
              <p className="text-xs text-gray-400">Ionicons icon name, feature text, hex color.</p>
            </div>
            <button onClick={addFeature}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700">
              <FiPlus size={13} /> Add
            </button>
          </div>

          <div className="space-y-2">
            {modal.features.map((f, i) => {
              const IconPreview = resolveIonicon(f.icon);
              return (
                <div key={i} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3 border border-gray-200">
                  {/* Live preview — confirms the typed name is a real
                      Ionicons icon before saving, and shows exactly what
                      it looks like. A "?" here means the name doesn't
                      exist; check the spelling against ionic.io/ionicons
                      (kebab-case, e.g. "help-circle", "document-text"). */}
                  <div
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center shrink-0 mt-0.5 bg-white"
                    title={IconPreview ? f.icon : `"${f.icon}" isn't a valid Ionicons name`}
                  >
                    {IconPreview ? (
                      <IconPreview size={18} color={f.color || "#374151"} />
                    ) : (
                      <FiHelpCircle size={16} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type="text" value={f.icon}
                          onChange={e => updateFeature(i, "icon", e.target.value)}
                          onFocus={() => setOpenIconPicker(i)}
                          onBlur={() => setOpenIconPicker(null)}
                          placeholder="Ionicons name — click to browse" className={inputCls + " w-full"} style={{ fontSize: 12 }} />
                        {openIconPicker === i && (
                          <div
                            // Stops the input's onBlur from firing before this
                            // click registers — otherwise the dropdown would
                            // close itself right before the option's onClick runs.
                            onMouseDown={(e) => e.preventDefault()}
                            className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
                          >
                            {ICON_OPTIONS.filter((opt) => opt.name.includes(f.icon.trim().toLowerCase())).slice(0, 40).map((opt) => (
                              <button
                                key={opt.name}
                                type="button"
                                onClick={() => { updateFeature(i, "icon", opt.name); setOpenIconPicker(null); }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-purple-50 text-xs"
                              >
                                <opt.Icon size={14} color={f.color || "#374151"} />
                                {opt.name}
                              </button>
                            ))}
                            {ICON_OPTIONS.filter((opt) => opt.name.includes(f.icon.trim().toLowerCase())).length === 0 && (
                              <p className="px-3 py-2 text-xs text-gray-400">No matching icon — check ionic.io/ionicons</p>
                            )}
                          </div>
                        )}
                      </div>
                      <input type="color" value={f.color} onChange={e => updateFeature(i, "color", e.target.value)}
                        className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5" title="Color" />
                    </div>
                    <input type="text" value={f.text} onChange={e => updateFeature(i, "text", e.target.value)}
                      placeholder="Feature description" className={inputCls} style={{ fontSize: 12 }} />
                  </div>
                  <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:text-red-600 mt-1 shrink-0">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSaveAll} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition text-sm">
        <FiSave size={16} />
        {saved ? "Saved!" : saving ? "Saving…" : "Save All Settings"}
      </button>
    </div>
  );
};

export default AppSettings;
