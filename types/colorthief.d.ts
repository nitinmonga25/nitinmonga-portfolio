declare module 'colorthief' {
  type RGB = [number, number, number];
  export function getColor(img: HTMLImageElement | string, quality?: number): Promise<RGB>;
  export function getPalette(img: HTMLImageElement | string, colorCount?: number, quality?: number): Promise<RGB[]>;
}
