import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "kentlee406";
function InsertModal({ getProductData }) {
  const initialState = {
    title: "",
    category: "",
    unit: "",
    origin_price: 0,
    price: 0,
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: ["", "", "", ""],
  };
  const [tempProduct, setTempProducts] = useState(initialState);
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTempProducts((prev) => ({
      ...prev,
      // 如果是數字類型則轉為 Number，如果是 checkbox 則存布林或 0/1
      [id]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  // 修正：async 放在 () 前面
  const handleSave = async () => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, {
        data: tempProduct,
      });

      // A. 刷新父組件的資料
      await getProductData();

      // B. 重置表單為初始狀態
      setTempProducts(initialState);

      // C. 自動關閉 Modal
      const modalElement = document.getElementById("insertModal");
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      const message = error.response?.data?.message || "發生錯誤";
      alert(`新增失敗：${message}`);
    }
  };
  return (
    <div
      className="modal fade modal-dialog modal-lg"
      id="insertModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">新增產品</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                <div className="col-lg-7">
                  <form>
                    <div className="mb-3">
                      <label
                        htmlFor="productName"
                        className="form-label fw-bold"
                      >
                        商品名稱
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="請輸入商品名稱"
                        value={tempProduct.title}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label
                          htmlFor="origin_price"
                          className="form-label fw-bold"
                        >
                          原價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="origin_price"
                          value={tempProduct.origin_price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label
                          htmlFor="sellPrice"
                          className="form-label fw-bold"
                        >
                          售價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          value={tempProduct.price}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label
                          htmlFor="category"
                          className="form-label fw-bold"
                        >
                          分類
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="category"
                          value={tempProduct.category}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="unit" className="form-label fw-bold">
                          單位
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="unit"
                          value={tempProduct.unit}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="content" className="form-label fw-bold">
                        商品內容
                      </label>
                      <textarea
                        className="form-control"
                        id="content"
                        rows="4"
                        value={tempProduct.content}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="description"
                        className="form-label fw-bold"
                      >
                        商品描述
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="4"
                        value={tempProduct.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="is_enabled"
                        checked={tempProduct.is_enabled === 1}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fw-bold"
                        htmlFor="is_enabled"
                      >
                        啟用
                      </label>
                    </div>
                  </form>
                </div>

                <div className="col-lg-5">
                  <label className="form-label fw-bold">
                    上傳圖片 (最多 4 張)
                  </label>

                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="輸入圖片連結"
                      id="imageUrl"
                      value={tempProduct.imageUrl}
                      onChange={handleInputChange}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      新增連結
                    </button>
                  </div>

                  <div className="input-group mb-4">
                    <input
                      type="file"
                      className="form-control"
                      id="imagesUrl"
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      上傳圖片
                    </button>
                  </div>

                  <p className="fw-bold">已上傳圖片</p>
                  <div className="row g-2">
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 1</div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 2</div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 3</div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={handleSave}
            >
              存檔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ getProductData, tempProduct }) {
  // 1. 建立內部的狀態，避免直接修改 props
  const [modalData, setModalData] = useState({ ...tempProduct });

  // 2. 當父組件傳入的 tempProduct 改變時，更新內部狀態
  useEffect(() => {
    setModalData({ ...tempProduct });
  }, [tempProduct]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setModalData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      // 判斷是「新增」還是「編輯」 (假設透過是否有 id 來判斷)
      const method = modalData.id ? "put" : "post";
      const url = modalData.id
        ? `${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`
        : `${API_BASE}/api/${API_PATH}/admin/product`;

      await axios[method](url, { data: modalData });

      alert(modalData.id ? "修改成功" : "新增成功");

      // 刷新父組件資料
      await getProductData();
    } catch (error) {
      const message = error.response?.data?.message || "發生錯誤";
      alert(`操作失敗：${message}`);
    }
  };
  return (
    <div
      className="modal fade"
      id="editModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">修改產品</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                <div className="col-lg-7">
                  <form>
                    <div className="mb-3">
                      <label
                        htmlFor="productName"
                        className="form-label fw-bold"
                      >
                        商品名稱
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="請輸入商品名稱"
                        value={modalData.title}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label
                          htmlFor="origin_price"
                          className="form-label fw-bold"
                        >
                          原價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="origin_price"
                          value={modalData.origin_price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label
                          htmlFor="sellPrice"
                          className="form-label fw-bold"
                        >
                          售價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          value={modalData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label
                          htmlFor="category"
                          className="form-label fw-bold"
                        >
                          分類
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="category"
                          value={modalData.category}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="unit" className="form-label fw-bold">
                          單位
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="unit"
                          value={modalData.unit}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="content" className="form-label fw-bold">
                        商品內容
                      </label>
                      <textarea
                        className="form-control"
                        id="content"
                        rows="4"
                        value={modalData.content}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="description"
                        className="form-label fw-bold"
                      >
                        商品描述
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="4"
                        value={modalData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="is_enabled"
                        checked={modalData.is_enabled === 1}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fw-bold"
                        htmlFor="is_enabled"
                      >
                        啟用
                      </label>
                    </div>
                  </form>
                </div>

                <div className="col-lg-5">
                  <label className="form-label fw-bold">
                    上傳圖片 (最多 4 張)
                  </label>

                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="輸入圖片連結"
                      id="imageUrl"
                      value={modalData.imageUrl}
                      onChange={handleInputChange}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      新增連結
                    </button>
                  </div>

                  <div className="input-group mb-4">
                    <input
                      type="file"
                      className="form-control"
                      id="imagesUrl"
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      上傳圖片
                    </button>
                  </div>

                  <p className="fw-bold">已上傳圖片</p>
                  <div className="row g-2">
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 1</div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 2</div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 3</div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="img-preview-box">Image 4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={handleSave}
            >
              存檔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ getProductData, tempProduct }) {
  const handleDelete = async () => {
    try {
      // 確保 API_BASE 和 API_PATH 已定義或從 props 傳入
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`
      );

      alert("刪除成功！");

      // 1. 刷新父組件的產品列表
      await getProductData();
    } catch (error) {
      const message = error.response?.data?.message || "發生錯誤";
      alert(`刪除失敗：${message}`);
    }
  };

  return (
    <div
      className="modal fade"
      id="deleteModal"
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content border-0">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="deleteModalLabel">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            是否刪除
            <strong className="text-danger"> {tempProduct.title} </strong>
            (刪除後將無法恢復)。
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              data-bs-dismiss="modal"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
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
  async function checkLogin() {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];
      console.log(token);
      axios.defaults.headers.common.Authorization = token;

      const res = await axios.post(`${API_BASE}/api/user/check`);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  const getProductData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
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
                type="button"
                className="btn btn-success"
                id="insertProduct"
                data-bs-target="#insertModal"
                data-bs-toggle="modal"
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
                  products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          id={"edit" + item.id}
                          onClick={() => setTempProduct(item)}
                          data-bs-target="#editModal"
                          data-bs-toggle="modal"
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
        <InsertModal getProductData={getProductData} />
        <EditModal getProductData={getProductData} tempProduct={tempProduct} />
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
                  type="text"
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
