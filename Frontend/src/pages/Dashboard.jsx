import ChatBot from "../components/ChatBot";
import MoodHeatmap from "../components/MoodHeatmap";
import DiaryEntry from "../components/DiaryEntry";
import SmartReminder from "../components/SmartReminder";
import SmartTasks from "../components/SmartTasks";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f7f2f7] p-6 text-gray-800 font-sans grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1 bg-white rounded-2xl shadow-md p-4">
        <ChatBot />
      </div>
  <div className="col-span-2 bg-white rounded-2xl shadow-md p-4">
  <div className="flex flex-col gap-6">
    <MoodHeatmap />
    <DiaryEntry />
  </div>
</div>


<div className="col-span-1 flex flex-col gap-4">
  <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-4">
    <div className="h-[45vh] overflow-auto"> {/* 45% of viewport height */}
      <SmartReminder />
    </div>
    <div className="h-[45vh] overflow-auto"> {/* 45% of viewport height */}
      <SmartTasks />
    </div>
  </div>
</div>

    </div>
  );
}
