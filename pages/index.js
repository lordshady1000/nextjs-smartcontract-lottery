import Image from "next/image";
import { Inter } from "next/font/google";
//import Header from "../components/Headerhard";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
//
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <title>smart contract lottery</title>
      <Header />
      <br></br>
      <LotteryEntrance />
    </main>
  );
}
