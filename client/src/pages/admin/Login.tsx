import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      const token = res.data.token;

      localStorage.setItem("token", token);
      authLogin(token);
      toast.success("Logged in successfully!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <div className="z-10 bg-[#111] rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-800">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <img
            src="/imgs/Frame 362.png"
            alt="Video Crew Logo"
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-400 text-sm">비디오크루 관리자 로그인</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
              placeholder="email@example.com"
            />
          </div>

          {/* Password with Toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 pr-10 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="password"
              />
              <span
                className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            }`}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Back to
            <a
              href="/"
              className="text-blue-500 hover:text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
