function Pagination({ products, pageSize, currentPage, setCurrentPage }) {
  let totalPage = Math.ceil(products.length / pageSize);
  let PageList = [];
  for (let i = 1; i <= totalPage; i++) {
    PageList.push(i);
  }
  return (
    <div>
      <nav>
        <ul className="pagination justify-content-center">
          {PageList.map((page) => (
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
export default Pagination;
