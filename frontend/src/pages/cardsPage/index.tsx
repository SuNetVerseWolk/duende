import UserSetItem from "@/components/UserSetItem";
import "../../app/globals.css";

export default function ContainerCards() {
  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-black via-[#1f2834] to-black px-4">
      <div className="w-lg h-100%">
        <UserSetItem />
      </div>
    </div>
  )
}