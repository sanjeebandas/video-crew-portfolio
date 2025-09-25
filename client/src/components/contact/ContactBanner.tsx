type Props = {
  title?: string;
  description?: string;
  address?: string;
  phone?: string;
};

const ContactBanner = ({
  title = "문의하기",
  description = "비디오크루 서비스에 대해 궁금한 점이 있으시거나 \n 프로젝트에 대한 상의가 필요하신 경우 간략한 정보와 함께 \n 문의를 남겨 주시면 상세히 회신 드리겠습니다.",
  address = "서울특별시 성동구 연무장5가길 7 (성수동2가, 성수역 현대테라스타워) 1001호-1003호",
  phone = "02-6914-9353",
}: Props) => {
  return (
    <section className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:w-[1248px] lg:h-[570px] lg:mx-auto border border-white/20">
        {/* Left side - Image */}
        <div className="lg:col-span-3 relative overflow-hidden">
          <img
            src="imgs/contact/Group 90.webp"
            alt="Contact Us"
            className="w-full h-[110%] object-cover contact-image"
          />
        </div>

        {/* Right side - Text */}
        <div className="lg:col-span-2 bg-black text-white p-8 lg:p-12 flex flex-col">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 contact-title">
            {title}
          </h1>
          <div className="contact-text-line text-muted text-sm leading-relaxed mb-12">
            {description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < description.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>

          <div className="space-y-8 contact-info-section">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">정보</h2>

            {/* Address */}
            <div className="contact-info-item">
              <p className="text-xs text-muted uppercase tracking-wider mb-2">
                ADDRESS
              </p>
              <p className="text-white text-sm">{address}</p>
            </div>

            {/* Phone */}
            <div className="contact-info-item">
              <p className="text-xs text-muted uppercase tracking-wider mb-2">
                CALL US
              </p>
              <p className="text-white text-base">{phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Title + Description */}
        <div className="bg-black text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 contact-title">{title}</h1>
          <div className="contact-text-line text-muted text-sm leading-relaxed">
            {description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < description.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>

        {/* Image box with only image border */}
        <div className="bg-black px-6 pb-6">
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-white/20">
            <img
              src="imgs/contact/Group 90.webp"
              alt="Contact Us"
              className="w-full h-[120%] object-cover contact-image"
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-black text-white p-6 flex flex-col justify-center text-center contact-info-section">
          <h2 className="text-3xl font-bold text-white mb-6">정보</h2>

          <div className="mb-6 contact-info-item">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">
              ADDRESS
            </p>
            <p className="text-white text-sm">{address}</p>
          </div>

          <div className="contact-info-item">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">
              CALL US
            </p>
            <p className="text-white text-base">{phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;
