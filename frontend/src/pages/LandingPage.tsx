import React from "react";

export const Landing = (): JSX.Element => {
  return (
    <div className="relative w-[1440px] h-[1024px] bg-white overflow-hidden ">
      <div className="absolute w-[1450px] h-[129px] top-[895px] left-0">
        <div className="relative w-[1440px] h-[129px] blur-sm [background:linear-gradient(180deg,rgba(0,0,0,0)_0%,rgb(0,0,0)_100%)]">
          <div className="absolute w-[62px] top-[64px] left-[1241px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[14px] tracking-[0] leading-[normal]">
            LinkedIn
          </div>
          <div className="absolute w-[85px] top-[64px] left-[1137px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[14px] tracking-[0] leading-[normal]">
            CONTACT
          </div>
          <div className="absolute w-[85px] top-[64px] left-[1045px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[14px] tracking-[0] leading-[normal]">
            REPORT
          </div>
          <div className="absolute w-[80px] top-[64px] left-[947px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[14px] tracking-[0] leading-[normal]">
            VIDEO
          </div>
          <div className="absolute w-[80px] top-[64px] left-[852px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[14px] tracking-[0] leading-[normal]">
            REPO
          </div>
        </div>
      </div>
      <div className="absolute w-[1214px] h-[677px] top-[148px] left-[158px]">
        <p className="absolute w-[490px] top-0 left-[92px] [font-family:'Maven_Pro-Bold',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-[normal]">
          NEO ChatBot Creator Web App
        </p>
        <button className="all-[unset] box-border absolute w-[159px] h-[48px] top-[402px] left-[822px]">
          <div className="relative w-[157px] h-[48px] bg-[#a1e5c8]">
            <div className="absolute w-[136px] top-[8px] left-[11px] [font-family:'Maven_Pro-SemiBold',Helvetica] font-semibold text-black text-[24px] tracking-[0] leading-[normal]">
              Get Started
            </div>
          </div>
        </button>
        <p className="absolute w-[248px] top-[524px] left-[786px] [font-family:'Maven_Pro-Medium',Helvetica] font-medium text-white text-[14px] text-center tracking-[0] leading-[20px]">
          Eugenio Manlapaz
          <br />
          20100113
          <br />
          Higher Diploma in Computer Science
        </p>
        <img
          className="absolute w-[625px] h-[625px] top-[52px] left-0 object-cover"
          alt="Ellipse"
          src="ellipse-1.png"
        />
        <p className="absolute w-[414px] top-[221px] left-[694px] [font-family:'Maven_Pro-Regular',Helvetica] font-normal text-white text-[20px] text-center tracking-[0] leading-[30px]">
          NeoChatBot is a web-based AI chat bot creator platform designed for
          ease of use and customization. It enables users to create and
          customize chat bots making it suitable for a wide range of
          applications.
        </p>
        <div className="absolute w-[506px] top-[150px] left-[700px] [font-family:'Maven_Pro-Bold',Helvetica] font-bold text-white text-[40px] tracking-[0] leading-[normal]">
          Build. Fine Tune. Talk.
        </div>
      </div>
      <div className="absolute w-[1440px] h-[142px] top-0 left-0 blur-sm [background:linear-gradient(180deg,rgb(255,255,255)_0%,rgba(255,255,255,0)_100%)]" />
    </div>
  );
};
