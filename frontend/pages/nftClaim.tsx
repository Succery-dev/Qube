import React, { useEffect, useState, useRef } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import dotenv from "dotenv";
dotenv.config();

// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useAccount, useDisconnect } from "wagmi";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { database } from "../utils";

import { Spinner, Checkbox, X, Discord } from "../assets";

const Intro: React.FC = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="swiper-slide">
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="lg:text-5xl text-3xl font-bold mb-20">To use Qube, <span className="bg-gradient-to-r from-[#E220CF] to-white text-transparent bg-clip-text">Claim</span> your handle <span className="bg-gradient-to-r from-[#E220CF] to-white text-transparent bg-clip-text">Now</span>.</h1>
        <p className="lg:text-3xl text-xl mb-2">Get Onchain-data based resume, secure</p>
        <p className="lg:text-3xl text-xl mb-5">payment, influence analytic, <span className="text-[#E220CF]">all</span> with <span className="text-[#E220CF]">one handle</span></p>
        <p className="lg:text-2xl text-lg underline mb-5">Onboard before <span className="text-[#E220CF]">December</span> and get your NFT</p>
        <button type="button" className="bg-gradient-to-r from-[#E220CF] to-white text-black font-bold lg:text-2xl text-lg px-8 py-3 rounded-full mx-auto" onClick={openConnectModal}>Claim Handle</button>
      </div>
    </div>
  );
};

type FormComponentProps = {
  swiperRef: React.MutableRefObject<Swiper | null>;
  setPersonalInfo: React.Dispatch<React.SetStateAction<{
    email: string;
    twitterHandle: string;
  }>>;
};

const Form: React.FC<FormComponentProps> = ({ swiperRef, setPersonalInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const [answers, setAnswers] = useState({
    email: "",
    twitterHandle: "",
    pastProjects: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedAnswers = {
      email: answers.email.trim(),
      twitterHandle: answers.twitterHandle.trim(),
      pastProjects: answers.pastProjects.trim(),
    };

    setPersonalInfo({
      email: cleanedAnswers.email,
      twitterHandle: cleanedAnswers.twitterHandle,
    });

    console.log(cleanedAnswers);
    setIsLoading(true);

    try {
      const userDocRef = doc(database, "users", address);
      await setDoc(userDocRef, cleanedAnswers);
      console.log("User document written with ID: ", address);
      setAnswers({
        email: "",
        twitterHandle: "",
        pastProjects: ""
      });
      swiperRef.current.slideNext();
    } catch (error) {
      console.error("Error adding user document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="swiper-slide">
      <div className="h-screen pt-40 pb-20">
        <form className="h-full flex flex-col items-start justify-center 2xl:mx-80 xl:mx-40 md:mx-20 mx-10 bg-black shadow-custom-pink px-10 rounded-lg" onSubmit={handleSubmit}>
          <h1 className="mx-auto lg:text-6xl text-4xl text-[#E220CF] mb-10">Claim Handle</h1>
          <div className="mb-10 w-full">
            <label htmlFor="email" className="block mb-2 lg:text-2xl md:text-xl text-lg text-slate-500">e-mail address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={answers.email} 
              onChange={handleChange} 
              className="w-full p-2 outline-none bg-slate-900 text-xl"
              required={true}
            />
          </div>
          <div className="mb-10 w-full">
            <label htmlFor="twitterHandle" className="block mb-2 lg:text-2xl md:text-xl text-lg text-slate-500">Twitter Handle</label>
            <input 
              type="text" 
              id="twitterHandle" 
              name="twitterHandle" 
              value={answers.twitterHandle} 
              onChange={handleChange} 
              className="w-full p-2 outline-none bg-slate-900 text-xl"
              required={true}
            />
          </div>
          <div className="mb-5 w-full">
            <label htmlFor="pastProjects" className="block mb-2 lg:text-2xl md:text-xl text-lg text-slate-500">Projects name (if any)</label>
            <textarea 
              id="pastProjects" 
              name="pastProjects" 
              rows={4}
              value={answers.pastProjects} 
              onChange={handleChange} 
              className="w-full p-2 outline-none bg-slate-900 text-xl"
              placeholder="Mention projects you worked for ...................." 
            />
          </div>
          {isLoading 
            ? <Image src={Spinner} width={100} height={100} alt="Loading..." className="mx-auto animate-spin-slow" /> 
            : <button type="submit" className="bg-[#2D122F] text-[#D225C1] md:text-2xl text-lg py-3 w-full">Submit</button>
          }
        </form>
      </div>
    </div>
  );
};

interface PersonalInfo {
  email: string;
  twitterHandle: string;
}

interface ClaimSuccessProps {
  host: string;
  personalInfo: PersonalInfo;
}

const ClaimSuccess: React.FC<ClaimSuccessProps> = ({ host, personalInfo }) => {
  const message = 
`I have claimed my handle on Qube.

Qube is an "All in One" tool for creators in the gaming space. It protects creators from NON or DELAYED payments and makes their collaboration with projects smoother.
${host}/nftClaim`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;

  return (
    <div className="swiper-slide">
      <div className="min-h-screen flex lg:flex-row flex-col xl:p-40 sm:p-20 p-10 md:mt-0 mt-10 gap-10 font-bold xl:text-4xl text-2xl">
        <div className="bg-black flex-1 flex flex-col shadow-custom-pink-rb rounded-lg">
          <h1 className="bg-gradient-to-r from-[#E220CF] to-white w-min mx-auto bg-clip-text text-transparent mt-10">claimed!</h1>
          <div className="h-full flex flex-row items-center mx-10 gap-5">
            <Image src={Checkbox} height={100} width={100} alt="checkbox" />
            <div>
              <p className="mb-10">You will be notified when you're through the list</p>
              <p>e-mail:</p>
              <p className="xl:text-2xl text-lg break-all">{personalInfo.email}</p>
              <p>Twitter handle:</p>
              <p className="xl:text-2xl text-lg break-all">{personalInfo.twitterHandle}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-10">
          <div className="bg-black flex-1 flex items-center rounded-lg shadow-custom-pink-rb">
            <div className="h-full flex flex-row items-center mx-10 gap-5">
              <Image src={X} height={100} width={100} alt="X" />
              <div className="flex flex-col">
                <p className="mb-10">Tweet about your claiming handle!</p>
                <Link href={twitterUrl} target="_blank" className="bg-gradient-to-r from-[#E220CF] to-white text-black font-bold lg:px-8 px-5 lg:py-3 py-1 rounded-full mx-auto">Go to X</Link>
              </div>
            </div>
          </div>
          <div className="bg-black flex-1 flex items-center rounded-lg shadow-custom-pink-rb">
            <div className="h-full flex flex-row items-center mx-10 gap-5">
                <Image src={Discord} height={90} width={90} alt="Discord" />
                <div className="flex flex-col">
                  <p className="mb-10">Don't forget to join our discord community. </p>
                  <Link href={`${process.env.NEXT_PUBLIC_DISCORD_LINK}`} target="_blank" className="bg-gradient-to-r from-[#E220CF] to-white text-black font-bold lg:px-8 px-5 lg:py-3 py-1 rounded-full mx-auto">Join</Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const NftClaim: NextPage = () => {
  const swiperRef = useRef<Swiper | null>(null);
  const [host, setHost] = useState("");

  useEffect(() => {
    // init Swiper:
    swiperRef.current = new Swiper(".swiper-container", {
      // configure Swiper to use modules
      modules: [Navigation, Pagination],

      direction: "horizontal",
      loop: false,

      simulateTouch: false,
      allowTouchMove: false,

      autoHeight: true,
    });

    if (typeof window !== "undefined") {
      setHost(window.location.host);
    }
  }, []);

  const { address, isConnected } = useAccount();

  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    twitterHandle: "",
  });

  useEffect(() => {
    const checkIfIdExistsInCollection = async (address: string) => {
      if (isConnected && address) {
        try {
          const docRef = doc(database, "users", address);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            setPersonalInfo({
              email: docSnapshot.get("email"),
              twitterHandle: docSnapshot.get("twitterHandle"),
            });
            swiperRef.current.slideTo(2, 0);
          } else {
            swiperRef.current.slideNext();
          }
        } catch (error) {
          console.error("Error checking document existence: ", error);
        }
      } else {
        swiperRef.current.slideTo(0, 0);
      }
    }

    checkIfIdExistsInCollection(address);
  }, [isConnected, address]);

  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      disconnect();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="swiper-container overflow-y-hidden text-white bg-custom-background bg-contain">
      <div className="swiper-wrapper">
        <Intro />
        <Form swiperRef={swiperRef} setPersonalInfo={setPersonalInfo} />
        <ClaimSuccess host={host} personalInfo={personalInfo} />
      </div>
    </div>
  );
};

export default NftClaim;
