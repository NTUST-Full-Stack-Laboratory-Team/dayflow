import Todo from './todo'
import Schedule from "./schedule";

export default function Home() {
  //<Todo />
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Schedule />
    </main>
  );
}