"use client"
import Todo from './todo'
import Memo from "./memo"
import Day from "./day"
import Completeness from './Completeness'
import Schedule from './schedule'
import MySchedule from './component/mySchedule'
import { Divider } from "antd";
import { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import DayFlowSVG from "../public/DayFlow.svg";
import bg from "../public/background2.jpg"

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [completeness, setCompleteness] = useState<number>(0);
  const weeklyPlanCardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!weeklyPlanCardRef)
      return;

    const width = weeklyPlanCardRef.current?.clientWidth ?? 0; // ?? equal to `!= undefined ? weeklyPlanCardRef.current?.clientWidth : 0`

    setOffset((width * -1) / 2);
  }, [weeklyPlanCardRef]);

  const calculateComplete = (percent: number, name: string) => {
    if (name === 'dayly') setCompleteness(percent);
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-md bg-cover" style={{ backgroundColor: "rgba(0, 0, 0, .2)" }}></div>

      <div className='flex h-screen w-full flex-row items-center justify-center' style={{ backgroundImage: `url('${bg.src}')`, backgroundRepeat: "no-repeat", backgroundSize: "100%" }}>
        <div className='flex flex-row items-center justify-center' style={{ position: "relative", left: `${offset}px` }}>

          <div className='weekly-plan-card  hover:transform-hover overflow-hidden hover:overflow-y-auto z-0 bg-[#FCFCFC] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] w-[20vw] h-[85vh]' ref={weeklyPlanCardRef}>
            <div className='group flex flex-col items-start h-full'>
              <span className='font-jacques-Francois ml-4 mt-6 text-[#CEA282] text-3xl h-16'>Weekly Plan</span>
              <div className='ml-4 w-5/6 h-5/6 overflow-hidden hover:overflow-y-auto'>
                <Todo name='weekly' countCompleteness={calculateComplete} />
              </div>
            </div>
          </div>

          <div className='overflow-hidden hover:overflow-y-auto z-0 bg-[#FCFCFC] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] flex w-[45vw] h-[90vh] flex-row justify-around' >
            <div className='mt-6 flex h-[85vh] w-2/5 flex-col items-start'>
              <div className='ml-4 w-full h-[10%]'>
                {/* <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Date</div> */}
                <Day />
              </div>
              <div className='ml-4 w-full h-[40%]'>
                <Divider />
                <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Day Todo</div>
                <div className='group w-full h-4/6 overflow-hidden hover:overflow-y-auto'>
                  <Todo name='dayly' countCompleteness={calculateComplete} />
                </div>
              </div>
              <div className='ml-4 w-full h-[45%]'>
                <Divider />
                <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Memo</div>
                <div className='h-[80%]'>
                  <Memo />
                </div>
              </div>
            </div>
            {/* <Divider type="vertical" /> */}
            <div className='ml-4 mt-6 w-3/6 h-[85vh]'>
              <div className='group w-full h-4/5'>
                <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Schedule</div>
                <div className='pt-2 h-[90%] overflow-hidden hover:overflow-y-auto'>
                  {/* {<Schedule />} */}
                  <MySchedule />
                </div>
              </div>
              <div className='w-full h-1/6'>
                <Divider />
                <div className='font-jacques-Francois text-2xl text-[#CEA282] w-full h-14'>Completeness</div>
                <Completeness percent={completeness} />
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}