import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useContactErrorHandler } from "../../hooks/useContactErrorHandler";
import { useFormPersistence } from "../../hooks/useFormPersistence";

const ContactForm = () => {
  // Initial form data
  const initialFormData = {
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
  };

  // Form persistence and error handling
  const { formData, updateFormData, clearFormData } = useFormPersistence(
    "contact-form",
    initialFormData
  );
  const { errorState, handleError, clearError, retry, canRetry } =
    useContactErrorHandler({
      maxRetries: 2,
      retryDelay: 1000,
      onRetry: () => {
        console.log("Retrying contact form submission...");
      },
    });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed title animation to prevent re-triggering during form interaction

  // Validation functions
  const validateName = (name: string): boolean => {
    if (!name.trim()) return false;
    // Must contain at least one letter, can have numbers, no special characters
    const nameRegex = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣0-9\s]+$/;
    return nameRegex.test(name.trim());
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateContact = (contact: string): boolean => {
    if (!contact.trim()) return false;
    // Allows +, numbers, spaces, hyphens, parentheses
    const contactRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return contactRegex.test(contact.trim());
  };

  const validateVideoCount = (count: string): boolean => {
    if (!count.trim()) return true; // Optional field
    return /^\d+$/.test(count.trim());
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.namePosition.trim()) {
      newErrors.namePosition = "성함/직책을 입력해주세요.";
    } else if (!validateName(formData.namePosition)) {
      newErrors.namePosition =
        "성함/직책은 한글, 영문, 숫자를 포함할 수 있지만 특수문자는 사용할 수 없습니다.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "이메일 주소를 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // Contact validation
    if (!formData.contact.trim()) {
      newErrors.contact = "연락처를 입력해주세요.";
    } else if (!validateContact(formData.contact)) {
      newErrors.contact =
        "연락처는 숫자와 +, -, 공백, 괄호만 사용할 수 있습니다.";
    }

    // Video count validation
    if (
      formData.videoCount.trim() &&
      !validateVideoCount(formData.videoCount)
    ) {
      newErrors.videoCount = "영상 제작 편수는 숫자만 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    updateFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear submission error when user makes changes
    if (errorState.hasError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("입력 정보를 확인해주세요.");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);
    clearError();

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
        message:
          formData.additionalInfo || "No additional information provided",
        referenceVideos: formData.referenceVideos,
        websiteLinks: formData.websiteLinks,
        productionPurpose: formData.productionPurpose,
        uploadPlatform: formData.uploadPlatform,
        videoCount: formData.videoCount,
        runningTime: formData.runningTime,
        status: "new",
        submittedAt: new Date().toISOString(),
        source: "website",
      };

      const loadingToast = toast.loading("제출 중입니다...");

      await api.post("/contact", payload);

      toast.dismiss(loadingToast);
      toast.success("문의가 성공적으로 제출되었습니다!");

      // Clear form data and localStorage on successful submission
      clearFormData();
      setErrors({});
    } catch (err: any) {
      toast.dismiss();
      handleError(err);
      console.error("Submission error:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry function for failed submissions
  const handleRetry = async () => {
    await retry(async () => {
      const payload = {
        name: formData.namePosition,
        email: formData.email,
        phone: formData.contact,
        company: formData.companyChannel,
        budget: formData.budget,
        preferredDate: formData.deliveryDate,
        service: formData.productionPurpose,
        subject: `${formData.videoCount} Videos • ${formData.runningTime} Runtime • Platform: ${formData.uploadPlatform}`,
        message:
          formData.additionalInfo || "No additional information provided",
        referenceVideos: formData.referenceVideos,
        websiteLinks: formData.websiteLinks,
        productionPurpose: formData.productionPurpose,
        uploadPlatform: formData.uploadPlatform,
        videoCount: formData.videoCount,
        runningTime: formData.runningTime,
        status: "new",
        submittedAt: new Date().toISOString(),
        source: "website",
      };

      await api.post("/contact", payload);
      toast.success("문의가 성공적으로 제출되었습니다!");
      clearFormData();
      setErrors({});
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Title */}
      <h1 className="text-white text-4xl font-bold text-center mb-12">
        Contact Us
      </h1>

      {/* Error Display */}
      {errorState.hasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{errorState.error}</p>
              </div>
            </div>
            {canRetry && (
              <button
                type="button"
                onClick={handleRetry}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
              >
                다시 시도
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name / Position */}
          <div>
            <label
              htmlFor="namePosition"
              className="block text-white text-sm font-medium mb-2"
            >
              성함/직책
            </label>
            <input
              type="text"
              id="namePosition"
              name="namePosition"
              placeholder=" 김영수 대표, John Smith CEO, 홍길동 123"
              value={formData.namePosition}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-400 focus:outline-none transition-colors duration-150 ease-out ${
                errors.namePosition
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-600 focus:border-gray-400 hover:border-blue-400/50"
              }`}
            />
            {errors.namePosition && (
              <p className="text-red-400 text-sm mt-1">{errors.namePosition}</p>
            )}
          </div>

          {/* Running Time */}
          <div>
            <label
              htmlFor="runningTime"
              className="block text-white text-sm font-medium mb-2"
            >
              러닝타임(분량)
            </label>
            <select
              id="runningTime"
              name="runningTime"
              value={formData.runningTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-150 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option
                value=""
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                선택
              </option>
              <option
                value="30sec"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                30초
              </option>
              <option
                value="1min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                1분
              </option>
              <option
                value="2-3min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                2-3분
              </option>
              <option
                value="5min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                5분
              </option>
              <option
                value="10min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                10분
              </option>
              <option
                value="15min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                15분
              </option>
              <option
                value="20min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                20분
              </option>
              <option
                value="30min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                30분
              </option>
              <option
                value="over30min"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                30분 이상
              </option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-white text-sm font-medium mb-2"
            >
              이메일 주소
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@company.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-400 focus:outline-none transition-colors duration-150 ease-out ${
                errors.email
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-600 focus:border-gray-400 hover:border-blue-400/50"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="budget"
              className="block text-white text-sm font-medium mb-2"
            >
              희망 예산
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-150 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option
                value=""
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                선택
              </option>
              <option
                value="under-50"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                50만원 미만
              </option>
              <option
                value="50-100"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                50만원 - 100만원
              </option>
              <option
                value="100-200"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                100만원 - 200만원
              </option>
              <option
                value="200-300"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                200만원 - 300만원
              </option>
              <option
                value="300-500"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                300만원 - 500만원
              </option>
              <option
                value="500-1000"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                500만원 - 1000만원
              </option>
              <option
                value="over-1000"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                1000만원 이상
              </option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Number */}
          <div>
            <label
              htmlFor="contact"
              className="block text-white text-sm font-medium mb-2"
            >
              연락처
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder=" +82 10-1234-5678, 010-1234-5678"
              value={formData.contact}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-400 focus:outline-none transition-colors duration-150 ease-out ${
                errors.contact
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-600 focus:border-gray-400 hover:border-blue-400/50"
              }`}
            />
            {errors.contact && (
              <p className="text-red-400 text-sm mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Production Purpose */}
          <div>
            <label
              htmlFor="productionPurpose"
              className="block text-white text-sm font-medium mb-2"
            >
              제작 목적
            </label>
            <select
              id="productionPurpose"
              name="productionPurpose"
              value={formData.productionPurpose}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-150 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option
                value=""
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                선택
              </option>
              <option
                value="corporate-promotion"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                기업 홍보
              </option>
              <option
                value="product-introduction"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                제품 소개
              </option>
              <option
                value="education-training"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                교육/연수
              </option>
              <option
                value="event-coverage"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                행사 영상
              </option>
              <option
                value="marketing"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                마케팅
              </option>
              <option
                value="brand-story"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                브랜드 스토리
              </option>
              <option
                value="recruitment"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                채용
              </option>
              <option
                value="other"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                기타
              </option>
            </select>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name / Channel Name */}
          <div>
            <label
              htmlFor="companyChannel"
              className="block text-white text-sm font-medium mb-2"
            >
              회사명/채널명
            </label>
            <input
              type="text"
              id="companyChannel"
              name="companyChannel"
              placeholder="회사명 / 채널명"
              value={formData.companyChannel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-150 ease-out"
            />
          </div>

          {/* Upload Platform */}
          <div>
            <label
              htmlFor="uploadPlatform"
              className="block text-white text-sm font-medium mb-2"
            >
              업로드 채널
            </label>
            <select
              id="uploadPlatform"
              name="uploadPlatform"
              value={formData.uploadPlatform}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white focus:outline-none focus:border-gray-400 appearance-none hover:border-blue-400/50 transition-colors duration-150 ease-out"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option
                value=""
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                선택
              </option>
              <option
                value="youtube"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                유튜브
              </option>
              <option
                value="website"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                홈페이지
              </option>
              <option
                value="instagram"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                인스타그램
              </option>
              <option
                value="facebook"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                페이스북
              </option>
              <option
                value="tiktok"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                틱톡
              </option>
              <option
                value="linkedin"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                링크드인
              </option>
              <option
                value="tv-broadcast"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                TV 방송
              </option>
              <option
                value="offline-event"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                오프라인 행사
              </option>
              <option
                value="multiple"
                className="bg-gray-900 text-white hover:bg-gray-700"
              >
                여러 플랫폼
              </option>
            </select>
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Number of Videos */}
          <div>
            <label
              htmlFor="videoCount"
              className="block text-white text-sm font-medium mb-2"
            >
              영상 제작 편수
            </label>
            <input
              type="text"
              id="videoCount"
              name="videoCount"
              placeholder=" 5 (숫자만 입력)"
              value={formData.videoCount}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-400 focus:outline-none transition-colors duration-150 ease-out ${
                errors.videoCount
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-600 focus:border-gray-400 hover:border-blue-400/50"
              }`}
            />
            {errors.videoCount && (
              <p className="text-red-400 text-sm mt-1">{errors.videoCount}</p>
            )}
          </div>

          {/* Reference Videos */}
          <div>
            <label
              htmlFor="referenceVideos"
              className="block text-white text-sm font-medium mb-2"
            >
              참고 영상 링크
            </label>
            <input
              type="text"
              id="referenceVideos"
              name="referenceVideos"
              placeholder="참고 영상 전달 (유튜브 링크, 전 작업물 등)"
              value={formData.referenceVideos}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-150 ease-out"
            />
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Date */}
          <div>
            <label
              htmlFor="deliveryDate"
              className="block text-white text-sm font-medium mb-2"
            >
              희망 영상 납품 일시
            </label>
            <input
              type="text"
              id="deliveryDate"
              name="deliveryDate"
              placeholder=" 2024년 3월 15일, 3월 말, ASAP"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-150 ease-out"
            />
          </div>

          {/* Website/SNS Links */}
          <div>
            <label
              htmlFor="websiteLinks"
              className="block text-white text-sm font-medium mb-2"
            >
              현재 보유한 홈페이지, SNS
            </label>
            <input
              type="text"
              id="websiteLinks"
              name="websiteLinks"
              placeholder="홈페이지, 인스타그램, 유튜브 등 링크를 입력해주세요"
              value={formData.websiteLinks}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-150 ease-out"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label
            htmlFor="additionalInfo"
            className="block text-white text-sm font-medium mb-2"
          >
            추가 정보
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={4}
            placeholder="프로젝트에 대한 추가 정보나 특별한 요청사항이 있으시면 자유롭게 작성해주세요."
            value={formData.additionalInfo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 hover:border-blue-400/50 transition-colors duration-150 ease-out resize-none"
          />
        </div>

        {/* Privacy Policy */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-gray-600 p-4 text-xs text-gray-300 leading-relaxed max-h-40 overflow-y-auto hover:border-blue-400/30 transition-colors duration-150 ease-out">
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
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 bg-transparent border border-gray-600 rounded focus:outline-none hover:border-blue-400 transition-colors duration-150 ease-out cursor-pointer"
            />
            <label
              htmlFor="agreeToTerms"
              className="text-gray-400 text-sm cursor-pointer"
            >
              개인정보 수집 및 이용에 동의합니다
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-12 py-3 font-medium rounded-full transition-all duration-150 ease-out ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105 cursor-pointer hover:shadow-lg"
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                제출 중...
              </div>
            ) : (
              "제출하기"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
