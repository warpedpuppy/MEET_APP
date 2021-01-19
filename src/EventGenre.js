import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EventGenre = ({events}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(() => getData());
  }, [events]);

  const getData = () => {
    const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'AngularJS'];
    const data = genres.map((genre) => {
      const value = events.filter(({ summary }) => summary.split(' ').includes(genre)).length;
      return { name: genre, value };
    });
    return data;
  };

  const colors = ['#52D726', '#FFEC00', '#FF7300', '#FF0000', '#007ED6'];

  return (
    <ResponsiveContainer height={400} >
      <PieChart width={400} height={400}>
        <Pie
        data={data} cx={200} cy={200} labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value"
        label={({ name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
        {
          data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} name={entry.name}/>)
        }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}



export default EventGenre;