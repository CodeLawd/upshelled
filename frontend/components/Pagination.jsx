import Link from "next/link";
import { useState } from "react";
import ReactPaginate from "react-paginate";

const Items = ({ currentItems }) => {
  return (
    <tbody>
      {currentItems &&
        currentItems.map((order, id) => (
          <tr className="cursor-pointer">
            <Link key={id} href={`/orders/${order?.order_id}`}>
              <td>{id + 1}</td>
              <td>{order?.order_id}</td>
              <td>{order?.order_item_id}</td>
              <td>{order?.product_id}</td>
              <td>{order?.shipping_limit_date}</td>
              <td>{order?.price}</td>
              <td>{order?.freight_value}</td>
            </Link>
          </tr>
        ))}
    </tbody>
  );
};

const PaginatedItems = ({ itemsPerPage, items }) => {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items?.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items?.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full border rounded-none">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Order ID</th>
              <th>Order Item ID</th>
              <th>Product ID</th>
              <th>Shipping Date</th>
              <th>Price</th>
              <th>Frieght Value</th>
            </tr>
          </thead>

          <Items currentItems={currentItems} />
        </table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="flex gap-8 items-center justify-end mt-5"
        activeClassName="bg-black py-2 px-4 text-white font-bold"
      />
    </>
  );
};

export default PaginatedItems;
