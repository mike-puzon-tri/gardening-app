import { Typography } from '@material-tailwind/react';
import PlantList from '@/features/plants/plant-list';
import InputPlant from '@/features/plants/input-plant';
import InputBed from '@/features/beds/input-bed';
import BedList from '@/features/beds/bed-list';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <Typography variant="lead" className="mb-2 !text-gray-500 md:pr-16 xl:pr-28">
          The open source garden bed tool
        </Typography>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <InputPlant />
          <PlantList />
        </div>
        <div>
          <InputBed />
          <BedList />
        </div>          
      </div>      
    </div>
  );
}

export const element = <Home />;

export default Home;
