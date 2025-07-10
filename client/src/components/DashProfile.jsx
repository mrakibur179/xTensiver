import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutSuccess,
} from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const navigate = useNavigate();

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(currentUser.profilePicture);
  const [isUploading, setIsUploading] = useState(false);
  const [lastUploadedFileSize, setLastUploadedFileSize] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const handleDeleteUser = async () => {
    setOpenModal(false);

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (currentUser.isSuperAdmin) {
        toast.error(data.message);
        return;
      }
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        toast.success("Account Deleted Successfully!");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    setOpenModal(false);

    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        toast.success("Signed out successfully!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Load size of current profile picture
  useEffect(() => {
    const fetchImageSize = async () => {
      try {
        const response = await fetch(currentUser.profilePicture, {
          method: "HEAD",
        });
        const contentLength = response.headers.get("Content-Length");
        if (contentLength) {
          setLastUploadedFileSize(parseInt(contentLength));
        }
      } catch (error) {
        console.error("Failed to fetch image size:", error);
      }
    };

    fetchImageSize();
  }, [currentUser.profilePicture]);

  const isUsernameChanged = username.trim() !== currentUser.username;
  const isEmailChanged = email.trim() !== currentUser.email;
  const isPasswordProvided = password.trim() !== "";
  const isProfilePictureChanged = imageFileURL !== currentUser.profilePicture;

  const isChanged =
    isUsernameChanged ||
    isEmailChanged ||
    isPasswordProvided ||
    isProfilePictureChanged;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select a valid image file.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB.");
        return;
      }

      // Prevent same file based on size
      if (file.size === lastUploadedFileSize) {
        toast.info("You have selected the same profile picture.");
        return;
      }

      setImageFile(file);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const uploadImage = async () => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "xTensiver");

      // const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed.");
      }

      setImageFileURL(data.secure_url);
      setLastUploadedFileSize(imageFile.size);
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message);
      setImageFileURL(currentUser.profilePicture);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isChanged) {
      toast.error("No changes made to update profile.");
      return;
    }

    dispatch(updateStart());

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim() || undefined,
          profilePicture: imageFileURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed.");
      }

      dispatch(updateSuccess(data));
      toast.success("Profile updated successfully!");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error("Update error:", error);
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md mt-4 mx-auto p-6 rounded-lg overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account information</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
              className={`rounded-full w-full h-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105 ${
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
                  : "bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer"
              }`}
            >
              <span className="text-white select-none text-sm font-medium">
                {isUploading ? "Uploading..." : "Change"}
              </span>
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
              placeholder={currentUser.username}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder={currentUser.email}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="off"
              className="w-full px-4 py-2.5 text-gray-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? "Processing..." : "Click To Update Profile"}
          </button>
        </div>
      </form>

      <span className="flex justify-between pt-4">
        <button
          // disabled={currentUser.isSuperAdmin}
          className="bg-orange-400 cursor-pointer p-2 px-4 rounded-md"
          onClick={() => setOpenModal(true)}
        >
          Delete Account
        </button>
        <button
          className="bg-red-400 p-2 cursor-pointer px-4 rounded-md"
          onClick={handleSignOut}
        >
          Logout
        </button>
      </span>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={handleDeleteUser}
                className="cursor-pointer"
              >
                Yes, I'm sure
              </Button>
              <Button
                className="cursor-pointer"
                color="alternative"
                onClick={() => setOpenModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DashProfile;
