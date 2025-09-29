import { useState, useEffect } from "react";
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
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");
  const [checkingBlock, setCheckingBlock] = useState(false);

  // Check block status on component mount
  useEffect(() => {
    checkBlockStatus();
  }, []);

  const checkBlockStatus = async () => {
    setCheckingBlock(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/rate-limit-status`);
      const data = await response.json();
      
      if (data.attempts === 0) {
        // No attempts recorded, user is not blocked
        setIsBlocked(false);
        setBlockMessage("");
        
      } else {
        // Has attempts, check if blocked
        const remaining = data.remaining;
        const isBlocked = data.isBlocked;
        
        if (remaining > 0) {
          // Not blocked yet, but has some attempts
          setIsBlocked(false);
          setBlockMessage("");
          toast.success(`로그인을 다시 시도할 수 있습니다. (${remaining}회 남음)`);
        } else if (remaining === 0 && isBlocked) {
          // Still blocked
          setIsBlocked(true);
          setBlockMessage("로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.");
          toast.error("차단 상태입니다. 잠시 후 다시 시도해주세요.");
        } else {
          // This shouldn't happen, but handle it
          setIsBlocked(false);
          setBlockMessage("");
          toast.success("로그인을 다시 시도할 수 있습니다.");
        }
      }
    } catch (error) {
      console.error("Failed to check block status:", error);
      toast.error("차단 상태 확인에 실패했습니다.");
    } finally {
      setCheckingBlock(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow submission if blocked
    if (isBlocked) {
      toast.error("로그인이 일시적으로 차단되었습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // Don't allow submission if already loading
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      const token = res.data.token;

      //localStorage.setItem("token", token);
      localStorage.setItem("admin_token", token);
      
      authLogin(token);
      
      toast.success("Logged in successfully!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 429) {
        // Rate limited - show block message and disable form
        setIsBlocked(true);
        setBlockMessage(message || "로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.");
        toast.error("로그인이 일시적으로 차단되었습니다.");
      } else if (status === 401) {
        // Invalid credentials - generic message
        toast.error("잘못된 로그인 정보입니다.");
      } else {
        // Other errors - generic message
        toast.error("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetBlockState = () => {
    setIsBlocked(false);
    setBlockMessage("");
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

        {/* Block Message */}
        {isBlocked && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">
              {blockMessage}
            </p>
            <div className="mt-3 space-y-2">
              <button
                onClick={checkBlockStatus}
                disabled={checkingBlock}
                className="w-full text-xs text-red-300 hover:text-red-200 underline disabled:opacity-50"
              >
                {checkingBlock ? "확인 중..." : "차단 상태 확인"}
              </button>
              <button
                onClick={resetBlockState}
                className="w-full text-xs text-gray-400 hover:text-gray-300 underline"
              >
                수동으로 재설정
              </button>
            </div>
          </div>
        )}

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
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading || isBlocked}
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
                className="w-full px-4 py-3 pr-10 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading || isBlocked}
                placeholder="password"
              />
              <span
                className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => !isBlocked && setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isBlocked}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : isBlocked
                ? "bg-red-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            }`}
          >
            {loading 
              ? "로그인 중..." 
              : isBlocked 
                ? "로그인 차단됨" 
                : "로그인"
            }
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
