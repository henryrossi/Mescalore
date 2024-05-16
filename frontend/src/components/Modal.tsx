import * as React from "react";
import ReactCrop, { PercentCrop, centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import setCanvasPreview from "../setCanvasPreview";
import { RecipeData2 } from "../graphQL";
import "./Modal.css";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 600;

export default function Modal({ 
    closeModal, recipeData, setRecipeData 
} : {
    closeModal: () => void,
    recipeData: RecipeData2,
    setRecipeData: React.Dispatch<React.SetStateAction<RecipeData2>>,
}) {

    const [imageURL, setImageURL] = React.useState<string>("");
    const imageRef = React.useRef<HTMLImageElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [crop, setCrop] = React.useState<PercentCrop | undefined>();
    const [error, setError] = React.useState<string>("");


    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) {
            return;
        }
        const file = e.target.files[0];
        setImageURL(URL.createObjectURL(file));
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            setError("Image must be at least 600 x 600 pixels.");
            setImageURL("");
            return;
        }
        if (error) {
            setError("");
        }

        const cropWidthInPercent = (MIN_DIMENSION / naturalWidth) * 100;
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-modal" onClick={closeModal}>Close</button>
                <input
                    className="modal-upload"
                    type="file"
                    onChange={onSelectFile}
                />
                {error && <p className="modal-error">{error}</p>}
                {imageURL &&
                    <div className="modal-image-container">
                        <ReactCrop
                            crop={crop}
                            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                            keepSelection
                            aspect={ASPECT_RATIO}
                            minWidth={
                                imageRef.current ?
                                (MIN_DIMENSION / imageRef.current.naturalWidth) * imageRef.current.width : 0
                            }
                        >
                            <img 
                                ref={imageRef}
                                style={{ maxHeight: "90vh" }}
                                src={imageURL} 
                                alt="uploaded recipe"
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                        <button 
                            className="modal-crop-button"
                            onClick={() => {
                                // quick fix, needs revisit
                                if (canvasRef.current === null || imageRef.current === null || crop === undefined) {
                                    return;
                                }
                                setCanvasPreview(
                                    imageRef.current,
                                    canvasRef.current,
                                    convertToPixelCrop(
                                        crop, 
                                        imageRef.current.width, 
                                        imageRef.current.height
                                    )
                                );
                                canvasRef.current.toBlob((blob) => {
                                    if (blob === null) {
                                        setError("Unable to crop file");
                                        return;
                                    }
                                    let file = new File([blob], "newImage.png", { type: "image/png"});
                                    if (!file) {
                                        setError("Unable to crop file");
                                    } else {
                                        setRecipeData({...recipeData, picture: file})
                                        closeModal();
                                    }
                                }, "image/png");
                            }}
                        >
                            Crop Image
                        </button>
                    </div>
                }
                {crop && 
                        <canvas style={{
                            display: "none",
                            border: "1px solid black",
                            objectFit: "contain",
                            width: MIN_DIMENSION,
                            height: MIN_DIMENSION,
                        }} ref={canvasRef} />}
            </div>
        </div>
    );
}