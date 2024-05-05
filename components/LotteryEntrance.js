import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

//function to enter the lottery
export default function LotteryEntrance() {
  const { chainId: chainIdhex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdhex);
  const [fee, setFee] = useState();
  const [numplayers, setNumPlayers] = useState();
  const [recentwinner, setRecentwinner] = useState();

  const dispatch = useNotification();

  let raffleAddress;

  if (chainId in contractAddress) {
    raffleAddress = contractAddress[chainId][0];
  } else {
    // Handle the scenario where there's no address for the chain
    raffleAddress = null;
    // You can also set raffleContractAddress to null or a default value here
  }
  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: fee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const feeFromCall = (await getEntranceFee()).toString();
    const numplayersFromCall = (await getNumberOfPlayers()).toString();
    const recentwinnerFromCall = await getRecentWinner();
    setFee(feeFromCall);
    setNumPlayers(numplayersFromCall);
    setRecentwinner(recentwinnerFromCall);
  }
  //

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "",
    });
  };

  {
    if (raffleAddress) {
      return (
        <div>
          This is the last winner : <span>{recentwinner}</span>
          <br></br>
          <br></br>
          This is the number of players in the raffle: <span>{numplayers}</span>
          <br></br>
          <br></br>
          This is the entrance fee:
          <span> {fee && ethers.utils.formatUnits(fee, 18)} ETH</span>
          <br></br>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isFetching || isLoading ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
        </div>
      );
    } else {
      return <div>No Raffle Address detected</div>;
    }
  }
}
