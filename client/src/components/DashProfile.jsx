import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(currentUser.profilePicture);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setUploadError("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("File size must be less than 2MB");
        return;
      }
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "xTensiver");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dap9mz46e/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      setImageFileURL(data.secure_url);
      setUploadSuccess("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      setImageFileURL(currentUser.profilePicture);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-md mt-4 mx-auto p-6 rounded-lg overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account information</p>
      </div>

      {/* Display upload status messages */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {uploadError}
        </div>
      )}
      {uploadSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          {uploadSuccess}
        </div>
      )}

      <form className="space-y-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4 group">
            <img
              className={`rounded-full w-full h-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-105 ${
                isUploading ? "opacity-70" : ""
              }`}
              src={imageFileURL}
              alt="Profile"
            />
            <div
              onClick={() => !isUploading && filePickerRef.current.click()}
              className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300 ${
                isUploading
                  ? "bg-black/30 opacity-100 cursor-not-allowed"
                  : "bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 cursor-pointer"
              }`}
            >
              {isUploading ? (
                <span className="text-white relative text-sm font-medium">
                  Uploading...
                  {isUploading && (
                    <div className="absolute bottom-0 top-4 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </span>
              ) : (
                <span className="text-white text-sm font-medium">Change</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              defaultValue={currentUser.username}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              defaultValue={currentUser.email}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 text-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? "Processing..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashProfile;
