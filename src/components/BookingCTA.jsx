import { useState, useEffect } from "react";
import { PopupModal } from "react-calendly";

export default function BookingCTA({ location, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rootElement, setRootElement] = useState(null);

  useEffect(() => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    setRootElement(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const handleClick = () => {
    console.log("calendly_opened", location);
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 min-h-[44px] bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-5 py-2.5 rounded-full transition-colors shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] ${className}`}
      >
        📞 Book Free 15-min Call
      </button>
      {rootElement && (
        <PopupModal
          url="https://calendly.com/tusharkokane366/30min"
          open={isOpen}
          onModalClose={() => setIsOpen(false)}
          rootElement={rootElement}
        />
      )}
    </>
  );
}
