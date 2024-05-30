import { useQuery, gql } from '@apollo/client';
import PlantImage from './plant-image';

export const GET_PLANTS = gql`
  query {
    plants {
      id
      name
      width
      height
    }
  }
`;

function PlantList() {
  const { loading, error, data } = useQuery(GET_PLANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <h4>Available Plants</h4>
      <div className="grid grid-cols-2">
        {data.plants.map((item) => (
          <div key={item.id} className="my-2 flex flex-row items-center	text-lg">
            <PlantImage name={item.name} />
            {item.name} ({item.width} x {item.height})
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlantList;
