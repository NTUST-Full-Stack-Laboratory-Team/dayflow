"use client";
import { useEffect, useState } from "react";
import { ScheduleDto } from "./Constants";
import { DatePicker, Space } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

export default function MySchedule() {
    const [schedules, setSchedules] = useState<ScheduleDto[]>([]);

    // useEffect(() => {
    //     // 调用后端 API
    //     fetch('http://localhost:4000/schedules')
    //         .then(response => response.json())
    //         .then(data => setSchedules(data))
    //         .catch(error => console.error('Error fetching schedules:', error));
    // }, []);

    // const [todos, setTodos] = useState([]);
    // const [title, setTitle] = useState('');
    // const [thing, setThing] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:4000/schedules');
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    // const addTodo = async () => {
    // try {
    //     const response = await axios.post('http://localhost:3000/schedules', {
    //     title,
    //     thing,
    //     });
    //     setTodos([...todos, response.data]);
    //     setTitle('');
    //     setThing(false);
    // } catch (error) {
    //     console.error('Error adding todo:', error);
    // }
    // };

    // const deleteTodo = async (id) => {
    // try {
    //     await axios.delete(`http://localhost:3000/schedules/${id}`);
    //     setTodos(todos.filter((todo) => todo._id !== id));
    // } catch (error) {
    //     console.error('Error deleting todo:', error);
    // }
    // };

    return (
        <div>
            <h1>Schedules</h1>
            {schedules.map((schedule, _) => (
                <li>
                    <ul key={schedule.id}>{`${schedule.startTime} - ${schedule.endTime} - ${schedule.thing}`}</ul>
                </li>
            ))}
            <br></br>
            <TimePick />
        </div>
    );

    // return (
    // <div>
    //     <h1>Todo List</h1>
    //     <div>
    //     <input
    //         type="text"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         placeholder="Title"
    //     />
    //     <input
    //         type="checkbox"
    //         checked={thing}
    //         onChange={(e) => setThing(e.target.checked)}
    //     />
    //     <button onClick={addTodo}>Add Todo</button>
    //     </div>
    //     <ul>
    //     {todos.map((todo) => (
    //         <li key={todo._id}>
    //         {todo.title} - {todo.thing ? 'Done' : 'Not Done'}
    //         <button onClick={() => deleteTodo(todo._id)}>Delete</button>
    //         </li>
    //     ))}
    //     </ul>
    // </div>
    // );
}

const TimePick: React.FC = () => (
    <Space direction="vertical" size={12}>
      <RangePicker />
      <RangePicker showTime />
      <RangePicker picker="week" />
      <RangePicker picker="month" />
      <RangePicker picker="quarter" />
      <RangePicker
        picker="year"
        id={{
          start: 'startInput',
          end: 'endInput',
        }}
        onFocus={(_, info) => {
          console.log('Focus:', info.range);
        }}
        onBlur={(_, info) => {
          console.log('Blur:', info.range);
        }}
      />
    </Space>
  );