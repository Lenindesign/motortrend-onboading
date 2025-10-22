/**
 * Date utility functions for the MotorTrend onboarding app
 */

/**
 * Formats a date as M/D/YYYY (e.g., "1/14/2024")
 * @param date - The date to format (defaults to current date)
 * @returns Formatted date string
 */
export const formatJoinDate = (date: Date = new Date()): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Gets the current date formatted as a join date
 * @returns Current date formatted as M/D/YYYY
 */
export const getCurrentJoinDate = (): string => {
  return formatJoinDate();
};

/**
 * Parses a join date string and returns a Date object
 * @param joinDateString - Date string in M/D/YYYY format
 * @returns Date object or null if invalid
 */
export const parseJoinDate = (joinDateString: string): Date | null => {
  try {
    const [month, day, year] = joinDateString.split('/').map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return null;
    }
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
};

export default {
  formatJoinDate,
  getCurrentJoinDate,
  parseJoinDate
};
