import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

import { navLinks, aesthetics } from "../constants";
import { arrow, MenuIcon, CrossIcon, Spinner } from "../assets";
import { Glow } from "./aesthetics";

import dotenv from "dotenv";
dotenv.config();

// Framer-Motion Imports
import { motion, AnimatePresence } from "framer-motion";
import { hoverVariant, modalVariant, modalLinksVariant, database, storage } from "../utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAccount, useDisconnect } from "wagmi";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = (): JSX.Element => {
  const [showMenuModal, setShowMenuModal] = useState(false);
  const toggleMobileNav = () => {
    setShowMenuModal((prevShowMenuModal) => !prevShowMenuModal);
  };

  const { data: session } = useSession();
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [userInfo, setUserInfo] = useState({
    email: "",
    profileImageUrl: "",
    userType: "",
    username: "",
    projectNftIds: [],
  });

  useEffect(() => {
    const checkIfIdExistsInCollection = async (address: string) => {
      if (isConnected && address && router.asPath !== "/nftClaim") {
        try {
          const docRef = doc(database, "users", address);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const docData = docSnapshot.data();
  
            if (!docData.profileImageUrl || !docData.username || !docData.email || !docData.userType) {
              setShowEmailModal(true);
            }
          } else {
            setShowEmailModal(true);
          }
        } catch (error) {
          console.error("Error checking document existence: ", error);
        }
      }
    }

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/user/${address}`);
        console.log("userInfo: ", res.data);
        setUserInfo({
          email: res.data.email,
          profileImageUrl: res.data.profileImageUrl,
          userType: res.data.userType,
          username: res.data.username,
          projectNftIds: res.data.projectNftIds == undefined ? [] : res.data.projectNftIds,
        });
      } catch (error) {
        console.log("Error has occured with /api/user/[walletAddress].ts");
      }
    };

    if (isConnected && address) {
      checkIfIdExistsInCollection(address);
      fetchUserInfo();
    }
  }, [isConnected, address, router.asPath]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");

  const [showEmailModal, setShowEmailModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("image: ", imageSrc);
    console.log("username: ", username);
    console.log("email: ", email);
    console.log("confirmEmail: ", confirmEmail);
    console.log("userType: ", selectedUserType);

    if (!imageSrc || !selectedFile) {
      alert("Image upload is mandatory. Please select an image.");
      return;
    }

    if (email !== confirmEmail) {
      alert("The email addresses you entered do not match. Please ensure they are the same and try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Create a storage ref
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split(".").pop();
      const storageRef = ref(storage, `users/${address}/profile_images/profile_${timestamp}.${fileExtension}`);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Listen for state changes, errors, and completion of the upload.
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          }, 
          (error) => reject(error), 
          () => resolve(uploadTask.snapshot.ref)
        );
      });

      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("Upload is complete: ", downloadUrl);

      const docRef = doc(database, "users", address);
      await setDoc(docRef, {
        profileImageUrl: downloadUrl,
        username: username,
        email: email,
        userType: selectedUserType,
      });

      setShowEmailModal(false);
    } catch (error) {
      console.error("Error setting document: ", error);
    } finally {
      setIsLoading(false);
    }
    
    setImageSrc("");
    setUsername("");
    setEmail("");
    setConfirmEmail("");
    setSelectedUserType("");
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    alert("Please do not use copy and paste. Enter the email address manually.");
  };
    
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userType, setUserType] = useState("CREATOR");

  useEffect(() => {
    if (router.asPath === '/') {
      router.push("/?userType=CREATOR");
      setUserType("CREATOR");
    } else {
      const { userType } = router.query;
      setUserType(userType as string);
    }
  }, [router.asPath, router.query]);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      
      reader.onload = (loadEvent) => {
        const src = loadEvent.target?.result;
        setImageSrc(src as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <nav className="w-full absolute z-50 text-white flex flex-row lg:px-20 md:px-2 px-10 gap-5 items-center justify-between mt-3">
        {/* Logo/Icon */}
        <motion.div
          variants={hoverVariant()} 
          whileHover={"hover"}
        >
          <Image
            src="/images/Qube.jpg"
            width="100"
            height="100"
            alt="Q"
            className="rounded-md xl:h-[50px] lg:h-[45px] sm:h-[40px] h-[40px] w-auto"
          />
        </motion.div>

        {/* Navbar Links */}
        <ul
          className={`list-none grow ${
            router.pathname === "/" ? "hidden md:flex" : "hidden"
          }`}
        >
          {navLinks.map((link) => {
            return (
              <motion.li
                variants={hoverVariant()}
                whileHover={"hover"}
                key={link.id}
                className="xl:text-xl lg:text-md sm:text-sm font-medium cursor-pointer mx-auto"
              >
                <Link href={`#${link.id}`}>
                  <p>{link.title}</p>
                </Link>
              </motion.li>
            );
          })}
        </ul>
        
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
                              const selectedType = userType === "COMPANY" ? "CREATOR" : "COMPANY"; router.push(`/?userType=${selectedType}`); setUserType(selectedType); setIsDropdownOpen(false);
                            }}>
                              <p className="ml-3 block truncate font-bold">{userType === "COMPANY" ? "CREATOR" : "COMPANY"}</p>
                            </li>
                          </ul>
                        }
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Icon */}
        <Image
          src={MenuIcon}
          alt="Menu"
          className={`w-auto h-[20px] cursor-pointer ml-auto ${
            router.pathname === "/" ? "block md:hidden" : "hidden"
          }`}
          onClick={toggleMobileNav}
        />

        {/* Join Discord Button */}
        <Link 
          href={`${process.env.NEXT_PUBLIC_DISCORD_LINK}`}
          target="_blank"
          className={`border border-white hover:bg-purple-500 ease-in duration-300 rounded-full lg:px-5 px-3 lg:py-2 py-1 ${router.pathname === "/" ? "hidden md:block": "hidden"}`}
        >
          JOIN DISCORD
        </Link>

        {/* Connect Button */}
        {router.pathname !== "/"
          ? (
              <div className="flex gap-5 items-center">
                <div className={router.asPath.split("/")[1] === "profile" ? "hidden" : "block"}>
                  <ConnectButton accountStatus={{ smallScreen: "avatar" }} label="CONNECT WALLET"/>
                </div>
                <Image
                  src={userInfo.profileImageUrl}
                  alt="Profile Image"
                  className={`rounded-full bg-black border-2 border-pink-500 transition-transform duration-300 hover:scale-110 ${router.asPath.split("/")[1] === "dashboard" ? "block" : "hidden"}`}
                  width={50}
                  height={50}
                  onClick={() => router.push(`/profile/${address}`)}
                />
                {/* Return to Dashboard Button */}
                <button 
                  className={`bg-gradient-to-r from-[#DF57EA] to-slate-200 mr-auto px-7 py-3 rounded-full text-black ${(router.asPath.split("/")[1] === "profile" && isConnected) ? "block" : "hidden"}`} 
                  onClick={() => {
                    router.push(`/dashboard/${address}`);
                  }}
                >
                  DASHBOARD
                </button>
              </div>
          ) : router.query.close === "beta"
            ? <ConnectButton accountStatus={{ smallScreen: "avatar" }} label="LAUNCH APP" />
            : null
        }

        {/* User Type Select Dropdown Button */}
        <div className={`relative grow max-w-[140px] ${router.pathname === "/" ? "hidden md:block": "hidden"}`}>
          <button type="button" className="relative w-full rounded-md cursor-default py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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
                const selectedType = userType === "COMPANY" ? "CREATOR" : "COMPANY";
                router.push(`/?userType=${selectedType}${router.query.close !== undefined ? "&close=beta" : ""}`);
                setUserType(selectedType);
                setIsDropdownOpen(false);
              }}>
                <p className="ml-3 block truncate font-bold">{userType === "COMPANY" ? "CREATOR" : "COMPANY"}</p>
              </li>
            </ul>
          }
        </div>
      </nav>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            variants={modalVariant()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed w-screen h-screen top-0 left-0 backdrop-blur-md z-[100] grid grid-cols-12 text-white font-nunito"
          >
            <div className="col-start-2 col-end-12 xl:col-start-4 xl:col-end-10 grid place-items-center">
              <div className="w-full border border-[#E220CF] shadow-custom-pink rounded-xl p-[2px] flex flex-row items-center overflow-y-auto">
                <div className="w-full max-h-[95vh] bg-black rounded-xl px-4 py-6 sm:p-8 md:p-10 lg:p-8 xl:p-10 relative">
                  {/* Header */}
                  <div className="flex flex-row w-full justify-between items-center top-0 right-0 z-[100]">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E220CF]">
                      Onboarding
                    </h2>
                    {!isLoading &&
                      <Image
                        src={CrossIcon}
                        alt="cross"
                        className="h-4 w-auto cursor-pointer"
                        onClick={() => {
                          disconnect();
                          setShowEmailModal(false);
                        }}
                      />
                    }
                  </div>
                  {/* Main */}
                  <form onSubmit={handleSubmit} className="flex flex-col mt-8 gap-5">
                    <h3 className="text-xl">Photo</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                        {imageSrc ? (
                          <img src={imageSrc} alt="Profile preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            {/* Placeholder icon or text */}
                            <span className="text-gray-300">No image</span>
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="h-[1px] bg-gray-500"></div>
                    <h3 className="text-xl">Username</h3>
                    <input 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} 
                      className="p-2 border rounded w-full text-black" 
                      placeholder="Enter your username" 
                      required
                    />
                    <div className="h-[1px] bg-gray-500"></div>
                    <h3 className="text-xl">Email</h3>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-2 border rounded w-full text-black"
                      placeholder="Enter your email address"
                      required
                    />
                    <input
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      className="p-2 border rounded w-full text-black"
                      placeholder="Confirm your email address"
                      onPaste={handlePaste}
                      required
                    />
                    <div className="h-[1px] bg-gray-500"></div>
                    <h3 className="text-xl">User Type</h3>
                    <div className="flex items-center gap-x-3">
                      <input 
                        id="recipient" 
                        name="userType" 
                        type="radio" 
                        className="h-4 w-4 border-gray-300"
                        value="recipient"
                        checked={selectedUserType === "recipient"}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                        required 
                      />
                      <label htmlFor="recipient" className="block leading-6 text-white">Creator</label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input 
                        id="depositor" 
                        name="userType" 
                        type="radio" 
                        className="h-4 w-4 border-gray-300"
                        value="depositor"
                        checked={selectedUserType === "depositor"}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                      />
                      <label htmlFor="depositor" className="text-white">Company</label>
                    </div>
                    <p className="text-sm text-center text-gray-400">
                      By sending your information, you agree to the<br/>
                      <Link href="https://www.notion.so/veroo/Terms-Conditions-4d914da1b7cc4f959e94f8bf513ca328" target="_blank" className="text-blue-300 hover:underline">Terms and Conditions</Link> and <Link href="https://www.notion.so/veroo/Privacy-and-Policy-0ef230ec7f81439baa1e0d4d6b78cfe8" target="_blank" className="text-blue-300 hover:underline">Privacy Policy</Link>
                    </p>
                    <p className="text-sm text-center text-gray-400">※Currently, you cannot change the information entered above.</p>
                    {isLoading
                      ? (
                        <div className="flex flex-row items-center justify-center text-2xl text-green-400">
                          <Image
                            src={Spinner}
                            alt="spinner"
                            className="animate-spin-slow h-20 w-auto"
                          />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex flex-row items-center justify-end gap-14 py-4 px-4">
                          <button
                            type="submit"
                            className="bg-[#E220CF] hover:bg-[#e220cf94] text-white py-2 px-4 rounded transition duration-150"
                          >
                            Send
                          </button>
                          <button
                            className="bg-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-400 transition duration-150"
                            onClick={() => {
                              disconnect();
                              setShowEmailModal(false);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )
                    }
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
