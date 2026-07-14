/**
 * Validates if a string is a supported shopping product URL
 * @param url - The URL string to validate
 * @returns true if the URL is from a supported shopping domain; false otherwise
 */
export const isShoppingProductUrl = (url: string): boolean => {
  const shoppingUrlPattern =
    /^https:\/\/(www\.)?(amzn\.in|amazon\.in|flipkart\.com|dl\.flipkart\.com|wforwoman\.com|shopforaurelia\.com|wishfulbyw\.com|elleven\.in|biba\.in|thesouledstore\.com|savana\.com|myntra\.com|nykaafashion\.com)(\/|$)/i;
  return shoppingUrlPattern.test(url);
};
