import { z } from "zod";
import { defaultPageMargin, defaultSettings, defaultTemplates } from "@/data/defaults";

const SETTINGS_KEY = "simpoi.settings";
const TEMPLATES_KEY = "simpoi.templates";
const STORAGE_EVENT = "simpoi-storage-change";
const DRAFTS_KEY = "simpoi.drafts";
const HISTORY_KEY = "simpoi.history";

const templateSchema = z.object({
  category: z.string(),
  code: z.string(),
  contentHtml: z.string(),
  createdAt: z.string(),
  id: z.string(),
  isActive: z.boolean(),
  name: z.string(),
  pageMargin: z
    .object({
      bottom: z.number(),
      left: z.number(),
      right: z.number(),
      top: z.number(),
    })
    .optional(),
  sortOrder: z.number(),
  updatedAt: z.string(),
  internalNotes: z.string().optional().default(""),
});

const settingsSchema = z.object({
  districtName: z.string().optional().default(""),
  headVillageName: z.string().optional().default(""),
  headVillageNip: z.string().optional().default(""),
  headVillageRank: z.string().optional().default(""),
  logoBase64: z.string().optional().default(""),
  regencyName: z.string().optional().default(""),
  superiorName: z.string().optional().default(""),
  superiorNip: z.string().optional().default(""),
  superiorRank: z.string().optional().default(""),
  superiorTitle: z.string().optional().default(""),
  villageAddress: z.string().optional().default(""),
  villageName: z.string().optional().default(""),
  villagePlaceName: z.string().optional().default(""),
  letterNumberFormat: z.string().optional().default("{nomor}/{kode}/{kode_instansi}/{bulan}/{tahun}"),
  letterNumberPrefix: z.string().optional().default(""),
  whatsappTemplate: z.string().optional().default(""),
  villagePostalCode: z.string().optional().default(""),
  villageEmail: z.string().optional().default(""),
  villageSocialMedia: z.string().optional().default(""),
  headVillageTitle: z.string().optional().default("Kepala Ohoi"),
  headVillageName_kepalaOhoi: z.string().optional().default(""),
  headVillageNip_kepalaOhoi: z.string().optional().default(""),
  headVillageName_pjDesa: z.string().optional().default(""),
  headVillageNip_pjDesa: z.string().optional().default(""),
  stampBase64_kepalaOhoi: z.string().optional().default(""),
  signatureBase64_kepalaOhoi: z.string().optional().default(""),
  stampBase64_pjDesa: z.string().optional().default(""),
  signatureBase64_pjDesa: z.string().optional().default(""),
});

function isBrowser() {
  return typeof window !== "undefined";
}

function emitChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

function readJson(key, fallback, schema) {
  if (!isBrowser()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    const parsedObj = JSON.parse(raw);
    if (schema) {
      const parsed = schema.safeParse(parsedObj);
      return parsed.success ? parsed.data : fallback;
    }
    return parsedObj;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (isBrowser()) {
    window.localStorage.setItem(key, JSON.stringify(value));
    emitChange();
  }
}

function bySortOrder(a, b) {
  return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
}

function normalizeMarginValue(value, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  const normalized = value > 10 ? value / 10 : value;
  return Math.max(0, normalized);
}

export function normalizePageMargin(pageMargin) {
  return {
    top: normalizeMarginValue(pageMargin?.top, defaultPageMargin.top),
    right: normalizeMarginValue(pageMargin?.right, defaultPageMargin.right),
    bottom: normalizeMarginValue(pageMargin?.bottom, defaultPageMargin.bottom),
    left: normalizeMarginValue(pageMargin?.left, defaultPageMargin.left),
  };
}

function normalizeTemplate(template) {
  return {
    ...template,
    pageMargin: normalizePageMargin(template.pageMargin),
  };
}

export function subscribesimpoiStorage(listener) {
  if (isBrowser()) {
    window.addEventListener(STORAGE_EVENT, listener);
    window.addEventListener("storage", listener);
  }

  return () => {
    if (isBrowser()) {
      window.removeEventListener(STORAGE_EVENT, listener);
      window.removeEventListener("storage", listener);
    }
  };
}

export function getSettings() {
  return readJson(SETTINGS_KEY, defaultSettings, settingsSchema);
}

export function saveSettings(settings) {
  writeJson(SETTINGS_KEY, settings);
  return settings;
}

export function resetSettings() {
  saveSettings(defaultSettings);
  return defaultSettings;
}

export function getTemplates(options = {}) {
  const templates = readJson(TEMPLATES_KEY, defaultTemplates, z.array(templateSchema))
    .map(normalizeTemplate)
    .sort(bySortOrder);
  return options.activeOnly ? templates.filter((template) => template.isActive) : templates;
}

export function saveTemplates(templates) {
  const sortedTemplates = [...templates].map(normalizeTemplate).sort(bySortOrder);
  writeJson(TEMPLATES_KEY, sortedTemplates);
  return sortedTemplates;
}

export function createTemplate(values) {
  const now = new Date().toISOString();
  const template = {
    ...values,
    createdAt: now,
    id: `tpl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    updatedAt: now,
  };

  saveTemplates([...getTemplates(), template]);
  return template;
}

export function updateTemplate(id, values) {
  let updated;
  const templates = getTemplates().map((template) => {
    if (template.id !== id) {
      return template;
    }

    saveToHistory(template);

    updated = {
      ...template,
      ...values,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  saveTemplates(templates);
  return updated;
}

export function deleteTemplate(id) {
  saveTemplates(getTemplates().filter((template) => template.id !== id));
}

export function resetDefaultTemplates() {
  saveTemplates(defaultTemplates);
  return defaultTemplates;
}

export function getDashboardStats() {
  const templates = getTemplates();

  return {
    activeTemplates: templates.filter((template) => template.isActive).length,
    inactiveTemplates: templates.filter((template) => !template.isActive).length,
    totalTemplates: templates.length,
  };
}

// Drafts
export function getTemplateDraft(id) {
  const drafts = readJson(DRAFTS_KEY, {});
  return drafts[id];
}

export function saveTemplateDraft(id, draftData) {
  const drafts = readJson(DRAFTS_KEY, {});
  drafts[id] = draftData;
  writeJson(DRAFTS_KEY, drafts);
}

export function clearTemplateDraft(id) {
  const drafts = readJson(DRAFTS_KEY, {});
  delete drafts[id];
  writeJson(DRAFTS_KEY, drafts);
}

// Duplication
export function duplicateTemplate(id) {
  const templates = getTemplates();
  const template = templates.find((t) => t.id === id);
  if (!template) {
    return null;
  }
  const now = new Date().toISOString();
  const newTemplate = {
    ...template,
    id: `tpl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${template.name} - Salinan`,
    code: `${template.code}_COPY`.slice(0, 20),
    createdAt: now,
    updatedAt: now,
  };
  saveTemplates([...templates, newTemplate]);
  return newTemplate;
}

// Export/Import JSON
export function exportTemplatesJson() {
  return JSON.stringify(getTemplates(), null, 2);
}

export function importTemplatesJson(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    const parsed = z.array(templateSchema).safeParse(data);
    if (!parsed.success) {
      return false;
    }
    const currentTemplates = getTemplates();
    const newTemplates = parsed.data;
    const merged = [...currentTemplates];
    for (const t of newTemplates) {
      const idx = merged.findIndex((item) => item.id === t.id);
      if (idx !== -1) {
        merged[idx] = t;
      } else {
        merged.push(t);
      }
    }
    saveTemplates(merged);
    return true;
  } catch {
    return false;
  }
}

// History
function saveToHistory(template) {
  const history = readJson(HISTORY_KEY, {});
  if (!history[template.id]) {
    history[template.id] = [];
  }
  const lastHistory = history[template.id][history[template.id].length - 1];
  if (
    lastHistory &&
    lastHistory.contentHtml === template.contentHtml &&
    lastHistory.name === template.name &&
    lastHistory.code === template.code
  ) {
    return;
  }
  const newHistoryEntry = {
    category: template.category,
    code: template.code,
    contentHtml: template.contentHtml,
    isActive: template.isActive,
    name: template.name,
    pageMargin: template.pageMargin,
    sortOrder: template.sortOrder,
    internalNotes: template.internalNotes,
    updatedAt: template.updatedAt,
  };
  history[template.id].push(newHistoryEntry);
  if (history[template.id].length > 10) {
    history[template.id].shift();
  }
  writeJson(HISTORY_KEY, history);
}

export function restoreTemplateHistory(id, index) {
  const history = readJson(HISTORY_KEY, {});
  const templateHistory = history[id] || [];
  const version = templateHistory[index];
  if (!version) {
    return null;
  }
  const updated = updateTemplate(id, version);
  return updated;
}
