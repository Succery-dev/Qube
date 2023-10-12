import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Tilt from "react-parallax-tilt";

import { navLinks, aesthetics } from "../constants";
import { arrow, MenuIcon, CrossIcon } from "../assets";
import { Glow } from "./aesthetics";

// Framer-Motion Imports
import { motion, AnimatePresence } from "framer-motion";
import { hoverVariant, modalVariant, modalLinksVariant } from "../utils";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = (): JSX.Element => {
  const [showMenuModal, setShowMenuModal] = useState(false);
  const toggleMobileNav = () => {
    setShowMenuModal((prevShowMenuModal) => !prevShowMenuModal);
  };

  const { data: session } = useSession();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userType, setUserType] = useState("CLIENT");

  useEffect(() => {
    if (router.asPath === '/') {
      router.push("/?userType=CLIENT");
      setUserType("CLIENT");
    } else {
      const { userType } = router.query;
      setUserType(userType as string);
    }
  }, [router.asPath, router.query]);

  return (
    <nav className="w-full grid grid-cols-12 absolute text-secondary z-50">
      <div className="top-0 col-start-1 lg:col-start-2 col-end-13 lg:col-end-12 px-5 lg:px-0 xl:h-20 sm:h-14 h-20 flex flex-row xl:gap-20 lg:gap-10 sm:gap-5 w-full justify-between items-center bg-transparent">
        {/* Logo/Icon */}
        <motion.div variants={hoverVariant()} whileHover={"hover"}>
          <div className="flex items-center sm:gap-2 gap-4">
            <Image
              src="/images/logo.png"
              width="100"
              height="100"
              alt="Q"
              className="rounded-md xl:h-[50px] lg:h-[45px] sm:h-[40px] h-[40px] w-auto"
            />
            <h1 className="xl:text-2xl lg:text-xl sm:text-lg text-2xl text-primary font-extrabold lg:ml-4 sm:ml-0">
              Qube
            </h1>
          </div>
        </motion.div>

        {/* Navbar Links */}
        <ul
          className={`list-none flex-row grow ${
            router.pathname === "/" ? "hidden md:flex" : "hidden"
          }`}
        >
          {navLinks.map((link) => {
            return (
              <motion.li
                variants={hoverVariant()}
                whileHover={"hover"}
                key={link.id}
                className="xl:text-xl lg:text-md sm:text-sm font-medium cursor-pointer grow"
              >
                <Link href={`#${link.id}`}>
                  <p>
                    {link.title}
                    <Image
                      src={arrow}
                      alt="▼"
                      className="inline lg:ml-2 sm:ml-[2px] lg:h-[9px] sm:h-[6px]"
                    />
                  </p>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* User Type Select Dropdown Button */}
        <div className={`relative grow max-w-[200px] ${router.pathname === "/" ? "hidden md:block": "hidden"}`}>
          <button type="button" className="relative w-full rounded-md cursor-default bg-slate-800 py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span className="ml-3 block truncate font-bold">{userType}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>
          {isDropdownOpen &&
            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
              <li className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9" id="listbox-option-0" role="option" onClick={() => {
                const selectedType = userType === "CLIENT" ? "FREELANCER" : "CLIENT";
                router.push(`/?userType=${selectedType}`);
                setUserType(selectedType);
                setIsDropdownOpen(false);
              }}>
                <p className="ml-3 block truncate font-bold">{userType === "CLIENT" ? "FREELANCER" : "CLIENT"}</p>
              </li>
            </ul>
          }
        </div>

        {/* Small/Medium Devices Navbar */}
        <AnimatePresence>
          {showMenuModal && (
            <motion.div
              variants={modalVariant()}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`fixed w-screen h-screen top-0 left-0 backdrop-blur-md z-50 grid-cols-12 ${
                router.pathname === "/" ? "md:hidden grid" : "hidden"
              }`}
            >
              <div className="col-start-2 col-end-12 grid place-items-center">
                <Tilt className="w-full">
                  <div className="w-full blue-transparent-green-gradient rounded-xl p-[2px] flex flex-row items-center shadow-lg">
                    <div className="w-full bg-bg_primary rounded-xl px-8 relative">
                      <Glow styles={aesthetics.glow.mobileNavbarGlowStyles} />
                      <div className="flex flex-row w-full justify-between items-center absolute top-0 right-0 z-[99] px-8 mt-8">
                        <h2 className="text-3xl font-bold">Explore</h2>
                        <Image
                          src={CrossIcon}
                          alt="cross"
                          className="h-4 w-auto"
                          onClick={toggleMobileNav}
                        />
                      </div>
                      <ul className="list-none flex flex-col gap-12 grow pt-32 pb-14">
                        {navLinks.map((link, index) => {
                          return (
                            <motion.li
                              variants={modalLinksVariant(index)}
                              key={link.id}
                              className="text-xl font-semibold w-full"
                            >
                              <Link href={`#${link.id}`}>
                                <p className="w-full flex flex-row justify-between items-center">
                                  {link.title}
                                  <Image
                                    src={arrow}
                                    alt="▼"
                                    className="inline h-[8px]"
                                  />
                                </p>
                              </Link>
                            </motion.li>
                          );
                        })}
                        <div className="relative grow">
                          <button type="button" className="relative w-full rounded-md cursor-default bg-slate-800 py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <span className="ml-3 block truncate font-bold">{userType}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
                              </svg>
                            </span>
                          </button>
                          {isDropdownOpen &&
                            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3" tabIndex={-1}>
                              <li className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9" id="listbox-option-0" role="option" onClick={() => {
                                const selectedType = userType === "CLIENT" ? "FREELANCER" : "CLIENT";
                                router.push(`/?userType=${selectedType}`);
                                setUserType(selectedType);
                                setIsDropdownOpen(false);
                              }}>
                                <p className="ml-3 block truncate font-bold">{userType === "CLIENT" ? "FREELANCER" : "CLIENT"}</p>
                              </li>
                            </ul>
                          }
                        </div>
                      </ul>
                    </div>
                  </div>
                </Tilt>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Icon */}
        <Image
          src={MenuIcon}
          alt="Menu"
          className={`w-auto h-[20px] cursor-pointer ${
            router.pathname === "/" ? "block md:hidden" : "hidden"
          }`}
          onClick={toggleMobileNav}
        />

        {/* Connect Button */}
        <ConnectButton accountStatus={{ smallScreen: "avatar" }} />
      </div>
    </nav>
  );
};

export default Navbar;
