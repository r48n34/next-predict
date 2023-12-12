interface PNGImg {
    width: number;
    height: number;
    bitDepth: number;
    colorType: number;
    compressionMethod: number;
    filterMethod: number;
    interlaceMethod: number;
    colors: number;
    alpha: boolean;
    pixelBits: number;
    palette: any;
    pixels: Buffer;
    trns: any;
};

function getRGBA8Array(png: PNGImg):number[]{
    const width = png.width;
    const height = png.height;

	let data = new Array(width * height * 4);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let pixelData = getPixel(png, x, y);

			data[(y * width + x) * 4 + 0] = pixelData![0];
			data[(y * width + x) * 4 + 1] = pixelData![1];
			data[(y * width + x) * 4 + 2] = pixelData![2];
			data[(y * width + x) * 4 + 3] = pixelData![3];
		}
	}

	return data;
};

function getPixel(png: PNGImg, x:number, y: number){
	
	const i = png.colors * png.bitDepth / 8 * (y * png.width + x);
	const pixels = png.pixels;

	switch (png.colorType){
		case 0: return [pixels[i], pixels[i], pixels[i], 255];
		case 2: return [pixels[i], pixels[i + 1], pixels[i + 2], 255];
		case 3:
			let alpha = 255;

			if (png.trns != null && png.trns[pixels[i]] != null) {
				alpha = png.trns[pixels[i]];
			}

			return [
                png.palette[pixels[i] * 3 + 0],
                png.palette[pixels[i] * 3 + 1],
                png.palette[pixels[i] * 3 + 2],
			    alpha
            ];
		case 4: return [pixels[i], pixels[i], pixels[i], pixels[i + 1]];
		case 6: return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
	}
};

export { getRGBA8Array }