import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    namePosition: "",
    email: "",
    contact: "",
    companyChannel: "",
    videoCount: "",
    deliveryDate: "",
    runningTime: "",
    budget: "",
    productionPurpose: "",
    uploadPlatform: "",
    referenceVideos: "",
    websiteLinks: "",
    additionalInfo: "",
    agreeToTerms: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast.error("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    try {
      const payload = {
        name: formData.namePosition,
        email: formData.email,
        phone: formData.contact,
        company: formData.companyChannel,
        budget: formData.budget,
        preferredDate: formData.deliveryDate,
        service: formData.productionPurpose,
        subject: `${formData.videoCount} Videos • ${formData.runningTime} Runtime • Platform: ${formData.uploadPlatform}`,
        message: formData.additionalInfo || "No additional information provided",
        referenceVideos: formData.referenceVideos,
        websiteLinks: formData.websiteLinks,
        productionPurpose: formData.productionPurpose,
        uploadPlatform: formData.uploadPlatform,
        videoCount: formData.videoCount,
        runningTime: formData.runningTime,
        status: "new",
        submittedAt: new Date().toISOString(), // optional, in case you want to track manually
        source: "website", // optional: to help identify the origin
      };

      const loadingToast = toast.loading("제출 중입니다...");

      await api.post('/contact', payload);

      toast.dismiss(loadingToast);
      toast.success("문의가 성공적으로 제출되었습니다!");

      setFormData({
        namePosition: "",
        email: "",
        contact: "",
        companyChannel: "",
        videoCount: "",
        deliveryDate: "",
        runningTime: "",
        budget: "",
        productionPurpose: "",
        uploadPlatform: "",
        referenceVideos: "",
        websiteLinks: "",
        additionalInfo: "",
        agreeToTerms: false,
      });
    } catch (err: any) {
      toast.error("제출에 실패했습니다. 다시 시도해주세요.");
      console.error("Submission error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Title */}
      <h1 className="text-white text-4xl font-bold text-center mb-12 contact-title">
        Contact Us
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
          {/* Name / Position */}
          <div>
            <input
              type="text"
              name="namePosition"
              placeholder="성함 / 직책"
              value={formData.namePosition}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>

          {/* Running Time */}
          <div>
            <select
              name="runningTime"
              value={formData.runningTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-300 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="">러닝 타임 (분량)</option>
              <option value="30sec">30초</option>
              <option value="1min">1분</option>
              <option value="2-3min">2-3분</option>
              <option value="5min">5분</option>
              <option value="10min">10분</option>
              <option value="15min">15분</option>
              <option value="20min">20분</option>
              <option value="30min">30분</option>
              <option value="over30min">30분 이상</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
          {/* Email Address */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>

          {/* Budget */}
          <div>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-300 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="">희망 예산 (리프하게 선택해주세요.)</option>
              <option value="under-50">50만원 미만</option>
              <option value="50-100">50만원 - 100만원</option>
              <option value="100-200">100만원 - 200만원</option>
              <option value="200-300">200만원 - 300만원</option>
              <option value="300-500">300만원 - 500만원</option>
              <option value="500-1000">500만원 - 1000만원</option>
              <option value="over-1000">1000만원 이상</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
          {/* Contact Number */}
          <div>
            <input
              type="tel"
              name="contact"
              placeholder="연락처"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>

          {/* Production Purpose */}
          <div>
            <select
              name="productionPurpose"
              value={formData.productionPurpose}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-300 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="">제작 목적</option>
              <option value="corporate-promotion">기업 홍보</option>
              <option value="product-introduction">제품 소개</option>
              <option value="education-training">교육/연수</option>
              <option value="event-coverage">행사 영상</option>
              <option value="marketing">마케팅</option>
              <option value="brand-story">브랜드 스토리</option>
              <option value="recruitment">채용</option>
              <option value="other">기타</option>
            </select>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
          {/* Company Name / Channel Name */}
          <div>
            <input
              type="text"
              name="companyChannel"
              placeholder="회사명 / 채널명"
              value={formData.companyChannel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>

          {/* Upload Platform */}
          <div>
            <select
              name="uploadPlatform"
              value={formData.uploadPlatform}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-300 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="">영상을 어디에 업로드 할 예정인가요?</option>
              <option value="youtube">유튜브</option>
              <option value="website">홈페이지</option>
              <option value="instagram">인스타그램</option>
              <option value="facebook">페이스북</option>
              <option value="tiktok">틱톡</option>
              <option value="linkedin">링크드인</option>
              <option value="tv-broadcast">TV 방송</option>
              <option value="offline-event">오프라인 행사</option>
              <option value="multiple">여러 플랫폼</option>
            </select>
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
          {/* Number of Videos */}
          <div>
            <input
              type="text"
              name="videoCount"
              placeholder="영상 제작 편수"
              value={formData.videoCount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>

          {/* Reference Videos */}
          <div>
            <input
              type="text"
              name="referenceVideos"
              placeholder="참고 영상 전달 (유튜브 링크, 전 작업물 등)"
              value={formData.referenceVideos}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
          {/* Delivery Date */}
          <div>
            <input
              type="text"
              name="deliveryDate"
              placeholder="희망 영상 납품 일시"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>

          {/* Website/SNS Links */}
          <div>
            <input
              type="text"
              name="websiteLinks"
              placeholder="현재 보유한 홈페이지, SNS, 랜딩페이지 링크를 가능한 모두 적어주세요."
              value={formData.websiteLinks}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-300 ease-out"
            />
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="space-y-4 contact-form-row">
          <div className="bg-gray-950 border border-gray-600 p-4 text-xs text-gray-300 leading-relaxed max-h-40 overflow-y-auto hover:border-blue-400/30 transition-colors duration-300 ease-out">
            <h3 className="text-white text-sm font-medium mb-3">
              개인정보 수집 및 이용 동의
            </h3>
            <p className="mb-2">
              비디오크루(이하 '회사')는 영상 제작 문의에 대한 원활한 응대 및
              견적 제공을 위해 다음과 같은 개인정보를 수집·이용하고자 합니다.
              아래 내용을 충분히 확인하신 후 동의 여부를 결정해 주시기 바랍니다.
            </p>
            <div className="mb-2">
              <p className="font-medium mb-1">1. 수집 항목</p>
              <p className="mb-1">
                * 필수 항목: 성함, 직책, 이메일 주소, 연락처, 회사명 또는
                채널명, 예산, 희망 영상 편수 및 러닝타임, 납품일시, 제작 목적
              </p>
              <p>
                * 선택 항목: 참고 자료 링크(유튜브, 기존 작업물), 홈페이지 및
                SNS 주소 등
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 bg-transparent border border-gray-600 rounded focus:outline-none hover:border-blue-400 transition-colors duration-300 ease-out cursor-pointer"
            />
            <label className="text-gray-400 text-sm">
              개인정보 수집 및 이용에 동의합니다
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-12 py-3 bg-blue-600 hover:bg-blue-700 hover:scale-105 cursor-pointer hover:shadow-lg text-white font-medium rounded-full transition-all duration-300 ease-out contact-submit-btn"
          >
            제출하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
