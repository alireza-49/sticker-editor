import Editor from "@/components/editor";
import Header from "@/components/header";
import SideBar from "@/components/sidebar";

export default function Home() {
  return (
    <div className='w-full h-screen dark:bg-black'>
      <main className='w-full h-full'>
        <Header />
        <SideBar />
        <Editor />
      </main>
    </div>
  );
}
