import { PencilSquareIcon } from "@heroicons/react/24/solid";
import React from "react";

const EditModal = ({ loading, editOrder, price, setPrice, freightValue, setFreightValue }) => {
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label htmlFor="my-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="font-bold text-lg">Edit Order</h3>
          <div>
            <div className="flex flex-col mt-6 space-y-2">
              <label htmlFor="Price"> Price </label>
              <input
                type="text"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-black input rounded-none input-bordered focus:outline-offset-0 focus:outline-1 disabled:bg-[#ececec] disabled:text-black"
              />
            </div>

            <div className="flex flex-col mt-6 space-y-2">
              <label htmlFor="Freight Value"> Freight Value: </label>
              <input
                type="text"
                name="freight_value"
                value={freightValue}
                onChange={(e) => setFreightValue(e.target.value)}
                className="text-black input rounded-none input-bordered focus:outline-offset-0 focus:outline-1 disabled:bg-[#ececec] disabled:text-black"
              />
            </div>
          </div>
          <div className="modal-action">
            <label
              htmlFor="my-modal"
              className={`${loading && "loading"} btn rounded-none bg-green-700 border-none flex-1`}
              onClick={editOrder}
            >
              <PencilSquareIcon className="h-5 w-5 cursor-pointer mr-3" /> {loading ? "" : "Update Order"}
            </label>
          </div>
        </label>
      </label>
    </>
  );
};

export default EditModal;
