import * as tf from '@tensorflow/tfjs';

async function createModel(
    url: string, 
    method: "LayersModel" | "GraphModel",
    setLoadingProgress?: Function
):Promise<tf.LayersModel | tf.GraphModel<string | tf.io.IOHandler>>{ // fit model in hook myModel

    function callBackProgress(num:number){
        !!setLoadingProgress && setLoadingProgress(num)
    }
    
    const mod = method === "LayersModel" 
    ? await tf.loadLayersModel(url,{
        onProgress: (e) => callBackProgress(Math.floor(e * 100)) 
    }) 
    : await tf.loadGraphModel(url, {
        onProgress: (e) => callBackProgress(Math.floor(e * 100)) 
    });

    return mod
}

// for img elements to display the images fron=m useState
function createObj(img: Blob | MediaSource){
    return URL.createObjectURL(img);
}

function timer(t: number){
    return new Promise( (rec) => {
      setTimeout(rec, t)
    })
}

interface RankObj {
    label: string
    confident: number 
}

export interface PredictedObject {
    data: RankObj[]
    "status": boolean;
    "timeTaken": number
    "totalTime": number
}

async function predictResultTopN(
    myModel: tf.GraphModel<string | tf.io.IOHandler>, // tf.LayersModel | tf.GraphModel<string | tf.io.IOHandler>,
    imgInputId: string,
    imgSize:number,
    subNum:number,
    divNum:number,
    labelArr:any[],
    n: number = 5
): Promise<PredictedObject>{
    let obj = {} as any;

    try{

        const imageRef = document.getElementById(imgInputId) as HTMLImageElement; // That image elements
        
        let waitTime = 800 // Normal wait time
        await timer(waitTime);
    
        let start = new Date();
    
        let imgPre = tf.browser.fromPixels(imageRef)
            .resizeNearestNeighbor([imgSize, imgSize])
            .toFloat()
            .div(tf.scalar(divNum))
            .sub(tf.scalar(subNum))  
            .expandDims();
        
        const possibleArray = await (myModel.predict(imgPre) as tf.Tensor<tf.Rank>).data();

        // tfjs default value
        const {values, indices} = tf.topk(possibleArray, n);  

        const top5ArrPoss:number[] = Array.from( values.dataSync() )
        const top5Arr:number[]     = Array.from( indices.dataSync() )

        let topNArr:RankObj[] = []
        for(let op = 0; op < n; op ++){
            topNArr.push({ 
                label: labelArr[ top5Arr[op] ],
                confident: top5ArrPoss[op]
            })
        }

        obj = {
            data: topNArr,
            status: true,
            timeTaken: (new Date().getTime() - start.getTime()) / 1000,
            totalTime: (new Date().getTime() - start.getTime() + waitTime) / 1000,
        }
    
    }
    catch(err){
        obj = {
            data: [],
            status: false,
            timeTaken: -1,
            totalTime: -1
        }

        console.log(err);
    }
    finally{
        console.log(obj)
        return obj;
    }

}


export { 
    timer,
    createModel,
    createObj,
    predictResultTopN,
}