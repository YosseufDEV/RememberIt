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

function generateColor(colors: Color[]): string {
	const idk: number = getRandomInRange(0, 3);
    let index = -1;
    let selector = 'hex';
    const randomIndex: number = getRandomInRange(0, colors.length);

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
    }
    color = colors[randomIndex]['hex'];
    let colorAsRgb = hexToRgb(color);
    let isGreyish: boolean = (colorAsRgb[0] == colorAsRgb[1] && colorAsRgb[1] == colorAsRgb[2]);

    const contrastRatio = contrast(hexToRgb(color), [255,255,255])

    if(contrastRatio <= 3.5 || isGreyish)
        return generateColor(colors); 
    return color;
}

export default generateColor; 

