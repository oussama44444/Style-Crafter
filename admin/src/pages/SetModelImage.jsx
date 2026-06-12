import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { 
  FiUpload, FiTrash2, FiEdit2, FiX, FiSave, 
  FiImage, FiLink, FiGrid, FiRefreshCw 
} from 'react-icons/fi';

// ✅ FIX: Use environment variable instead of hardcoded localhost
const API_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/product`
  : "http://localhost:6009/api/product";

const SetModelImage = () => {
  const [products, setProducts] = useState([]);
  const [modelImages, setModelImages] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [editProductId, setEditProductId] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Debug: Log the API URL
  console.log("API_URL:", API_URL);

  useEffect(() => {
    fetchProducts();
    fetchModelImages();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/list`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchModelImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/model-images`);
      const data = await res.json();
      if (data.success) setModelImages(data.images);
    } catch (error) {
      console.error("Error fetching model images:", error);
      toast.error("Failed to load model images");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !selectedImage) {
      toast.warning("Please select a product and an image");
      return;
    }
    
    setUploading(true);
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
        toast.success("Model image uploaded successfully!");
        setSelectedProductId("");
        setSelectedImage(null);
        setSelectedImagePreview(null);
        fetchModelImages();
      } else {
        toast.error(data.message || "Failed to upload.");
      }
    } catch {
      toast.error("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this model image?")) return;
    try {
      await fetch(`${API_URL}/model-image/${id}`, {
        method: "DELETE",
        headers: { "token": localStorage.getItem("token") },
      });
      toast.success("Image deleted successfully");
      fetchModelImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleEdit = (img) => {
    setEditId(img._id);
    setEditProductId(img.productId);
    setEditImage(null);
    setEditImagePreview(null);
    setStatus("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editId || !editProductId) {
      toast.warning("Please select a product");
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
        toast.success("Model image updated!");
        setEditId(null);
        fetchModelImages();
      } else {
        toast.error(data.message || "Failed to update.");
      }
    } catch {
      toast.error("Error updating image.");
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : productId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Model Images Carousel
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage model images for your product carousel</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <FiUpload size={18} /> Upload New Model Image
          </h2>
          
          <form onSubmit={handleUpload} className="space-y-4 sm:space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <FiLink size={14} /> Select Product
              </label>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Choose a product to link</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <FiImage size={14} /> Model Image
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-gray-400 transition-colors">
                    {selectedImagePreview ? (
                      <img
                        src={selectedImagePreview}
                        alt="Preview"
                        className="max-h-32 sm:max-h-40 mx-auto rounded"
                      />
                    ) : (
                      <div className="py-4 sm:py-6 md:py-8">
                        <FiImage className="mx-auto text-gray-400 text-3xl sm:text-4xl mb-2" />
                        <p className="text-gray-500 text-sm sm:text-base">Click to select image</p>
                        <p className="text-gray-400 text-xs sm:text-sm">JPG, PNG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload size={16} /> Upload Model Image
                </>
              )}
            </button>
          </form>
        </div>

        {/* Model Images Gallery */}
        <div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiGrid size={18} /> Current Model Images
              <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                {modelImages.length}
              </span>
            </h2>
            <button
              onClick={fetchModelImages}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Refresh"
            >
              <FiRefreshCw size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-gray-800"></div>
            </div>
          ) : modelImages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 md:p-12 text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🖼️</div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">No Model Images</h3>
              <p className="text-xs sm:text-sm text-gray-500">Upload your first model image to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {modelImages.map(img => (
                <div
                  key={img._id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={img.url}
                      alt="model"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex gap-1">
                      <button
                        onClick={() => handleEdit(img)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <FiEdit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(img._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <FiTrash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <div className="mb-1 sm:mb-2">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Linked Product:</p>
                      <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                        {getProductName(img.productId)}
                      </p>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editId === img._id && (
                    <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                      <form onSubmit={handleEditSubmit} className="space-y-2 sm:space-y-3">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                            Change Product
                          </label>
                          <select
                            value={editProductId}
                            onChange={e => setEditProductId(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-xs sm:text-sm"
                          >
                            <option value="">Select a product</option>
                            {products.map(p => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                            Change Image (optional)
                          </label>
                          <label className="cursor-pointer block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-gray-400 transition-colors">
                              {editImagePreview ? (
                                <img
                                  src={editImagePreview}
                                  alt="Preview"
                                  className="max-h-24 sm:max-h-32 mx-auto rounded"
                                />
                              ) : (
                                <div className="py-2 sm:py-3">
                                  <FiImage className="mx-auto text-gray-400 text-xl sm:text-2xl" />
                                  <p className="text-[10px] sm:text-xs text-gray-500">Click to change</p>
                                </div>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageSelect}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 text-[11px] sm:text-sm"
                          >
                            <FiSave size={12} /> Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditId(null)}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 text-[11px] sm:text-sm"
                          >
                            <FiX size={12} /> Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetModelImage;