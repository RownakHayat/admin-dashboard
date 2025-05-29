"use client";

import Image from "next/image";

const Footer = ({ footerData }: any) => {
  const handleDownload = () => {
    const filePath = "/assets/File/SMEFoundation.apk"; // Correct path relative to the public directory
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "SMEFoundation.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <div className="w-full  py-10 ">
        <div className="custom_container">
          <div className="grid grid-cols-2 text-[#FFFFFF]">
            <div className="col-span-12 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6">
                <div className="space-y-6  leading-5 tracking-wider font-thin">
                  <div className="border-b-[1px] border-[#FFFFFF] py-2 flex items-center gap-5 cursor-pointer">
                    <h5 className="sm:text-[18px] lg:text-[23px] text-black font-bold ">
                      ডাউনলোড করুন{" "}
                    </h5>
                    <Image
                      priority={true}
                      src="/assets/Image/apkDownload.png"
                      alt="Apk Download"
                      width={128}
                      height={128}
                      className="docIcon"
                      onClick={handleDownload}
                    />
                    <a
                      href="https://testflight.apple.com/join/dwkvpHAm"
                      target="_blank"
                    >
                      <Image
                        priority={true}
                        src="/assets/Image/appleDownload.png"
                        alt="Apple Download"
                        width={128}
                        height={128}
                        className="docIcon"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full  py-10 bg-[#0C44B0] ">
        <div className="custom_container">
          <div className="grid grid-cols-2 text-[#FFFFFF]">
            <div className="col-span-12 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6">
                <div className="space-y-6  leading-5 tracking-wider font-thin">
                  <div className="border-b-[1px] border-[#FFFFFF] py-2">
                    <h5 className="sm:text-[18px] lg:text-[23px] ">
                      {footerData?.address_title}
                    </h5>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="sm:text-sm lg:text-[18px] mt-5 text-white text-opacity-90 ">
                        {footerData?.address_1}
                      </p>
                      <p className="sm:text-[5%] lg:text-[15px] mt-2 space-y-3 text-white text-opacity-85 ">
                        পর্যটন ভবন (লেভেল: ৬-৭)
                        <br />
                        ই-৫/সি-১, আগারগাঁও প্রশাসনিক এলাকা, শের-ই-বাংলা নগর,
                        ঢাকা-১২০৭, বাংলাদেশ ।
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h6 className="mt-5  text-[18px] text-white text-opacity-90 ">
                        {footerData?.address_2}
                      </h6>
                      <p className="  text-[15px] mt-2 text-white text-opacity-85 ">
                        জহির স্মার্ট টাওয়ার (৪র্থ তালা), ২০৫/১/এ, বেগম রোকেয়া
                        সরণি, তালতলা, ঢাকা-১২০৭, বাংলাদেশ ।{" "}
                      </p>
                      <p className="  text-[15px] mt-2 text-white text-opacity-85 ">
                        ফোন: +৮৮০২-৪১০২৪১০৮{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 ">
                <div
                  style={{
                    width: "96%",
                    height: "300px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #ccc",
                  }}
                  dangerouslySetInnerHTML={{ __html: footerData?.map_source }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
