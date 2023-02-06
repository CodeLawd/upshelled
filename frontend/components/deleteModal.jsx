import React from "react";

const DeleteModal = ({ deleteOrder }) => {
  return (
    <>
      <input type="checkbox" id="my-modal-1" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to delete this order?</h3>

          <div className="modal-action flex items-center">
            <button className="btn rounded-none bg-green-700 border-none flex-1" onClick={deleteOrder}>
              Yes
            </button>
            <label htmlFor="my-modal-1" className="btn btn-outline rounded-none btn-error flex-1">
              No
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
