import sharp from "sharp"



export const getImageMetadata = async(imageFile) =>{
    try{
        const image = sharp(imageFile)
        const imageMetadata = await image.metadata();
        return {
            format: imageMetadata.format,
            size: imageMetadata.size,
            height: imageMetadata.height,
            width: imageMetadata.width,
        }

    }catch(err){
        return Promise.reject(err)
    }

}


export const imageTransformer = async (imageBuffer, transformation) => {
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