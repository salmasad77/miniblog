import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../api/axios";
import Loader from "../components/Loader";
import { Image, X } from "lucide-react";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General"
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    if (image) {
      data.append("image", image);
    }

    try {
      await postAPI.create(data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6 fade-in">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl animate-fadeIn">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-8 animate-slideInUp">
          ✍️ Create Your Post
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm animate-fadeIn">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Image Upload Area */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            {!preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Image size={48} className="mb-2" />
                  <p className="text-sm font-medium">Click to upload an image</p>
                  <p className="text-xs mt-1">PNG, JPG, WEBP, GIF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden shadow-md max-h-64 bg-gray-100">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <input 
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post Title"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-sm placeholder-gray-400"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-sm"
          >
            {["General","Technology","Lifestyle","Design","Travel","Health","Business","Culture"].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <textarea 
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-sm min-h-[220px] resize-none placeholder-gray-400"
          />

          <div className="flex space-x-4">
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg flex justify-center items-center"
            >
              {loading ? <Loader size="small" text="" /> : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
