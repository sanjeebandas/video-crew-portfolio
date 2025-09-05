import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundClean = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm mx-auto">
        {/* 404 Visual */}
        <div className="mb-6">
          {/* VideoCrew Logo */}
          <div className="mb-10">
            <img
              onClick={handleGoBack}
              src="/imgs/VideoCrewLogo_New.svg"
              alt="VideoCrew Logo"
              className="mx-auto transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
          </div>
          <div className="text-6xl font-bold text-gray-800 mb-2">404</div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-xl font-semibold mb-3 text-white">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          요청하신 페이지가 존재하지 않습니다.
        </p>

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto text-sm"
        >
          <ArrowLeft size={16} />
          <span>Go back to the Home page</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundClean;
