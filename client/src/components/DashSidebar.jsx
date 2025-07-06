import {
  ArrowRightIcon,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiChartPie, HiDocumentText, HiTable } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";

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
      className="md:min-h-screen w-full md:w-56"
    >
      <SidebarItems>
        <SidebarItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <SidebarItem
              as="div"
              icon={HiChartPie}
              label={currentUser.isAdmin ? "Admin" : "User"}
              active={tab === "profile"}
            >
              Profile
            </SidebarItem>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link to="/create-post">
                <SidebarItem as="div" icon={HiTable}>
                  Create Post
                </SidebarItem>
              </Link>

              <Link to="/dashboard?tab=posts">
                <SidebarItem
                  as="div"
                  icon={HiDocumentText}
                  active={tab === "posts"}
                >
                  Posts
                </SidebarItem>
              </Link>
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
