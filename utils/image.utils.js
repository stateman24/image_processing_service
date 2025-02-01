import sharp from "sharp"


const imageTransformer = async (imageBuffer, transformation) => {
    const image =  sharp(imageBuffer)
    const transformations = transformation.transformations;
    const transformParamKeys = Object.keys(transformations);
    for (let key in transformParamKeys) {
        switch (key) {
            case "resize":
                image.resize(transformations.resize);
                break;
            case "crop":
                image.extract(transformations.crop);
                break;
            case "rotate":
                image.rotate(transformations.rotate);
                break;
        }
    }
    return image.toBuffer();
}
// TODO: Image is not transforming
export default imageTransformer