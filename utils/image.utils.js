import sharp from "sharp"


const getImageMetadata = async(imageBuffer) =>{

}


const imageTransformer = async (imageBuffer, transformation) => {
    const image =  sharp(imageBuffer)
    const transformParamKeys = Object.keys(transformation);
    // loop through all the transformation key
    for(let key of transformParamKeys) {
        if(key === "crop"){
            console.log(key)
            image.extract(transformation.crop);
        }
        if(key === "rotate"){
            console.log(key)
            image.rotate(transformation.rotate);
        }
        if (key === "resize"){
            console.log(key)
            image.resize(transformation.resize);
        }
    }

    return image.toBuffer();
}
export default imageTransformer