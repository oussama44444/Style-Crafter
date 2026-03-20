import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:6009/api/product";

const SetModelImage = () => {
  const [products, setProducts] = useState([]);
  const [modelImages, setModelImages] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [editProductId, setEditProductId] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/list`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      });
    fetchModelImages();
  }, []);

  const fetchModelImages = async () => {
    const res = await fetch(`${API_URL}/model-images`);
    const data = await res.json();
    if (data.success) setModelImages(data.images);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !selectedImage) {
      setUploadStatus("Select a product and image.");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("productId", selectedProductId);
    try {
      const res = await fetch(`${API_URL}/model-image`, {
        method: "POST",
        headers: { "token": localStorage.getItem("token") },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadStatus("Model image uploaded!");
        setSelectedProductId("");
        setSelectedImage(null);
        fetchModelImages();
      } else {
        setUploadStatus(data.message || "Failed to upload.");
      }
    } catch {
      setUploadStatus("Error uploading.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this model image?")) return;
    await fetch(`${API_URL}/model-image/${id}`, {
      method: "DELETE",
      headers: { "token": localStorage.getItem("token") },
    });
    fetchModelImages();
  };

  const handleEdit = (img) => {
    setEditId(img._id);
    setEditProductId(img.productId);
    setEditImage(null);
    setStatus("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editId || !editProductId) {
      setStatus("Select a product.");
      return;
    }
    const formData = new FormData();
    if (editImage) formData.append("image", editImage);
    formData.append("productId", editProductId);
    try {
      const res = await fetch(`${API_URL}/model-image/${editId}`, {
        method: "PUT",
        headers: { "token": localStorage.getItem("token") },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Updated!");
        setEditId(null);
        fetchModelImages();
      } else {
        setStatus(data.message || "Failed to update.");
      }
    } catch {
      setStatus("Error updating.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Model Images Carousel</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-8">
        <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="p-2 border rounded">
          <option value="">Select a product to link</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={e => setSelectedImage(e.target.files[0])} />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded font-bold shadow">Upload</button>
        {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
      </form>
      <hr className="my-6" />
      <h2 className="text-lg font-bold mb-4">Current Model Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modelImages.map(img => (
          <div key={img._id} className="border rounded p-3 flex flex-col items-center">
            <img src={img.url} alt="model" className="w-full h-40 object-cover mb-2 rounded" />
            <div className="mb-2 text-sm">Linked Product: {products.find(p => p._id === img.productId)?.name || img.productId}</div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(img)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button type="button" onClick={() => handleDelete(img._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-bold shadow ml-2">Delete</button>
            </div>
            {editId === img._id && (
              <form onSubmit={handleEditSubmit} className="mt-3 flex flex-col gap-2 w-full">
                <select value={editProductId} onChange={e => setEditProductId(e.target.value)} className="p-2 border rounded">
                  <option value="">Select a product to link</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <input type="file" accept="image/*" onChange={e => setEditImage(e.target.files[0])} />
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded font-bold shadow">Save</button>
                <button type="button" onClick={() => setEditId(null)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-bold shadow ml-2">Cancel</button>
                {status && <p className="text-xs mt-1">{status}</p>}
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetModelImage;
