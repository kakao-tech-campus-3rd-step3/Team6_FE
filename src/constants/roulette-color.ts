export const COLORS = [
  "primary",
  "primary-light",
  "primary-dark",
  "secondary",
  "accent-1",
  "accent-2",
  "accent-3",
  "accent-4",
  "accent-5",
  "accent-6",
  "accent-7",
  "accent-8",
] as const;

type ColorKey = (typeof COLORS)[number];

export const COLOR_MAP: Record<ColorKey, string> = {
  primary: "#687eff",
  "primary-light": "#8a9bff",
  "primary-dark": "#5563d9",
  secondary: "#687eff66",
  "accent-1": "#7c89ff",
  "accent-2": "#6b8cff",
  "accent-3": "#5f7aff",
  "accent-4": "#8593ff",
  "accent-5": "#6d84ff",
  "accent-6": "#7890ff",
  "accent-7": "#6175ff",
  "accent-8": "#829aff",
};
