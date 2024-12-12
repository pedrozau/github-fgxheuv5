/**
 * Formats a price number to Brazilian Real currency
 * @param price The price to format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Creates an object URL for a file
 * @param file The file to create URL for
 */
export function createObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes an object URL to prevent memory leaks
 * @param url The URL to revoke
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}