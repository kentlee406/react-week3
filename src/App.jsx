import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import ProductModal from "../component/ProductModal";
import DeleteModal from "../component/DeleteModal";
import Pagination from "../component/Pagination";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [modalMode, setModalMode] = useState(""); // 追蹤現在是 'create' 還是 'edit'
  const [tempProduct, setTempProduct] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  });
  // 新增：頁面載入時自動驗證
  useEffect(() => {
    // 嘗試從 Cookie 取得 Token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      // 如果有 Token，就直接執行驗證流程
      checkLogin(token);
    }
  }, []); // 空陣列表示只在重新整理/首次進入時執行

  // 修改：checkLogin 傳入 token 參數
  async function checkLogin(token) {
    try {
      // 1. 設定 axios 預設 header
      axios.defaults.headers.common.Authorization = token;

      // 2. 呼叫檢查 API
      await axios.post(`${API_BASE}/api/user/check`);

      // 3. 驗證成功後的操作
      setisAuth(true); // 進入產品畫面
      getProductData(); // 抓取產品列表
    } catch (error) {
      console.error("驗證失敗或 Token 過期", error);
      // 驗證失敗可以選擇清空 header，讓使用者留在登入頁
      axios.defaults.headers.common.Authorization = "";
    }
  }

  const openModal = (mode, product) => {
    setModalMode(mode);
    if (mode === "create") {
      setTempProduct({
        title: "",
        category: "",
        unit: "",
        origin_price: 0,
        price: 0,
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
        imagesUrl: [""],
      });
    } else {
      setTempProduct(product);
    }
    // 手動取得該 Modal 實例並顯示
    const modalElement = document.getElementById("ProductModal");
    const instance = Modal.getOrCreateInstance(modalElement);
    instance.show();
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`,
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      axios.defaults.headers.common.Authorization = `${token}`;

      getProductData();

      setisAuth(true);
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  if (isAuth) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-8">
            <div className="d-flex justify-content-between">
              <h2 className="fw-bold">產品列表</h2>
              <button
                className="btn btn-success"
                onClick={() => openModal("create")}
              >
                新增產品
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>分類</th>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>編輯</th>
                  <th>刪除</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{item.category}</td>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => openModal("edit", item)}
                          >
                            編輯
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            id={"delete" + item.id}
                            onClick={() => setTempProduct(item)}
                            data-bs-target="#deleteModal"
                            data-bs-toggle="modal"
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="7">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          products={products}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <ProductModal
          mode={modalMode}
          tempProduct={tempProduct}
          getProductData={getProductData}
        />
        <DeleteModal
          getProductData={getProductData}
          tempProduct={tempProduct}
        />
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-6">
            <h2>登入</h2>
            <form id="form" className="form-signin" onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-group-text">帳號</span>
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  required
                  placeholder="請輸入帳號"
                  onChange={handleInputChange}
                  autoComplete="current-username"
                />
              </div>
              <div className="input-group">
                <span className="input-group-text">密碼</span>
                <input
                  type="password"
                  id="password"
                  required
                  className="form-control"
                  placeholder="請輸入密碼"
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="btn btn-primary mb-3">
                登入
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
