import * as tf from '@tensorflow/tfjs';
import { decode } from 'jpeg-js';
import PNGReader from "png.js"
import { getRGBA8Array } from './pngUtilis';

// from tfjs-native soucre code
function decodeJpeg( contents: Uint8Array , channels:number ): tf.Tensor3D{
    const { width, height, data } = decode(contents, { useTArray: true });
    return bufferToTensor(data, width, height, channels);
}

function decodePng(contents: Uint8Array , channels:number): Promise<tf.Tensor3D>{

    return new Promise( (rec, rej) =>{
        const reader = new PNGReader(contents);
        reader.parse(async function(err, png){
            if (err){
                rej(err);
            };

            const width = png.getWidth();
            const height = png.getHeight();
            const data = getRGBA8Array(png as any);

            rec( bufferToTensor(data, width, height, channels) );
        });
    })

}

function bufferToTensor(inputarr: Uint8Array | number[], width:number, height: number, channels:number):tf.Tensor3D{

    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;  // offset into original data
 
    for (let i = 0; i < buffer.length; i += 3) {
        buffer[i] = inputarr[offset];
        buffer[i + 1] = inputarr[offset + 1];
        buffer[i + 2] = inputarr[offset + 2];
 
        offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, channels]);
}

// from tfjs-native soucre code
function getImageType(content: Uint8Array): "jpeg" | "png" {
    
    if (content.length > 3 && content[0] === 255 && content[1] === 216 && content[2] === 255) {
        return "jpeg";
    } 
    else if (
        content.length > 4 && content[0] === 71 && content[1] === 73 &&
        content[2] === 70 && content[3] === 56
    ){
        // return "gif";
        throw new Error("Gif format is not supported.")
    } 
    else if (
        content.length > 8 && content[0] === 137 && content[1] === 80 &&
        content[2] === 78 && content[3] === 71 && content[4] === 13 &&
        content[5] === 10 && content[6] === 26 && content[7] === 10
    ){
      return "png";
    } 
    else if (content.length > 3 && content[0] === 66 && content[1] === 77) {
        //   return "bmp";
        throw new Error("bmp format is not supported.")
    } 
    else {
        throw new Error("Expected image (JPEG, PNG), but got unsupported image type.");
    }

}

async function decodeImages(img: Uint8Array):Promise<tf.Tensor3D>{

    const imagesType: "jpeg" | "png" = getImageType(img);
    
    let imgTensor: tf.Tensor3D | null = null;

    if(imagesType === "jpeg"){
        imgTensor = decodeJpeg(img, 3)
    }
    else if(imagesType === "png"){
        imgTensor = await decodePng(img, 3)
    }
    else{
        throw new Error("Not support images format");
    }

    return imgTensor
    
}

// async function loadModelfuncLocal(){
//     const handler = tfNode.io.fileSystem("./models/flower400Code021model/model.json");
//     myModel = await tf.loadGraphModel(handler);
//     isModalLoaded = true;
// }

export { decodeImages, decodeJpeg, getImageType, decodePng }