import {
  ArrowRightIcon,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiChartPie, HiTable } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

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
              href="#"
              icon={HiChartPie}
              active={tab === "profile"}
            >
              Profile
            </SidebarItem>
          </Link>

          <SidebarItem href="#" icon={ArrowRightIcon}>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};
export default DashSidebar;
