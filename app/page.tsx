import Todo from './todo'
import Image from "next/image";
import DayFlowSVG from "../public/DayFlow.svg";
import { LeftCircleOutlined, RightCircleOutlined, SmileOutlined } from '@ant-design/icons'
import { Timeline } from 'antd';

export default function Home() {
  return (
    <div className="flex min-h-screen min-w-full flex-row items-center justify-around">
      <button>{<LeftCircleOutlined style={{ fontSize: '200%' }} />}</button>
      <div className='flex min-h-screen min-w-90 flex-col items-center'>
        <Image src={DayFlowSVG}
          width={200}
          height={200}
          alt="DayFlow" />
        <div className='flex flex-row items-center justify-start'>
          <div className="flex min-h-screen min-w-80 items-center justify-center">
            <Todo />&nbsp;
          </div>
          <div className="flex min-h-screen min-w-80 items-center justify-center">
            <Timeline
              items={[
                {
                  color: 'green',
                  children: 'Create a services site 2015-09-01',
                },
                {
                  color: 'green',
                  children: 'Create a services site 2015-09-01',
                },
                {
                  color: 'red',
                  children: (
                    <>
                      <p>Solve initial network problems 1</p>
                      <p>Solve initial network problems 2</p>
                      <p>Solve initial network problems 3 2015-09-01</p>
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <p>Technical testing 1</p>
                      <p>Technical testing 2</p>
                      <p>Technical testing 3 2015-09-01</p>
                    </>
                  ),
                },
                {
                  color: 'gray',
                  children: (
                    <>
                      <p>Technical testing 1</p>
                      <p>Technical testing 2</p>
                      <p>Technical testing 3 2015-09-01</p>
                    </>
                  ),
                },
                {
                  color: 'gray',
                  children: (
                    <>
                      <p>Technical testing 1</p>
                      <p>Technical testing 2</p>
                      <p>Technical testing 3 2015-09-01</p>
                    </>
                  ),
                },
                {
                  color: '#00CCFF',
                  dot: <SmileOutlined />,
                  children: <p>Custom color testing</p>,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <button>{<RightCircleOutlined style={{ fontSize: '200%' }} />}</button>
    </div>
  );
}