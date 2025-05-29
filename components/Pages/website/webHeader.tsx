"use client"; // Ensure this line is at the top

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useGetHomeDataQuery } from "@/store/features/home";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname instead of useRouter
import Header from "./header/header";
import { Menu } from "lucide-react";
import { useState } from "react";

const WebHeader = () => {
  const { data: listQuery } = useGetHomeDataQuery();
  const pathname = usePathname();
  const [isOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isOpen);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div>
      {/* Top Header */}
      <div className="col-span-12 border border-[Gray-sd-1] rounded flex justify-between items-center bg-white">
        <div className="custom_container flex justify-between">
          <Header headerData={listQuery?.data} />
        </div>
      </div>

      {/* Navbar  Menu */}
      <div className="bg-[#2B7D74] p-3">
        <div className="custom_container">
          <div className="items-center">
            {/* Toggle button for small screens */}
            <div className="flex justify-between lg:hidden">
              <div className="">
              <div className="absolute">
                <button
                  onClick={toggleMenu}
                  className="lg:hidden text-white focus:outline-none p-2"
                  aria-label="Toggle menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Small Screen Menu (Collapsible) */}
              <div className="relative mt-10">
                <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
                  <div className="sm:grid sm:grid-cols-1">
                    <div className="sm:col-span-1">
                      <Link href="/">
                        <Button className={`font-ruposhiBangla text-[15px] flex text-white text-opacity-90 ${isActive("/") ? "homeBtn shadow-[#9ac1bd]" : ""}`}>
                          <Icons.homeIcon className="text-white mr-2 " /> Home
                        </Button>
                      </Link>
                    </div>
                    <div className="sm:col-span-1">
                      <Link href="/website/aboutPlatform">
                        <Button className={`font-ruposhiBangla text-[15px] text-white text-opacity-85 ${isActive("/website/aboutPlatform") ? "homeBtn shadow-[#9ac1bd]" : ""}`}>
                          About Platform
                        </Button>
                      </Link>
                    </div>
                    <div className="sm:col-span-1">
                      <Link href="/website/eventList">
                        <Button className={`font-ruposhiBangla text-[15px] text-white text-opacity-85 ${isActive("/website/eventList") ? "homeBtn shadow-[#9ac1bd]" : ""}`}>
                          Event List
                        </Button>
                      </Link>
                    </div>
                    <div className="sm:col-span-1">
                      <Link href="/website/contact">
                        <Button className={`font-ruposhiBangla text-[15px] text-white text-opacity-85 ${isActive("/website/contact") ? "homeBtn shadow-[#9ac1bd]" : ""}`}>
                          Contact
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div className="text-end pt-2 sm:flex lg:hidden">
                <div className="flex justify-end h-10 gap-4">
                  <Link href="" legacyBehavior>
                    <a
                      href="https://www.facebook.com/SME.Foundation.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icons.facebook className="text-white" />
                    </a>
                  </Link>
                  <Link
                    href=""
                    onClick={() => (window.location.href = "mailto:services@smef.gov.bd")}
                  >
                    <Icons.message className="text-white" />
                  </Link>

                  <div className="flex">
                    <Icons.cellPhone className="text-white" />
                    <div className="ml-3">
                      {listQuery?.data?.header_info?.map((item: any, index: number) => (
                        <a
                          key={index}
                          href={`tel:${item?.mobile}`}
                          className="text-white font-bold"
                        >
                          {item?.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Screen Menu */}
            <div className={`lg:flex justify-between items-center ${isOpen ? 'hidden' : 'hidden'}`}>
              {/* Learge Screen  */}
              <div className="col-span-8 flex">
                <div className="flex">

                  <Link href="/">
                    <Button
                      className={`font-ruposhiBangla xs:text-[5%] sm:text-[10%] lg:text-[18px] flex text-white text-opacity-90 ${isActive("/") ? "homeBtn shadow-[#9ac1bd]" : ""
                        }`}
                    >
                      <Icons.homeIcon className="text-white mr-2 " /> Home
                    </Button>
                  </Link>
                  <Link href="/website/aboutPlatform">
                    <Button
                      className={`font-ruposhiBangla xs:text-[5%] sm:text-[10%] lg:text-[18px] text-white text-opacity-85 ${isActive("/website/aboutPlatform") ? "homeBtn shadow-[#9ac1bd]" : ""
                        }`}
                    >
                      About Platform
                    </Button>
                  </Link>
                  <Link href="/website/eventList">
                    <Button
                      className={`font-ruposhiBangla xs:text-[5%] sm:text-[10%] lg:text-[18px] text-white text-opacity-85 ${isActive("/website/eventList") ? "homeBtn shadow-[#9ac1bd]" : ""
                        }`}
                    >
                      Event List
                    </Button>
                  </Link>
                  <Link href="/website/contact">
                    <Button
                      className={`font-ruposhiBangla xs:text-[5%] sm:text-[10%] lg:text-[18px] text-white text-opacity-85 ${isActive("/website/contact") ? "homeBtn shadow-[#9ac1bd]" : ""
                        }`}
                    >
                      Contact
                    </Button>
                  </Link>
                  <Link href="/website/privacy-policy">
                    <Button
                      className={`font-ruposhiBangla xs:text-[5%] sm:text-[10%] lg:text-[18px] text-white text-opacity-85 ${isActive("/website/privacy-policy") ? "homeBtn shadow-[#9ac1bd]" : ""
                        }`}
                    >
                      Privacy Policy
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="col-span-4 text-end items-center">
                <div className="flex justify-end items-center h-10 gap-4">
                  <Link href="" legacyBehavior>
                    <a
                      href="https://www.facebook.com/SME.Foundation.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icons.facebook className="text-white" />
                    </a>
                  </Link>
                  <Link
                    href=""
                    onClick={() => (window.location.href = "mailto:services@smef.gov.bd")}
                  >
                    <Icons.message className="text-white" />
                  </Link>

                  <div className="flex">
                    <div className="ml-3">
                      <a href="tel:+8802-41024108" className="flex items-center">
                        <Icons.cellPhone className="text-white"/>
                        <div className="ml-3">
                         <span className="text-white font-bold">
                            +8802-41024108
                         </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebHeader;
