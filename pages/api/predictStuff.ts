import { formService } from '@/services/formService';
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import FileType from "file-type"

import * as tf from '@tensorflow/tfjs';
import { decodeImages } from "../../utilis/imgDecodeUtilis"
import modelData  from "../../useData/modelData.json"

let myModel: tf.GraphModel<string | tf.io.IOHandler>;
let isModalLoaded: boolean = false;
 
async function loadModelfunc(){
    myModel = await tf.loadGraphModel("https://cdn.jsdelivr.net/gh/r48n34/leafers/model/flower400Code021model/model.json");
    isModalLoaded = true;
}
 
const labelMyModel = modelData.labels;

export const config = {
    api: {
        bodyParser: false
	}
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {

        let start = new Date().valueOf();
        let obj = {} as any;

        const [_, files] = await formService.parseRequest(req);

        if(!files.file){
            throw new Error("Missing input files")
        }
        
        const png_in_path     = (files.file as any).filepath

        // const png_in_path_type = await FileType.fromFile(png_in_path)
        // if(png_in_path_type?.ext !== "png"){
        //     throw new Error("Invalid file type")
        // }

        const imageBuffer = fs.readFileSync(png_in_path)
    
        !isModalLoaded && ( await loadModelfunc() );

        let imgTensor: tf.Tensor3D = await decodeImages(imageBuffer);
        
        let adjustedTensor = imgTensor.resizeNearestNeighbor([modelData.offlineInfo.size, modelData.offlineInfo.size])
            .toFloat()
            .div(tf.scalar(modelData.offlineInfo.divValue)) 
            .sub(tf.scalar(modelData.offlineInfo.subVal)) 
            .expandDims();

        const predictArr = await (myModel.predict(adjustedTensor) as tf.Tensor).data();

        const k = 5;
        // tfjs default value
        const {values, indices} = tf.topk(predictArr, k);  

        const topKArrPoss = Array.from( values.dataSync() )
        const topKArr:number[] = Array.from( indices.dataSync() )

        let topKArrFinal = []
        for(let ind = 0; ind < k; ind ++){
            topKArrFinal.push({
                label: labelMyModel[ topKArr[ind] ], 
                confident: topKArrPoss[ind]  
            })
        }

        const nowTime = new Date().valueOf();

        obj = {
            ...obj,
            status: true,
            rankList: topKArrFinal,
            timeTaken: (nowTime - start) / 1000 + " secs",
            timeTakenOffset: ""
        }

        console.log(obj)

        return res.status(200).send({ status: true, data: obj });
    } 
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }

}
