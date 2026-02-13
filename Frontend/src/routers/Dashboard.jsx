import { useEffect, useState } from "react";
import { Package, Search } from "lucide-react";
import "./css/dashboard.css";
import { showAlert } from "../scripts/Alert";

export default function Dashboard() {
  const emptyOrder = {
    orderNumber: "",
    customerName: "",
    phone: "",
    address: "",
    items: []
  };

  const emptyItem = {
    productName: "",
    unitPrice: "",
    quantity: ""
  };

  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(emptyOrder);
  const [currentItem, setCurrentItem] = useState(emptyItem);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [itemError, setItemError] = useState("");
  const [editItemIndex, setEditItemIndex] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch("http://localhost:3000/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const addItem = () => {

    if (!currentItem.productName ||
      !currentItem.unitPrice ||
      !currentItem.quantity) {

      setItemError("Please fill in all product fields.");
      return;
    }

    setItemError("");

    const newItem = {
      ...currentItem,
      unitPrice: Number(currentItem.unitPrice),
      quantity: Number(currentItem.quantity),
      totalPrice: 0
    };
    if (editItemIndex !== null) {
      const updated = [...formData.items];
      updated[editItemIndex] = newItem;

      setFormData({ ...formData, items: updated });
      setEditItemIndex(null);
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, newItem]
      });
    }

    setCurrentItem(emptyItem);
  };

  const removeItem = (index) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  const handleSubmit = async () => {
    if (formData.customerName.length === 0 && formData.address.length === 0 && formData.orderNumber.length === 0 && formData.phone.length === 0) {
      await showAlert("Has customer detail.");
      return;
    }

    if (formData.items.length === 0) {
      await showAlert("Add at least one product");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `http://localhost:3000/orders/${editingId}` : "http://localhost:3000/orders";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(() => {
        fetchOrders();
        setShowModal(false);
        setFormData(emptyOrder);
        setEditingId(null);
      });
  };

  const handleEdit = (order) => {
    setFormData({
      ...order,
      items: order.items ? [...order.items] : []
    });

    setEditingId(order.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/orders/${id}`, { method: "DELETE" })
      .then(() => fetchOrders());
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="dashboard-wrapper">
        <div className="dashboard-header">
          <h2><Package /> Order Dashboard</h2>

          <div className="header-actions">
            <div className="searchbar">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <span>
                <Search /> Search order...
              </span>
            </div>

            <button onClick={() => setShowModal(true)}>
              + Add Order
            </button>
          </div>
        </div>

        <div className="order-grid">
          {filteredOrders.length > 0 ? filteredOrders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="detail">
                <h3>{order.orderNumber}</h3>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p className="total-amount">฿ {order.totalAmount}</p>
              </div>

              <div className="card-actions">
                <div className="single">
                  <button className="btn-view" onClick={() => setViewOrder(order)}>View</button>
                </div>

                <div className="multi">
                  <button className="btn-edit" onClick={() => handleEdit(order)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(order.id)}>Delete</button>
                </div>
              </div>
            </div>
          )) : (
            <>
              <div className="order-card" style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
                <h3>No Items</h3>
              </div>
            </>
          )}
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">

            <h3>{editingId ? "Edit Order" : "Add Order"}</h3>

            <input name="orderNumber" placeholder="Order Number" value={formData.orderNumber} onChange={handleChange} />
            <input name="customerName" placeholder="Customer Name" value={formData.customerName} onChange={handleChange} />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />

            <hr />

            <h4>Add Product</h4>

            <input name="productName" placeholder="Product Name" value={currentItem.productName} onChange={handleItemChange} />
            <input name="unitPrice" placeholder="Unit Price" type="number" value={currentItem.unitPrice} onChange={handleItemChange} />
            <input name="quantity" placeholder="Quantity" type="number" value={currentItem.quantity} onChange={handleItemChange} />

            <button onClick={addItem}>+ Add Item</button>

            {itemError && (
              <p className="error-text">{itemError}</p>
            )}

            <ul className="list">
              <h3>รายการที่เพิ่ม</h3>
              {formData.items.map((item, index) => (
                <li key={index} className="list-add">
                  <strong>{index + 1}.</strong>
                  <p>{item.productName} x จำนวน {item.quantity}</p>

                  <div className="list-button">
                    <button onClick={() => {
                      setCurrentItem(item);
                      setEditItemIndex(index);
                    }} className="btn-edit">
                      Edit
                    </button>

                    <button onClick={() => removeItem(index)} className="btn-delete">
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="modal-actions">
              <button onClick={handleSubmit}>
                {editingId ? "Update" : "Create"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

      {viewOrder && (
        <div className="modal">
          <div className="modal-content view-modal">

            <h3>Order Detail</h3>

            <p><strong>Order No:</strong> {viewOrder.orderNumber}</p>
            <p><strong>Customer:</strong> {viewOrder.customerName}</p>
            <p><strong>Phone:</strong> {viewOrder.phone}</p>
            <p><strong>Address:</strong> {viewOrder.address}</p>

            <hr />

            <h4>Products</h4>

            <ul className="detail-list">
              {viewOrder.items?.map((item, index) => (
                <li key={index}>
                  <div>
                    <strong>{item.productName}</strong>
                    <p>
                      {item.quantity} x ฿{item.unitPrice}
                    </p>
                  </div>
                  <span>
                    ฿{item.quantity * item.unitPrice}
                  </span>
                </li>
              ))}
            </ul>

            <div className="detail-total">
              Total: ฿ {viewOrder.totalAmount}
            </div>

            <button onClick={() => setViewOrder(null)}>
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}
