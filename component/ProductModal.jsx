import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ mode, tempProduct, getProductData }) {
  const [modalData, setModalData] = useState(tempProduct);
  const modalElement = useRef(null);
  const modalInstance = useRef(null);

  // 1. 重要：當外部傳入的 tempProduct 改變時，更新內部的 modalData
  useEffect(() => {
    setModalData(tempProduct);
  }, [tempProduct]);

  // 2. 初始化 Modal (僅一次)
  useEffect(() => {
    if (modalElement.current) {
      modalInstance.current = new Modal(modalElement.current, {
        backdrop: "static", // 點擊背景不關閉
      });
    }
    // 清除函數，避免重複初始化導致的錯誤
    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, []);

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
      const apiPath =
        mode === "create"
          ? `${API_BASE}/api/${API_PATH}/admin/product`
          : `${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`;

      const method = mode === "create" ? "post" : "put";

      await axios[method](apiPath, { data: modalData });
      alert(mode === "create" ? "新增成功" : "更新成功");

      await getProductData(); // 重新抓取資料

      // 3. 正確隱藏 Modal
      modalInstance.current.hide();
    } catch (error) {
      alert("操作失敗：" + (error.response?.data?.message || "未知錯誤"));
    }
  };

  return (
    <div
      className="modal fade "
      ref={modalElement} // 5. 綁定 DOM Ref
      id="ProductModal" // 確保 ID 與 App 的 data-bs-target 對應
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
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
                      <label htmlFor="title" className="form-label fw-bold">
                        商品名稱
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="請輸入商品名稱"
                        value={modalData.title || ""}
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
                          min="0"
                          value={modalData.origin_price ?? 0}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="price" className="form-label fw-bold">
                          售價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          min="0"
                          value={modalData.price ?? 0}
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
                          value={modalData.category || ""}
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
                          value={modalData.unit || ""}
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
                        value={modalData.content || ""}
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
                        value={modalData.description || ""}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="is_enabled"
                        checked={!!modalData.is_enabled}
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
                      value={modalData.imageUrl || ""}
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
export default ProductModal;
