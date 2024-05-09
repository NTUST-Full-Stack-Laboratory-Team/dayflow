import Todo from './todo'
import Image from "next/image";
import DayFlowSVG from "../public/DayFlow.svg";
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'

export default function Home() {
  return (
    <div className='flex min-h-screen min-w-full flex-col items-center'>
      <Image src={DayFlowSVG}
        width={200}
        height={200}
        alt="DayFlow" />
      <div className="flex min-h-screen min-w-full flex-row items-center justify-around">
        <div>
          <button>{<LeftCircleOutlined style={{ fontSize: '200%' }} />}</button>
        </div>
        <div className='flex flex-row items-center justify-start'>
          <Todo />&nbsp;
          <div>qwq</div>
        </div>
        <button>{<RightCircleOutlined style={{ fontSize: '200%' }} />}</button>
      </div>
    </div>
  );
}