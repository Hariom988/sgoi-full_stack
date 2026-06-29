export const SIDEBAR_CONFIG = {
  expandedWidth: 160, 
  collapsedWidth: 60,
} as const;

export const SIDEBAR_WIDTH = {
  expanded: `${SIDEBAR_CONFIG.expandedWidth}px`,
  collapsed: `${SIDEBAR_CONFIG.collapsedWidth}px`,
} as const;