import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import RecommendationList from "./components/RecommendationList";

export default function HomePage() {
  // You can pass your company logo URL here
  // Example: <Sidebar logoUrl="/logo.png" companyName="Your Company" />
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar companyName="Veil" />
      <div className="flex-1 flex flex-col ml-64">
        <Header 
          title="Recommendations" 
          subtitle="AI-powered product optimization suggestions"
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-8 py-8">
            <RecommendationList />
          </div>
        </main>
      </div>
    </div>
  );
}
