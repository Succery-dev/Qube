import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import ReactStars from "react-stars";
import { ThirdwebSDK, SmartContract } from "@thirdweb-dev/sdk";

// Constants Imports
import { 
  aesthetics,
} from "../../constants";

// Interfaces Imports
import {
  SectionWrapperPropsInterface,
} from "../../interfaces";

// Framer-Motion Imports
import { motion } from "framer-motion";

import { Envelope } from "../../assets";

const SectionWrapper: React.FC<SectionWrapperPropsInterface> = ({
  children,
  // bgColor,
  // glowStyles,
}): JSX.Element => {
  return (
    <motion.div
      className={`w-full min-h-screen grid grid-cols-12 xl:py-20 sm:py-14 py-14 relative bg-custom-background bg-contain bg-fixed`}
    >
      {/* {glowStyles && <Glow styles={glowStyles} />} */}
      <div className="col-start-2 col-end-12 font-semibold relative">
        {children}
      </div>
    </motion.div>
  );
};

const Profile: NextPage = () => {
  const openseaBaseUrl = `${process.env.NEXT_PUBLIC_OPENSEA_URL}/${process.env.NEXT_PUBLIC_NFT_COLLECTION_CONTRACT_ADDRESS}`;
  const router = useRouter();
  const { walletAddress } = router.query;

  const [userInfo, setUserInfo] = useState({
    email: "",
    profileImageUrl: "",
    userType: "",
    username: "",
    projectNftIds: [],
  });
  const [projectNfts, setProjectNfts] = useState([]);
  const [nftContract, setNftContract] = useState<SmartContract | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/user/${walletAddress}`);
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

    const fetchContract = async () => {
      const sdk = new ThirdwebSDK(process.env.NEXT_PUBLIC_CHAIN, {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });

      const contract = await sdk.getContract(process.env.NEXT_PUBLIC_NFT_COLLECTION_CONTRACT_ADDRESS);
      setNftContract(contract);
    }

    if (walletAddress) {
      fetchUserInfo();
      fetchContract();
    }
  }, [walletAddress]);

  useEffect(() => {
    async function fetchProjectNFTs() {
      if (nftContract != null && userInfo.projectNftIds.length > 0) {
        const nfts = await Promise.all(
          userInfo.projectNftIds.map(projectNftId => 
            nftContract.erc721.get(projectNftId)
          )
        );
        setProjectNfts(nfts);
      }
    }
  
    fetchProjectNFTs();
  }, [userInfo.projectNftIds, nftContract]);
  
  return (
    <div className="font-nunito text-secondary">
      <SectionWrapper
        bgColor="bg-bg_primary"
        glowStyles={aesthetics.glow.dashboardGlowStyles}
      >
        <Image
          src={userInfo.profileImageUrl}
          alt="Profile Image"
          className="rounded-full mx-auto bg-black border-2 border-pink-500"
          width={150}
          height={150}
        />
        <div className="flex justify-center gap-5 mt-5">
          <p className="text-3xl">{userInfo.username}</p>
          <Link href={`mailto:${userInfo.email}`} target="_blank">
            <Image
              src={Envelope}
              alt="Envelope"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <h1 className="text-4xl my-10">Proof of Work</h1>
        <div className="grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {projectNfts.length > 0 ? (
            projectNfts.map((projectNft, index) => {
              return (
                <div key={index}>
                  <Link href={`${openseaBaseUrl}/${projectNft.metadata.id}`} target="_blank">
                    <Image
                      src={projectNft.metadata.image}
                      alt={`Qube Project NFT #${projectNft.metadata.id}`}
                      className="rounded-full bg-black border-2 border-[#641e5a] shadow-custom-pink transition-transform duration-300 hover:scale-110"
                      width={200}
                      height={200}
                    />
                  </Link>
                  <p className="text-xl mt-5">Name: {projectNft.metadata.name.length > 10 ? `${projectNft.metadata.name.substring(0, 10)}...` : projectNft.metadata.name}</p>
                  <div className="flex gap-1 items-center text-xl">
                    <p>Rating:</p>
                    <ReactStars
                      count={5}
                      value={((projectNft.metadata.attributes).find(element => element.trait_type === "RATING")).value}
                      size={20}
                      edit={false}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-3xl col-span-5 text-center">No NFTs available</p>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Profile;