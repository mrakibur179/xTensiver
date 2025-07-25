import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Header from "./components/Header";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatePost from "./pages/CreatePost";
import { OnlyAdminPrivateRoute } from "./components/OnlyAdminPrivateRoute";
import UpdatePost from "./pages/UpdatePost";
import { PostPage } from "./pages/PostPage";
import { Search } from "./pages/Search";
import MyComponent from "./components/MyComponent";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        className="mt-16"
        autoClose={2000}
      />
      <ScrollToTop />
      <Header />
      <MyComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>

        {/* Public routes */}
        <Route path="/posts" element={<Posts />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/search" element={<Search />} />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
