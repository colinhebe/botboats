import { MainLayout } from "../components/layout/MainLayout";
import { loadLocalModel } from "../utils/llama";

export default function HomePage() {
  loadLocalModel().catch((err) => {
    console.error("Failed to load local model:", err);
  });
  return <MainLayout />;
}
