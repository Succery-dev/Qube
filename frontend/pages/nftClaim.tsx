import React, { useEffect, useState, useRef } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Confetti from "react-confetti"

import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useAccount } from "wagmi";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { database } from "../utils";

import { HowToForClient, Spinner } from "../assets";

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
};

const Form: React.FC<FormComponentProps> = ({ swiperRef }) => {
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
    <div className="swiper-slide min-h-screen">
      <form className="h-screen flex flex-col items-start justify-center 2xl:mx-80 xl:mx-40 mx-20" onSubmit={handleSubmit}>
        <div className="mb-10 w-full">
          <label htmlFor="email" className="block mb-2 lg:text-4xl md:text-2xl text-xl font-medium">1. What's your mail address?</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={answers.email} 
            onChange={handleChange} 
            className="w-full p-2 outline-none bg-black text-xl"
            required={true}
            placeholder="official@0xqube.xyz"
          />
        </div>
        <div className="mb-10 w-full">
          <label htmlFor="twitterHandle" className="block mb-2 lg:text-4xl md:text-2xl text-xl font-medium">2. Your Twitter handle</label>
          <input 
            type="text" 
            id="twitterHandle" 
            name="twitterHandle" 
            value={answers.twitterHandle} 
            onChange={handleChange} 
            className="w-full p-2 outline-none bg-black text-xl"
            required={true}
            placeholder="@0xQube" 
          />
        </div>
        <div className="mb-20 w-full">
          <label htmlFor="pastProjects" className="block mb-2 lg:text-4xl md:text-2xl text-xl font-medium">3. Give us some project name your worked for (if any)</label>
          <input 
            type="text" 
            id="pastProjects" 
            name="pastProjects" 
            value={answers.pastProjects} 
            onChange={handleChange} 
            className="w-full p-2 outline-none bg-black text-xl"
            placeholder="(If any)" 
          />
        </div>
        {isLoading 
          ? <Image src={Spinner} width={100} height={100} alt="Loading..." className="mx-auto animate-spin-slow" /> 
          : <button type="submit" className="bg-gradient-to-r from-[#E220CF] to-white text-black font-bold text-2xl px-8 py-3 rounded-full mx-auto">Submit</button>
        }
      </form>
    </div>
  );
};

const ClaimSuccess: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const message = "NFT Claimしたよ的な文章とClaim PageへのLink";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;

  return (
    <div className="swiper-slide">
      <div className="h-screen 2xl:mx-80 md:mx-40 mx-20 xl:text-5xl md:text-3xl text-xl font-bold flex flex-col justify-center items-start">
        {isActive && <Confetti />}
        <p className="mb-3">Successfully claimed!</p>
        <p className="mb-20">We will get to you very soon.</p>
        <p className="mb-3">-{'>'} Till that Join our Discord:</p>
        <Link href="https://discord.com/invite/947wAFmwbZ" target="_blank" className="underline mb-20">https://discord.com/invite/947wAFmwbZ</Link>
        <Link href={twitterUrl} target="_blank" className="bg-gradient-to-r from-[#E220CF] to-white text-black font-bold text-2xl px-8 py-3 rounded-full mx-auto">Go to X</Link>
      </div>
    </div>
  );
};

const ClaimAlreadyDone: React.FC = () => {
  return (
    <div className="swiper-slide">
      <div className="h-screen xl:text-5xl md:text-3xl text-xl font-bold flex flex-col justify-center items-center">
        <p className="mb-3">You have already claimed the NFT.</p>
        <p>you will get onboarded soon!</p>
      </div>
    </div>
  );
};

const NftClaim: NextPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<Swiper | null>(null);

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

    swiperRef.current.on("slideChange", () => {
      const swiper = swiperRef.current;
      setActiveSlide(swiper.activeIndex);
    });
  }, []);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    const checkIfIdExistsInCollection = async (address: string) => {
      if (isConnected && address) {
        try {
          const docRef = doc(database, "users", address);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            swiperRef.current.slideTo(3, 0);
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

  return (
    <div className="swiper-container overflow-y-hidden text-white bg-custom-background bg-contain">
      <div className="swiper-wrapper">
        <Intro />
        <Form swiperRef={swiperRef} />
        <ClaimSuccess isActive={activeSlide === 2} />
        <ClaimAlreadyDone />
      </div>
    </div>
  );
};

export default NftClaim;
