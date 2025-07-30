import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import { DashPost } from "../components/DashPost";
import { DashUsers } from "../components/DashUsers";
import { DashComments } from "../components/DashComments";
import { DashboardMain } from "../components/DashboardMain";

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
    <div className="min-h-screen bg-slate-200 dark:bg-slate-800 pt-15 text-black transition-all ease-in-out duration-300 dark:text-white">
      <div className="w-full flex flex-col md:flex-row">
        <div className="md:w-64">
          <DashSidebar />
        </div>
        <div className="w-full overflow-x-hidden pr-4 lg:pr-0">
          {tab === "profile" && <DashProfile />}
          {tab === "posts" && <DashPost />}
          {tab === "users" && <DashUsers />}
          {tab === "comments" && <DashComments />}
          {tab === "main" && <DashboardMain />}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
