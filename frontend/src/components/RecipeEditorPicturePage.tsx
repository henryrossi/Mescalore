import * as React from "react";
import Modal from "./Modal";
import 'react-image-crop/dist/ReactCrop.css'
import { RecipeData2 } from "../types";

export default function RecipeEditorPicturePage({ 
  recipeData, 
  setRecipeData 
} : { 
  recipeData: RecipeData2, 
  setRecipeData: React.Dispatch<React.SetStateAction<RecipeData2>> 
}) {

  const [modalOpen, setModalOpen] = React.useState(false);
  const img = React.useRef<HTMLImageElement>(null);

  console.log(img);

  return (
    <>
      <button 
        className="upload-photo" 
        onClick={() => setModalOpen(true)}
      >
        Uplaod a new photo
      </button>
      {/* <input
        type="file"
        onChange={(e) => {
          dispatch({
            type: "changeInput",
            variable: "picture",
            value: e.target.files[0],
          });
        }}
      /> */}
      {recipeData.picture ? (
        <>
          <img ref={img} 
          className="image-display" src={URL.createObjectURL(recipeData.picture)} alt="" />
          <button
            className="discard-photo"
            onClick={() => setRecipeData({...recipeData, picture: null})} 
          >
            Discard current upload
          </button>
        </>
      ) : recipeData.imageURL ? (
        <img
          className="image-display"
          src={recipeData.imageURL}
          alt=""
        />
      ) : (
        <div className="noPicture">
          <p className="message">image unavailable</p>
        </div>
      )}
      {modalOpen && <Modal closeModal={() => setModalOpen(false)} recipeData={recipeData} setRecipeData={setRecipeData}/>}
    </>
  );
}
