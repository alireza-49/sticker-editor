import Editor from "@/components/editor";
import Header from "@/components/header";

export default function Home() {
  return (
    <main className='w-full h-full grid grid-rows-[56px_1fr]'>
      <Header />
      <Editor />
    </main>
  );
}
