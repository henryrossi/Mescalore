import React from "react";
import "./RecipeEditor.css";

export default function RecipeEditorPicturePage({ recipeData, dispatch }) {
  return (
    <>
      {recipeData.picture ? (
        <img src={URL.createObjectURL(recipeData.picture)} alt="" />
      ) : recipeData.base64picture ? (
        <img
          src={
            "data:image/jpeg;charset=utf-8;base64," +
            atob(recipeData.base64picture)
          }
          alt=""
        />
      ) : (
        <></>
      )}
      <div className="picture-input-controls">
        {recipeData.picture && (
          <button
            className="standard-recipe-button"
            onClick={(e) => {
              e.preventDefault();
              dispatch({
                /* Maybe create a remove Image action type */
                type: "changeInput",
                variable: "picture",
                value: null,
              });
            }}
          >
            Discard current upload
          </button>
        )}
        <div>
          <input
            className="picture-upload-input"
            type="file"
            onChange={(e) => {
              dispatch({
                type: "changeInput",
                variable: "picture",
                value: e.target.files[0],
              });
            }}
          />
          Upload new picture
        </div>
      </div>
    </>
  );
}
