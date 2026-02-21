import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and optimizes them with tailwind-merge
 * to handle Tailwind CSS conflicts
 *
 * @param {...string} inputs - The class names to combine
 * @returns {string} - The merged class name string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with unit suffixes (K, M, B)
 *
 * @param {number} num - The number to format
 * @returns {string} - The formatted number with suffix
 */
export function formatNumberWithSuffix(num) {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
