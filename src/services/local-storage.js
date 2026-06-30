import { z } from "zod";
import { defaultPageMargin, defaultSettings, defaultTemplates } from "@/data/defaults";

const SETTINGS_KEY = "simpoi.settings";
const TEMPLATES_KEY = "simpoi.templates";
const STORAGE_EVENT = "simpoi-storage-change";

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
});

const settingsSchema = z.object({
  districtName: z.string(),
  headVillageName: z.string(),
  headVillageNip: z.string(),
  headVillageRank: z.string().optional().default(""),
  logoBase64: z.string(),
  regencyName: z.string(),
  superiorName: z.string().optional().default(""),
  superiorNip: z.string().optional().default(""),
  superiorRank: z.string().optional().default(""),
  superiorTitle: z.string().optional().default(""),
  villageAddress: z.string(),
  villageName: z.string(),
  villagePlaceName: z.string().optional().default(""),
  letterNumberFormat: z.string().optional().default("{nomor}/{kode}/{kode_instansi}/{bulan}/{tahun}"),
  letterNumberPrefix: z.string().optional().default(""),
  whatsappTemplate: z.string(),
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
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  emitChange();
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
  window.addEventListener(STORAGE_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(STORAGE_EVENT, listener);
    window.removeEventListener("storage", listener);
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
