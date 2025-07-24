import {
  ArrowRightIcon,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiChat,
  HiDocumentText,
  HiTable,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { FaDashcube } from "react-icons/fa";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = async () => {
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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");

    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location]);

  return (
    <Sidebar
      aria-label="Default sidebar example"
      className="md:min-h-screen w-full md:w-64"
    >
      <SidebarItems>
        <SidebarItemGroup className="flex flex-col gap-1">
          {currentUser.isSuperAdmin && (
            <Link to={"/dashboard?tab=main"}>
              <SidebarItem as="div" icon={FaDashcube} active={tab === "main"}>
                Dashboard
              </SidebarItem>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <SidebarItem
              as="div"
              icon={HiChartPie}
              label={
                currentUser.isSuperAdmin
                  ? "Super Admin"
                  : currentUser.isAdmin
                  ? "Admin"
                  : "User"
              }
              active={tab === "profile"}
            >
              Profile
            </SidebarItem>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link to="/create-post">
                <SidebarItem as="div" icon={HiDocumentText}>
                  Create Post
                </SidebarItem>
              </Link>

              <Link to="/dashboard?tab=posts">
                <SidebarItem as="div" icon={HiTable} active={tab === "posts"}>
                  Posts
                </SidebarItem>
              </Link>

              {currentUser.isSuperAdmin && (
                <Link to="/dashboard?tab=comments">
                  <SidebarItem
                    as="div"
                    icon={HiChat}
                    active={tab === "comments"}
                  >
                    Comments
                  </SidebarItem>
                </Link>
              )}

              {currentUser.isSuperAdmin && (
                <Link to="/dashboard?tab=users">
                  <SidebarItem
                    as="div"
                    icon={HiUserGroup}
                    active={tab === "users"}
                  >
                    Users
                  </SidebarItem>
                </Link>
              )}
            </>
          )}

          <SidebarItem
            icon={ArrowRightIcon}
            onClick={handleSignOut}
            className="cursor-pointer"
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};
export default DashSidebar;
