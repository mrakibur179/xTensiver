import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

const Dashboard = () => {
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
    <div className="min-h-screen dark:bg-teal-950 pt-15 text-black transition-all ease-in-out duration-300 dark:text-white">
      <div className="w-full flex flex-col md:flex-row">
        <div className="md:w-56">
          <DashSidebar />
        </div>
        <div className="w-full">{tab === "profile" && <DashProfile />}</div>
      </div>
    </div>
  );
};
export default Dashboard;
