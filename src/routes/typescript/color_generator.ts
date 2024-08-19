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
	const randomIndex: number = getRandomInRange(0, colors.length);

	const color: string = colors[randomIndex].hex
    const whitePercetnageNumber = whitePercentage(hexToRgb(color))
    console.log(whitePercetnageNumber);
    if(whitePercetnageNumber >= 0.5 && whitePercetnageNumber >= 0.2)
        return generateColor(colors); 
    return color;
}

export default generateColor; 

