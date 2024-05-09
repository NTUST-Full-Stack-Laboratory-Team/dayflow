import Todo from './todo'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'

export default function Home() {
  return (
    <div className='flex min-h-screen min-w-full flex-col items-center'>
      <h1>DayFlow</h1>
      <div className="flex min-h-screen min-w-full flex-row items-center justify-between">
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