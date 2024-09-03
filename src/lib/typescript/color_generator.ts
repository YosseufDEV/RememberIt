import { get } from "svelte/store";
import { TAGS_SLICE_DATABASE } from "./Database/CachedDatabase";

type Color = {
	readonly hex: string;
	readonly shades: string[];
	readonly tones: string[];
	readonly tints: string[];
	readonly hues: string[];
	readonly temperatures: string[];
	readonly similar_colors: string[];
};

type RGB = readonly [r: number, g: number, b: number];

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r: number, g: number, b: number) {
  var a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, GAMMA);
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function contrast(rgb1: RGB, rgb2: RGB) {
  var lum1 = luminance(...rgb1);
  var lum2 = luminance(...rgb2);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function hexToRgb(hex: string): RGB {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		return [
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16),
		];
    }
    return [0,0,0];
}

function getRandomInRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

function whitePercentage(rgb: RGB): number {
    return (rgb[0]+rgb[1]+rgb[2])/(255*3)
}

function colorSimilarityPercentage(color1, color2) {
    // Destructure RGB values from the input colors
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;

    // Calculate the Euclidean distance between the two colors
    const distance = Math.sqrt(
    Math.pow(r2 - r1, 2) +
    Math.pow(g2 - g1, 2) +
    Math.pow(b2 - b1, 2)
    );

    // Maximum possible distance between two RGB colors is sqrt(255^2 + 255^2 + 255^2) = 441.67
    const maxDistance = Math.sqrt(255 ** 2 + 255 ** 2 + 255 ** 2);

    // Convert distance to a similarity percentage
    const similarityPercentage = ((maxDistance - distance) / maxDistance) * 100;

    // Return the similarity percentage
    return similarityPercentage;
}

export function adjustColor(hex: string, percentage: number): string {
  // Ensure the percentage is within the range of -100 to 100
  percentage = Math.max(-100, Math.min(percentage, 100));

  // Parse the hex color
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Calculate the blend towards white (positive) or black (negative)
  if (percentage > 0) {
    r = Math.round(r + ((255 - r) * percentage) / 100);
    g = Math.round(g + ((255 - g) * percentage) / 100);
    b = Math.round(b + ((255 - b) * percentage) / 100);
  } else {
    r = Math.round(r * (1 + percentage / 100));
    g = Math.round(g * (1 + percentage / 100));
    b = Math.round(b * (1 + percentage / 100));
  }

  // Convert back to hex and ensure 2 digits
  const toHex = (c: number) => c.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateColor(colors: Color[]): string {
	const idk: number = getRandomInRange(0, 3);
    let index = -1;
    let selector = 'hex';
    const randomIndex: number = getRandomInRange(0, colors.length);
    const lastColor = get(TAGS_SLICE_DATABASE)[get(TAGS_SLICE_DATABASE).length-1].color;
      //

    switch(idk) {
        case 1: {
            selector = 'temperatures'
            index = getRandomInRange(0, colors[randomIndex].temperatures.length);
        }
        case 2: {
            selector = 'hues'
            index = getRandomInRange(0, colors[randomIndex].hues.length);
        }
    }

    let color: string;

    if(selector != 'hex') {
        color = colors[randomIndex][selector][index];
    } else {
        color = colors[randomIndex]['hex'];
    }
    const colorSimilarty = colorSimilarityPercentage(hexToRgb(color), lastColor);

    let colorAsRgb = hexToRgb(color);
    let isGreyish: boolean = (colorAsRgb[0] == colorAsRgb[1] && colorAsRgb[1] == colorAsRgb[2]);

    const contrastRatio = contrast(hexToRgb(color), [255,255,255])

    if(contrastRatio <= 3.5 && contrastRatio >= 1 && colorSimilarty < 25 || isGreyish)
        return generateColor(colors); 
    return color;
}

