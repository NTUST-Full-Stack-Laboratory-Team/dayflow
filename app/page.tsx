import Todo from './todo'
import Memo from "./memo"
import Day from "./day"
import Completeness from './Completeness'
import Schedule from './schedule'
import { Divider } from "antd";
import Image from "next/image";
import DayFlowSVG from "../public/DayFlow.svg";

export default function Home() {
  return (
    <div className='bg-[#FCFCFC] flex h-screen w-full flex-row items-center justify-center'>
      <div className='relative left-10 z-0 hover:z-50 bg-[#FCFCFC] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] w-[20vw] h-[85vh]'>
        <div className='group flex flex-col items-start h-full'>
          <span className='font-jacques-Francois ml-4 mt-6 text-[#CEA282] text-3xl w-full h-16'>Weekly Plan</span>
          <div className='ml-4 w-5/6 h-5/6 overflow-scroll'>
            <Todo />
          </div>
        </div>
      </div>
      <div className='z-10 bg-[#FCFCFC] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] flex w-[45vw] h-[90vh] flex-row justify-around'>
        <div className='mt-6 flex h-full w-2/5 flex-col items-start'>
          <div className='ml-4 w-full h-auto'>
            {/* <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Date</div> */}
            <Day />
          </div>
          <div className='ml-4 w-full h-1/3'>
            <Divider />
            <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Day Todo</div>
            <div className='group w-full h-4/6 overflow-scroll'>
              <Todo />
            </div>
          </div>
          <div className='ml-4 w-full h-1/3'>
            <Divider />
            <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Memo</div>
            <Memo />
          </div>
        </div>
        {/* <Divider type="vertical" /> */}
        <div className='ml-4 mt-6 w-3/6'>
          <div className='w-full h-4/5'>
            <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Schedule</div>
            <div className='h-[90%] overflow-scroll'>
              <Schedule />
            </div>
          </div>
          <div className='w-full h-1/5'>
            <Divider />
            <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Completeness</div>
            <Completeness />
          </div>
        </div>
      </div>
    </div>
  );
}